import { baseApi } from './baseApi';
import { PaymentTransaction, CollectionAccount, BankDepositEntity, PipRecord, RemittanceDetail, ServiceLine, FeeScheduleVariance, PaymentVariance, FeeScheduleVarianceSummary, PaymentVarianceSummary, PayerPerformanceRecord } from '@/types/financials';

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

export interface ServiceLineSearchResponse {
  data: {
    content: ServiceLine[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
  }
}

export interface FeeScheduleVarianceDetailsResponse {
  data: {
    content: FeeScheduleVariance[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
  }
}

export interface PaymentVarianceDetailsResponse {
  data: {
    content: PaymentVariance[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
  }
}

export interface FeeScheduleVarianceSummaryResponse {
  data: FeeScheduleVarianceSummary;
}

export interface PaymentVarianceSummaryResponse {
  data: PaymentVarianceSummary;
}

export interface DateRangeParams {
  fromDate: string;
  toDate: string;
}

export interface PipSummaryResponse {
  data: {
    totalPaidAmount: number;
    totalSuspenseBalance: number;
    actionRequired: number;
  };
  message: string | null;
}

export interface ForecastSummaryResponse {
  data: {
    totalAmountReconciled: number;
    totalAmountUnreconciled: number;
    globalReconciliationRate: number;
    avgDaysToReconcile: number;
  };
  message: string | null;
}

export interface ReconciliationPerformanceResponse {
  data: {
    month: string;
    actualReconciledAmount: string | null;
    forecastAmount: string | null;
  }[];
  message: string | null;
}

export interface ForecastDashboardResponse {
  data: {
    team: string;
    reconciledCheckCountPct: string;
    unreconciledCheckCountPct: string;
    checkCountPctByTeam: string;
    reconciledCheckCount: string;
    unreconciledCheckCount: string;
    reconciledAmountPct: string;
    unreconciledAmountPct: string;
    amountPctByTeam: string;
    totalAmountPosted: string;
    totalAmountNotPosted: string;
    avgDaysToReconcile: string | null;
  }[];
  message: string | null;
}

export interface ExecutiveSummaryResponse {
  data: {
    totalCollectionsMtd: number;
    collectionsSubtext: string;
    reconciliationRate: number;
    reconSubtext: string;
    openSuspense: number;
    suspenseSubtext: string;
    avgDaysToReconcile: number;
    avgDaysSubtext: string;
  };
  message: string | null;
}

export interface PaymentMixResponse {
  data: {
    eftCount: number;
    otherCount: number;
  };
  message: string | null;
}

export interface AdjustmentBreakdownResponse {
  data: {
    denialCount: number;
    patientRespCount: number;
    contractualCount: number;
    otherAdjCount: number;
  };
  message: string | null;
}

export interface PayerPerformanceResponse {
  data: PayerPerformanceRecord[];
  message: string | null;
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
