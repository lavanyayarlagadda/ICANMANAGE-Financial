import { createApi, fetchBaseQuery, BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { RootState } from '../index';
import { logout, updateToken } from '../slices/authSlice';

// Base URLs for different services
export const AUTH_BASE_URL = 'http://localhost:9000/api/v1';
export const FINANCIALS_BASE_URL = 'http://localhost:8281/api/v1';

const baseQuery = fetchBaseQuery({
  baseUrl: '/', // Will be overridden in the custom base query
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.accessToken;
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  // Determine the base URL based on a custom property or a naming convention
  let url = typeof args === 'string' ? args : args.url;
  let fullArgs = typeof args === 'string' ? { url: args } : { ...args };

  // Logic to switch between AUTH and FINANCIALS
  // Default to FINANCIALS if not specified
  const baseUrl = (extraOptions as any)?.service === 'auth' ? AUTH_BASE_URL : FINANCIALS_BASE_URL;
  fullArgs.url = `${baseUrl}/${url.startsWith('/') ? url.slice(1) : url}`;

  let result = await baseQuery(fullArgs, api, extraOptions);

  if (result.error && result.error.status === 401) {
    // If we get a 401, we just logout since no refresh API is available
    api.dispatch(logout());
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
