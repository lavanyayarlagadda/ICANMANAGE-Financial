import { baseApi } from "./baseApi";
import {
  PipSearchRequest,
  PipSearchResponse,
  PipSummaryResponse,
  ForecastSummaryResponse,
  ReconciliationPerformanceResponse,
  ForecastDashboardResponse,
  ExecutiveSummaryResponse,
  PaymentMixResponse,
  AdjustmentBreakdownResponse,
  PayerPerformanceResponse,
  DateRangeParams
} from "@/interfaces/api";

export const analyticsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    searchPip: builder.query<PipSearchResponse, PipSearchRequest>({
      query: (body) => ({
        url: "financials/pip/search",
        method: "POST",
        body,
      }),
      providesTags: ["Analytics"],
    }),
    getPipSummary: builder.query<PipSummaryResponse, DateRangeParams>({
      query: (params) => ({
        url: "financials/pip/summary",
        params,
      }),
      providesTags: ["Analytics"],
    }),
    getForecastSummary: builder.query<ForecastSummaryResponse, DateRangeParams>(
      {
        query: (params) => ({
          url: "financials/forecast-trends/summary",
          params,
        }),
        providesTags: ["Analytics"],
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
      providesTags: ["Analytics"],
    }),
    getForecastDashboard: builder.query<
      ForecastDashboardResponse,
      DateRangeParams
    >({
      query: (params) => ({
        url: "financials/forecast-trends/dashboard",
        params,
      }),
      providesTags: ["Analytics"],
    }),
    getExecutiveSummary: builder.query<
      ExecutiveSummaryResponse,
      DateRangeParams
    >({
      query: (params) => ({
        url: "financials/executive-summary",
        params,
      }),
      providesTags: ["Analytics"],
    }),
    getPaymentMix: builder.query<PaymentMixResponse, DateRangeParams>({
      query: (params) => ({
        url: "financials/executive-summary/payment-mix",
        params,
      }),
      providesTags: ["Analytics"],
    }),
    getAdjustmentBreakdown: builder.query<
      AdjustmentBreakdownResponse,
      DateRangeParams
    >({
      query: (params) => ({
        url: "financials/executive-summary/adjustment-breakdown",
        params,
      }),
      providesTags: ["Analytics"],
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
      providesTags: ["Analytics"],
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
  }),
});

export const {
  useSearchPipQuery,
  useGetPipSummaryQuery,
  useGetForecastSummaryQuery,
  useGetReconciliationPerformanceQuery,
  useGetForecastDashboardQuery,
  useGetExecutiveSummaryQuery,
  useGetPaymentMixQuery,
  useGetAdjustmentBreakdownQuery,
  useGetPayerPerformanceQuery,
  useLazyExportPipQuery,
} = analyticsApi;
