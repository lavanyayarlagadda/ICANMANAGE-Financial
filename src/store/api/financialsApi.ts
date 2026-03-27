import { baseApi } from './baseApi';
import { 
  PaymentTransaction, 
  CollectionAccount, 
  BankDepositEntity, 
  RemittanceDetail, 
} from '@/interfaces/financials';
import {
  PaymentSearchRequest,
  PaymentSearchResponse,
  PipSearchRequest,
  PipSearchResponse,
  ServiceLineSearchRequest,
  ServiceLineSearchResponse,
  FeeScheduleVarianceDetailsResponse,
  PaymentVarianceDetailsResponse,
  FeeScheduleVarianceSummaryResponse,
  PaymentVarianceSummaryResponse,
  DateRangeParams,
  PipSummaryResponse,
  ForecastSummaryResponse,
  ReconciliationPerformanceResponse,
  ForecastDashboardResponse,
  ExecutiveSummaryResponse,
  PaymentMixResponse,
  AdjustmentBreakdownResponse,
  PayerPerformanceResponse
} from '@/interfaces/api';

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
    getRemittanceClaims: builder.query<RemittanceDetail, string>({
      query: (claimId) => `financials/payments/remittance-claims/${claimId}`,
      providesTags: ['Financials'],
    }),
    searchServiceLines: builder.query<ServiceLineSearchResponse, ServiceLineSearchRequest>({
      query: (body) => ({
        url: '/financials/payments/service-lines/search ',
        method: 'POST',
        body,
      }),
      providesTags: ['Financials'],
    }),
    exportPayments: builder.query<Blob, { fromDate: string; toDate: string; format: 'pdf' | 'xlsx' }>({
      query: (params) => ({
        url: `financials/export/payments`,
        params,
        responseHandler: (response) => response.blob(),
      }),
    }),
    exportPip: builder.query<Blob, { fromDate: string; toDate: string; format: 'pdf' | 'xlsx' }>({
      query: (params) => ({
        url: `financials/export/pip`,
        params,
        responseHandler: (response) => response.blob(),
      }),
    }),
    searchFeeScheduleVariance: builder.query<FeeScheduleVarianceDetailsResponse, PipSearchRequest>({
      query: (body) => ({
        url: 'financials/fee-schedule-variance/details/search',
        method: 'POST',
        body,
      }),
      providesTags: ['Financials'],
    }),
    getFeeScheduleVarianceSummary: builder.query<FeeScheduleVarianceSummaryResponse, DateRangeParams>({
      query: (params) => ({
        url: 'financials/fee-schedule-variance/summary',
        params,
      }),
      providesTags: ['Financials'],
    }),
    searchPaymentVariance: builder.query<PaymentVarianceDetailsResponse, PipSearchRequest>({
      query: (body) => ({
        url: 'financials/payment-variance/details/search',
        method: 'POST',
        body,
      }),
      providesTags: ['Financials'],
    }),
    getPaymentVarianceSummary: builder.query<PaymentVarianceSummaryResponse, DateRangeParams>({
      query: (params) => ({
        url: 'financials/payment-variance/summary',
        params,
      }),
      providesTags: ['Financials'],
    }),
    getPipSummary: builder.query<PipSummaryResponse, DateRangeParams>({
      query: (params) => ({
        url: 'financials/pip/summary',
        params,
      }),
      providesTags: ['Financials'],
    }),
    getForecastSummary: builder.query<ForecastSummaryResponse, DateRangeParams>({
      query: (params) => ({
        url: 'financials/forecast-trends/summary',
        params,
      }),
      providesTags: ['Financials'],
    }),
    getReconciliationPerformance: builder.query<ReconciliationPerformanceResponse, DateRangeParams>({
      query: (params) => ({
        url: 'financials/forecast-trends/ReconciliationPerformance',
        params,
      }),
      providesTags: ['Financials'],
    }),
    getForecastDashboard: builder.query<ForecastDashboardResponse, DateRangeParams>({
      query: (params) => ({
        url: 'financials/forecast-trends/dashboard',
        params,
      }),
      providesTags: ['Financials'],
    }),
    getExecutiveSummary: builder.query<ExecutiveSummaryResponse, DateRangeParams>({
      query: (params) => ({
        url: 'financials/executive-summary',
        params,
      }),
      providesTags: ['Financials'],
    }),
    getPaymentMix: builder.query<PaymentMixResponse, DateRangeParams>({
      query: (params) => ({
        url: 'financials/executive-summary/payment-mix',
        params,
      }),
      providesTags: ['Financials'],
    }),
    getAdjustmentBreakdown: builder.query<AdjustmentBreakdownResponse, DateRangeParams>({
      query: (params) => ({
        url: 'financials/executive-summary/adjustment-breakdown',
        params,
      }),
      providesTags: ['Financials'],
    }),
    getPayerPerformance: builder.query<PayerPerformanceResponse, DateRangeParams>({
      query: (params) => ({
        url: 'financials/forecast-trends/payer-performance',
        params,
      }),
      providesTags: ['Financials'],
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
  useSearchFeeScheduleVarianceQuery,
  useGetFeeScheduleVarianceSummaryQuery,
  useSearchPaymentVarianceQuery,
  useGetPaymentVarianceSummaryQuery,
  useGetPipSummaryQuery,
  useGetForecastSummaryQuery,
  useGetReconciliationPerformanceQuery,
  useGetForecastDashboardQuery,
  useGetExecutiveSummaryQuery,
  useGetPaymentMixQuery,
  useGetAdjustmentBreakdownQuery,
  useGetPayerPerformanceQuery,
} = financialsApi;
