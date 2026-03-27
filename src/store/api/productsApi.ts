import { baseApi } from './baseApi';

/**
 * Products API using RTK Query.
 */
export const productsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<any[], void>({
      query: () => 'products',
      providesTags: ['Financials'], // Using existing tags or adding new ones in baseApi
    }),
    getProductByStatus: builder.query<any[], number>({
      query: (statusId) => `products?orderStatusId=${statusId}`,
    }),
  }),
});

export const { useGetProductsQuery, useGetProductByStatusQuery } = productsApi;
