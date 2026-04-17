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
        service: 'auth',
      }),
    }),
  }),
});

export const { useGetTenantsQuery } = tenantApi;
