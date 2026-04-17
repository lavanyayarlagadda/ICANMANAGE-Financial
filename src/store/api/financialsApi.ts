import { baseApi } from "./baseApi";
import {
  PaymentTransaction,
  CollectionAccount,
  BankDepositEntity,
  RemittanceDetail,
} from "@/interfaces/financials";
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
  PayerPerformanceResponse,
  RawRemittanceClaimsResponse,
  RemittanceClaimsResponse,
  AllTransactionSearchResponse,
  RecoupmentSearchResponse,
  OtherAdjustmentSearchResponse,
  BankDepositSearchResponse,
  ForwardBalanceNoticeSearchResponse,
  TableSearchRequest,
  SuspenseAccountSearchResponse,
  PaymentPostingStatus,
  PaymentStatusResponse
} from "@/interfaces/api";

import { normalizeRemittanceClaims } from "@/utils/normalizeRemittanceClaims";

/**
 * Financials API using RTK Query.
 * Injects endpoints into the base API.
 */
export const financialsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    searchPayments: builder.query<PaymentSearchResponse, PaymentSearchRequest>({
      query: (body) => ({
        url: "financials/payments/search",
        method: "POST",
        body,
      }),
      providesTags: ["Financials"],
    }),
    getPaymentStatus: builder.query<PaymentStatusResponse, void>({
      query: () => '/financials/posting-status/list',
    }),

    searchPip: builder.query<PipSearchResponse, PipSearchRequest>({
      query: (body) => ({
        url: "financials/pip/search",
        method: "POST",
        body,
      }),
      providesTags: ["Financials"],
    }),
    searchCollections: builder.query<
      { data: { content: CollectionAccount[]; totalElements: number } },
      TableSearchRequest
    >({
      query: (body) => ({
        url: "financials/collections/search",
        method: "POST",
        body,
      }),
      providesTags: ["Financials"],
    }),
    getRemittanceClaims: builder.query<RemittanceDetail[], { claimId: string; }>({
      query: ({ claimId, ...params }) => ({
        url: `financials/payments/remittance-claims/${claimId}`,
        params
      }),
      transformResponse: (
        response: RawRemittanceClaimsResponse,
      ): RemittanceClaimsResponse => normalizeRemittanceClaims(response),
      providesTags: ["Financials"],
    }),
    searchServiceLines: builder.query<
      ServiceLineSearchResponse,
      ServiceLineSearchRequest
    >({
      query: (body) => ({
        url: "/financials/payments/service-lines/search",
        method: "POST",
        body,
      }),
      providesTags: ["Financials"],
    }),
    exportPayments: builder.query<
      Blob,
      DateRangeParams & { format: "pdf" | "xlsx" }
    >({
      query: (params) => ({
        url: `financials/export/payments`,
        params,
        responseHandler: (response) => response.blob(),
      }),
    }),
    exportPip: builder.query<
      Blob,
      DateRangeParams & { format: "pdf" | "xlsx" }
    >({
      query: (params) => ({
        url: `financials/export/pip`,
        params,
        responseHandler: (response) => response.blob(),
      }),
    }),
    exportRecoupments: builder.query<
      Blob,
      DateRangeParams & { format: "pdf" | "xlsx" }
    >({
      query: (params) => ({
        url: `financials/export/transactions/recoupments`,
        params,
        responseHandler: (response) => response.blob(),
      }),
    }),
    exportOtherAdjustments: builder.query<
      Blob,
      DateRangeParams & { format: "pdf" | "xlsx" }
    >({
      query: (params) => ({
        url: `financials/export/transactions/adjustments`,
        params,
        responseHandler: (response) => response.blob(),
      }),
    }),
    exportAllTransactions: builder.query<
      Blob,
      DateRangeParams & { format: "pdf" | "xlsx" }
    >({
      query: (params) => ({
        url: `financials/export/transactions/all`,
        params,
        responseHandler: (response) => response.blob(),
      }),
    }),
    exportBankDeposits: builder.query<
      Blob,
      DateRangeParams & { format: "pdf" | "xlsx" }
    >({
      query: (params) => ({
        url: `financials/export/bank-deposits`,
        params,
        responseHandler: (response) => response.blob(),
      }),
    }),
    exportForwardBalanceNotices: builder.query<
      Blob,
      DateRangeParams & { format: "pdf" | "xlsx" }
    >({
      query: (params) => ({
        url: `financials/export/forward-balance-notices`,
        params,
        responseHandler: (response) => response.blob(),
      }),
    }),
    exportSuspenseAccounts: builder.query<
      Blob,
      DateRangeParams & { format: "pdf" | "xlsx" }
    >({
      query: (params) => ({
        url: `financials/export/suspense-accounts`,
        params,
        responseHandler: (response) => response.blob(),
      }),
    }),
    exportCollections: builder.query<
      Blob,
      DateRangeParams & { format: "pdf" | "xlsx" }
    >({
      query: (params) => ({
        url: `financials/export/collections`,
        params,
        responseHandler: (response) => response.blob(),
      }),
    }),
    searchFeeScheduleVariance: builder.query<
      FeeScheduleVarianceDetailsResponse,
      PipSearchRequest
    >({
      query: (body) => ({
        url: "financials/fee-schedule-variance/details/search",
        method: "POST",
        body,
      }),
      providesTags: ["Financials"],
    }),
    getFeeScheduleVarianceSummary: builder.query<
      FeeScheduleVarianceSummaryResponse,
      DateRangeParams
    >({
      query: (params) => ({
        url: "financials/fee-schedule-variance/summary",
        params,
      }),
      providesTags: ["Financials"],
    }),
    searchPaymentVariance: builder.query<
      PaymentVarianceDetailsResponse,
      PipSearchRequest
    >({
      query: (body) => ({
        url: "financials/payment-variance/details/search",
        method: "POST",
        body,
      }),
      providesTags: ["Financials"],
    }),
    getPaymentVarianceSummary: builder.query<
      PaymentVarianceSummaryResponse,
      DateRangeParams
    >({
      query: (params) => ({
        url: "financials/payment-variance/summary",
        params,
      }),
      providesTags: ["Financials"],
    }),
    getPipSummary: builder.query<PipSummaryResponse, DateRangeParams>({
      query: (params) => ({
        url: "financials/pip/summary",
        params,
      }),
      providesTags: ["Financials"],
    }),
    exportFeeScheduleVariance: builder.query<
      Blob,
      DateRangeParams & { format: "pdf" | "xlsx" }
    >({
      query: (params) => ({
        url: `financials/export/fee-schedule-variance`,
        params,
        responseHandler: (response) => response.blob(),
      }),
    }),
    exportPaymentVariance: builder.query<
      Blob,
      DateRangeParams & { format: "pdf" | "xlsx" }
    >({
      query: (params) => ({
        url: `financials/export/payment-variance`,
        params,
        responseHandler: (response) => response.blob(),
      }),
    }),
    getForecastSummary: builder.query<ForecastSummaryResponse, DateRangeParams>(
      {
        query: (params) => ({
          url: "financials/forecast-trends/summary",
          params,
        }),
        providesTags: ["Financials"],
      },
    ),
    getReconciliationPerformance: builder.query<
      ReconciliationPerformanceResponse,
      DateRangeParams
    >({
      query: (params) => ({
        url: "financials/forecast-trends/ReconciliationPerformance",
        params,
      }),
      providesTags: ["Financials"],
    }),
    getForecastDashboard: builder.query<
      ForecastDashboardResponse,
      DateRangeParams
    >({
      query: (params) => ({
        url: "financials/forecast-trends/dashboard",
        params,
      }),
      providesTags: ["Financials"],
    }),
    getExecutiveSummary: builder.query<
      ExecutiveSummaryResponse,
      DateRangeParams
    >({
      query: (params) => ({
        url: "financials/executive-summary",
        params,
      }),
      providesTags: ["Financials"],
    }),
    getPaymentMix: builder.query<PaymentMixResponse, DateRangeParams>({
      query: (params) => ({
        url: "financials/executive-summary/payment-mix",
        params,
      }),
      providesTags: ["Financials"],
    }),
    getAdjustmentBreakdown: builder.query<
      AdjustmentBreakdownResponse,
      DateRangeParams
    >({
      query: (params) => ({
        url: "financials/executive-summary/adjustment-breakdown",
        params,
      }),
      providesTags: ["Financials"],
    }),
    getPayerPerformance: builder.query<
      PayerPerformanceResponse,
      DateRangeParams
    >({
      query: (body) => ({
        url: "financials/forecast-trends/payer-performance",
        method: "POST",
        body,
      }),
      providesTags: ["Financials"],
    }),
    searchAllTransactions: builder.query<
      AllTransactionSearchResponse,
      TableSearchRequest
    >({
      query: (body) => ({
        url: "financials/all-transactions",
        method: "POST",
        body,
      }),
      providesTags: ["Financials"],
    }),
    searchRecoupments: builder.query<
      RecoupmentSearchResponse,
      TableSearchRequest
    >({
      query: (body) => ({
        url: "/financials/transactions/recoupments",
        method: "POST",
        body,
      }),
      providesTags: ["Financials"],
    }),
    searchOtherAdjustments: builder.query<
      OtherAdjustmentSearchResponse,
      TableSearchRequest
    >({
      query: (body) => ({
        url: "financials/transactions/adjustments",
        method: "POST",
        body,
      }),
      providesTags: ["Financials"],
    }),
    searchBankDepositsBody: builder.query<
      BankDepositSearchResponse,
      TableSearchRequest
    >({
      query: (body) => ({
        url: "financials/bank-deposits",
        method: "POST",
        body,
      }),
      providesTags: ["Financials"],
    }),
    searchForwardBalanceNotices: builder.query<
      ForwardBalanceNoticeSearchResponse,
      TableSearchRequest
    >({
      query: (body) => ({
        url: "financials/forward-balance-notices",
        method: "POST",
        body,
      }),
      providesTags: ["Financials"],
    }),
    searchSuspenseAccounts: builder.query<
      SuspenseAccountSearchResponse,
      TableSearchRequest
    >({
      query: (body) => ({
        url: "financials/suspense-accounts",
        method: "POST",
        body,
      }),
      providesTags: ["Financials"],
    }),
  }),
});

export const {
  useSearchPaymentsQuery,
  useSearchPipQuery,
  useGetRemittanceClaimsQuery,
  useLazyGetRemittanceClaimsQuery,
  useSearchServiceLinesQuery,
  useLazySearchServiceLinesQuery,
  useLazyExportPaymentsQuery,
  useLazyExportPipQuery,
  useLazyExportRecoupmentsQuery,
  useLazyExportOtherAdjustmentsQuery,
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
  useLazyExportFeeScheduleVarianceQuery,
  useLazyExportPaymentVarianceQuery,
  useLazyExportAllTransactionsQuery,
  useLazyExportBankDepositsQuery,
  useLazyExportForwardBalanceNoticesQuery,
  useLazyExportSuspenseAccountsQuery,
  useLazyExportCollectionsQuery,
  useSearchAllTransactionsQuery,
  useSearchRecoupmentsQuery,
  useSearchOtherAdjustmentsQuery,
  useSearchBankDepositsBodyQuery,
  useSearchForwardBalanceNoticesQuery,
  useSearchSuspenseAccountsQuery,
  useSearchCollectionsQuery,
  useGetPaymentStatusQuery
} = financialsApi;
