import { baseApi } from "./baseApi";
import {
  TableSearchRequest,
  CollectionAccount,
  ForwardBalanceNoticeSearchResponse,
  ForwardBalanceSummaryResponse,
  ForwardBalanceDetailsResponse,
  SuspenseAccountSearchResponse,
  DateRangeParams
} from "@/interfaces/api";

export const otherApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
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
      transformResponse: (response: { data: SuspenseAccountSearchResponse }) => response.data,
      providesTags: ["Financials"],
    }),
    exportForwardBalanceNotices: builder.query<
      Blob,
      DateRangeParams & { format: "pdf" | "xlsx" }
    >({
      query: (params) => ({
        url: `financials/export/forward-balances`,
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
    getForwardBalanceDetails: builder.query<ForwardBalanceDetailsResponse, string>({
      query: (noticeId) => `/financials/statements/forward-balances/${noticeId}/details`,
      providesTags: ["Financials"],
    }),
    getForwardBalanceSummary: builder.query<ForwardBalanceSummaryResponse, DateRangeParams>({
      query: (params) => ({
        url: "/financials/forward-balances/summary",
        params,
      }),
      providesTags: ["Financials"],
    }),
  }),
});

export const {
  useSearchCollectionsQuery,
  useSearchForwardBalanceNoticesQuery,
  useSearchSuspenseAccountsQuery,
  useLazyExportForwardBalanceNoticesQuery,
  useLazyExportSuspenseAccountsQuery,
  useLazyExportCollectionsQuery,
  useGetForwardBalanceDetailsQuery,
  useLazyGetForwardBalanceDetailsQuery,
  useGetForwardBalanceSummaryQuery,
} = otherApi;
