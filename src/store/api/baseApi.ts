import { createApi, fetchBaseQuery, BaseQueryFn, FetchArgs, FetchBaseQueryError, BaseQueryApi } from '@reduxjs/toolkit/query/react';
import { RootState } from '../index';
import { logout, updateToken } from '../slices/authSlice';
import { API_CONFIG, COMPANIES } from '@/config/constants';

const BASE_URL = import.meta.env.VITE_API_URL || API_CONFIG.BASE_URL;

if (import.meta.env.DEV) {
  console.log(`Using API Base URL:`, BASE_URL);
}

const toRootState = (state: unknown): RootState | null => {
  if (!state || typeof state !== 'object') {
    return null;
  }

  const candidate = state as Partial<RootState>;
  if (!candidate.auth || !candidate.tenant) {
    return null;
  }

  return candidate as RootState;
};

const baseQuery = fetchBaseQuery({
  baseUrl: '/', // Will be overridden in the custom base query
  prepareHeaders: (headers, { getState, endpoint }) => {
    const state = toRootState(getState());
    if (!state) {
      console.warn('[BaseAPI] State not available for headers');
      return headers;
    }

    const token = state.auth.accessToken;
    if (token) {
      console.log(`[BaseAPI] Setting token for request:`, endpoint);
      headers.set('authorization', `Bearer ${token}`);
    } else {
      console.warn(`[BaseAPI] No token available for authenticated request:`, endpoint);
    }

    // Add tenant ID header, but ONLY for specific company users and NOT for getTenants call
    const isSpecialCompanyUser = state.auth.user?.company?.toLowerCase() === COMPANIES.COGNITIVE_HEALTH_IT;
    const tenants = state.tenant?.tenants || [];
    const selectedTenantId = state.tenant?.selectedTenantId;
    const selectedTenant = tenants.find(t => t.tenantId === selectedTenantId) || tenants[0];
    
    if (isSpecialCompanyUser && endpoint !== 'getTenants') {
      const tenantHeaderValue = selectedTenant?.displayName || selectedTenantId;
      if (tenantHeaderValue) {
        headers.set('x-tenantid', tenantHeaderValue);
      }
    }

    return headers;
  },
});

export interface DefinitionExtraOptions {
  service?: 'auth' | 'financials';
}

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError,
  DefinitionExtraOptions
> = async (args, api: BaseQueryApi, extraOptions: DefinitionExtraOptions) => {
  // Determine the base URL based on a custom property or a naming convention
  const url = typeof args === 'string' ? args : args.url;
  const fullArgs = typeof args === 'string' ? { url: args } : { ...args };

  // Logic to switch between AUTH and FINANCIALS
  // Default to FINANCIALS if not specified
  const baseUrl = BASE_URL;
  fullArgs.url = `${baseUrl}/${url.startsWith('/') ? url.slice(1) : url}`;

  let result = await baseQuery(fullArgs, api, extraOptions);

  if (result.error && result.error.status === 401) {
    const currentState = toRootState(api.getState());
    const refreshToken = currentState?.auth.refreshToken;

    if (refreshToken) {
      // Try to refresh the token
      const refreshResult = await baseQuery(
        {
          url: `${BASE_URL}/auth/refresh`,
          method: 'POST',
          body: { refreshToken },
        },
        api,
        extraOptions
      );

      if (refreshResult.data) {
        // Successful refresh
        const { accessToken, refreshToken: newRefreshToken } = refreshResult.data as { accessToken: string; refreshToken: string };

        // Update the token in the store
        api.dispatch(updateToken({ accessToken, refreshToken: newRefreshToken }));

        // Retry the original query with the new token
        result = await baseQuery(fullArgs, api, extraOptions);
      } else {
        // Refresh failed, logout
        api.dispatch(logout());
      }
    } else {
      // No refresh token available, logout
      api.dispatch(logout());
    }
  }
  return result;
};

/**
 * Base API slice using RTK Query with re-authentication logic.
 */
export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Descriptions', 'Financials', 'Auth', 'UserPermissions'],
  endpoints: () => ({}),
});
