import { baseApi } from "./baseApi";
import {
  TableSearchRequest,
  AllTransactionSearchResponse,
  AllTransactionsFilterResponse,
  RecoupmentSearchResponse,
  RecoupmentFilterResponse,
  OtherAdjustmentSearchResponse,
  DateRangeParams
} from "@/interfaces/api";

export const transactionsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    searchAllTransactions: builder.query<
      AllTransactionSearchResponse,
      TableSearchRequest
    >({
      query: (body) => ({
        url: "financials/all-transactions",
        method: "POST",
        body,
      }),
      providesTags: ["Transactions"],
    }),
    getAllTransactionsFilters: builder.query<AllTransactionsFilterResponse, void>({
      query: () => "/financials/dropdown",
      providesTags: ["Transactions"],
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
      providesTags: ["Transactions"],
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
      providesTags: ["Transactions"],
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
    getRecoupmentFilters: builder.query<RecoupmentFilterResponse, void>({
      query: () => "financials/transactions/recoupments/filters",
      providesTags: ["Transactions"],
    }),
  }),
});

export const {
  useSearchAllTransactionsQuery,
  useGetAllTransactionsFiltersQuery,
  useSearchRecoupmentsQuery,
  useSearchOtherAdjustmentsQuery,
  useLazyExportRecoupmentsQuery,
  useLazyExportOtherAdjustmentsQuery,
  useLazyExportAllTransactionsQuery,
  useGetRecoupmentFiltersQuery
} = transactionsApi;
