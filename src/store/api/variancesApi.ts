import { baseApi } from "./baseApi";
import {
  PipSearchRequest,
  FeeScheduleVarianceDetailsResponse,
  FeeScheduleVarianceSummaryResponse,
  PaymentVarianceDetailsResponse,
  PaymentVarianceSummaryResponse,
  DateRangeParams
} from "@/interfaces/api";

export const variancesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    searchFeeScheduleVariance: builder.query<
      FeeScheduleVarianceDetailsResponse,
      PipSearchRequest
    >({
      query: (body) => ({
        url: "financials/fee-schedule-variance/details/search",
        method: "POST",
        body,
      }),
      providesTags: ["Variances"],
    }),
    getFeeScheduleVarianceSummary: builder.query<
      FeeScheduleVarianceSummaryResponse,
      DateRangeParams
    >({
      query: (params) => ({
        url: "financials/fee-schedule-variance/summary",
        params,
      }),
      providesTags: ["Variances"],
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
      providesTags: ["Variances"],
    }),
    getPaymentVarianceSummary: builder.query<
      PaymentVarianceSummaryResponse,
      DateRangeParams
    >({
      query: (params) => ({
        url: "financials/payment-variance/summary",
        params,
      }),
      providesTags: ["Variances"],
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
  }),
});

export const {
  useSearchFeeScheduleVarianceQuery,
  useGetFeeScheduleVarianceSummaryQuery,
  useSearchPaymentVarianceQuery,
  useGetPaymentVarianceSummaryQuery,
  useLazyExportFeeScheduleVarianceQuery,
  useLazyExportPaymentVarianceQuery,
} = variancesApi;
