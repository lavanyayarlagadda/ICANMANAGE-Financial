import { baseApi } from './baseApi';

export interface Tenant {
  tenantId: string;
  displayName: string;
}

export const tenantApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTenants: builder.query<Tenant[], void>({
      query: () => ({
        url: 'tenants',
        service: 'auth', // Based on the URL http://localhost:8281/api/v1/tenants but user said /api/v1/tenants
      }),
      // Based on baseApi.ts, FINANCIALS_BASE_URL is 8281. AUTH is 9000.
      // User says http://localhost:8281/api/v1/tenants -> that's FINANCIALS service (default)
    }),
  }),
});

export const { useGetTenantsQuery } = tenantApi;
