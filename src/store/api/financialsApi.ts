import { baseApi } from './baseApi';
import { PaymentTransaction, CollectionAccount, BankDepositEntity, PipRecord } from '@/types/financials';

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
  data: {
    content: PaymentTransaction[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
  }
}

export interface PipSearchRequest {
  page: number;
  size: number;
  sort: string;
  desc: boolean;
  fromDate: string;
  toDate: string;
}

export interface PipSearchResponse {
  data: {
    content: PipRecord[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
  }
}

export interface ServiceLineSearchRequest {
  page: number;
  size: number;
  sort: string;
  desc: boolean;
  check: string;
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
    searchPip: builder.query<PipSearchResponse, PipSearchRequest>({
      query: (body) => ({
        url: 'financials/pip/search',
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
    getRemittanceClaims: builder.query<any, string>({
      query: (claimId) => `financials/payments/remittance-claims/${claimId}`,
      providesTags: ['Financials'],
    }),
    searchServiceLines: builder.query<any, ServiceLineSearchRequest>({
      query: (body) => ({
        url: '/financials/payments/service-lines/search ',
        method: 'POST',
        body,
      }),
      providesTags: ['Financials'],
    }),
    exportPayments: builder.query<any, { fromDate: string; toDate: string; format: 'pdf' | 'xlsx' }>({
      query: (params) => ({
        url: `financials/export/payments`,
        params,
        responseHandler: (response) => response.blob(),
      }),
    }),
    exportPip: builder.query<any, { fromDate: string; toDate: string; format: 'pdf' | 'xlsx' }>({
      query: (params) => ({
        url: `financials/export/pip`,
        params,
        responseHandler: (response) => response.blob(),
      }),
    }),

  }),
});

export const {
  useGetPaymentsQuery,
  useSearchPaymentsQuery,
  useSearchPipQuery,
  useGetCollectionsQuery,
  useGetBankDepositsQuery,
  useGetRemittanceClaimsQuery,
  useLazyGetRemittanceClaimsQuery,
  useSearchServiceLinesQuery,
  useLazySearchServiceLinesQuery,
  useLazyExportPaymentsQuery,
  useLazyExportPipQuery,
} = financialsApi;
