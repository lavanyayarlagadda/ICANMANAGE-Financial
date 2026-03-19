import { baseApi } from './baseApi';
import { PaymentTransaction, CollectionAccount, BankDepositEntity } from '@/types/financials';

export interface PaymentSearchRequest {
  page: number;
  size: number;
  sort: string;
  desc: boolean;
  status: string | null;
  fromDate: string;
  toDate: string;
}

export interface PaymentSearchResponse {
  content: PaymentTransaction[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

/**
 * Financials API using RTK Query.
 * Injects endpoints into the base API.
 */
export const financialsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPayments: builder.query<PaymentTransaction[], void>({
      query: () => 'payments',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Financials' as const, id })),
              { type: 'Financials', id: 'LIST' },
            ]
          : [{ type: 'Financials', id: 'LIST' }],
    }),
    searchPayments: builder.query<PaymentSearchResponse, PaymentSearchRequest>({
      query: (body) => ({
        url: 'financials/payments/search',
        method: 'POST',
        body,
      }),
      providesTags: ['Financials'],
    }),
    getCollections: builder.query<CollectionAccount[], void>({
      query: () => 'collections',
      providesTags: ['Financials'],
    }),
    getBankDeposits: builder.query<BankDepositEntity[], void>({
      query: () => 'bank-deposits',
      providesTags: ['Financials'],
    }),
    // Example mutation
    deletePayment: builder.mutation<void, string>({
      query: (id) => ({
        url: `payments/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Financials', id },
        { type: 'Financials', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useGetPaymentsQuery,
  useSearchPaymentsQuery,
  useGetCollectionsQuery,
  useGetBankDepositsQuery,
  useDeletePaymentMutation,
} = financialsApi;
