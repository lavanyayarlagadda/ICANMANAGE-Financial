import { createApi, fetchBaseQuery, BaseQueryFn, FetchArgs, FetchBaseQueryError, BaseQueryApi } from '@reduxjs/toolkit/query/react';
import { RootState } from '../index';
import { logout, updateToken } from '../slices/authSlice';


export const BASE_URL = import.meta.env.PROD
  ? import.meta.env.VITE_API_URL_PROD
  : import.meta.env.VITE_API_URL_TEST || 'http://10.0.1.48:8181/platform/api/v1';

console.log(`Using API Base URL (${import.meta.env.MODE}):`, BASE_URL);

const baseQuery = fetchBaseQuery({
  baseUrl: '/', // Will be overridden in the custom base query
  prepareHeaders: (headers, { getState, endpoint }) => {
    const state = getState() as RootState;
    const token = state.auth.accessToken;
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }

    // Add tenant ID header, but ONLY for MindPath company users and NOT for getTenants call
    const isMindPathUser = state.auth.user?.company?.toLowerCase() === 'cognitivehealthit';
    const selectedTenantId = state.tenant?.selectedTenantId;
    if (isMindPathUser && selectedTenantId && endpoint !== 'getTenants') {
      headers.set('x-tenant-id', selectedTenantId);
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
    const refreshToken = (api.getState() as RootState).auth.refreshToken;

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
  tagTypes: ['Descriptions', 'Financials', 'Auth'],
  endpoints: () => ({}),
});
