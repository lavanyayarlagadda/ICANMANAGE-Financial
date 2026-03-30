import { baseApi } from './baseApi';

/**
 * Products API using RTK Query.
 */
export const productsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<unknown[], void>({
      query: () => 'products',
      providesTags: ['Financials'], // Using existing tags or adding new ones in baseApi
    }),
    getProductByStatus: builder.query<unknown[], number>({
      query: (statusId) => `products?orderStatusId=${statusId}`,
    }),
  }),
});

export const { useGetProductsQuery, useGetProductByStatusQuery } = productsApi;
