import { baseApi } from "./baseApi";
import {
  RemitDataRecord,
  CashPostingRecord,
  BaiDataRecord,
} from "@/interfaces/financials";
import {
  BankDepositSearchResponse,
  BankDepositSearchRequest,
  BankDepositWidgetResponse,
  BankDepositExportRequest,
  MappedHeadersResponse,
  DynamicTabsResponse
} from "@/interfaces/api";

export const reconciliationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    searchBankDepositsBody: builder.query<
      BankDepositSearchResponse,
      BankDepositSearchRequest
    >({
      query: (body) => ({
        url: "financials/reconciliation/bank-deposits/search",
        method: "POST",
        body,
      }),
      providesTags: ["Reconciliation"],
    }),
    getBankDepositWidgets: builder.query<
      BankDepositWidgetResponse,
      { startDate: string; endDate: string; icanManageId: string | number }
    >({
      query: (params) => ({
        url: "financials/reconciliation/bank-deposits/widgets-data",
        params,
        method: 'POST'
      }),
      providesTags: ["Reconciliation"],
    }),
    exportBankDeposits: builder.query<
      Blob,
      BankDepositExportRequest
    >({
      query: (body) => ({
        url: `financials/reconciliation/bank-deposits/export`,
        method: 'POST',
        body,
        responseHandler: (response) => response.blob(),
      }),
    }),
    getMappedHeadersData: builder.query<
      MappedHeadersResponse,
      { hospitalId: number; pageName: string }
    >({
      query: (params) => ({
        url: "financials/reconciliation/get-mapped-headers-data",
        params,
        method: 'POST'
      }),
      providesTags: ["Reconciliation"],
    }),
    getUserMappedBrands: builder.query<
      DynamicTabsResponse,
      { icanManageId: string | number; facilityMasterId: number }
    >({
      query: (params) => ({
        url: "financials/reconciliation/get-user-mapped-brands",
        params,
        method: 'POST'
      }),
      providesTags: ["Reconciliation"],
    }),
    getBankDepositHistory: builder.query<
      { data: { remittanceAdvice: RemitDataRecord[]; postingApplication: CashPostingRecord[] } },
      { transactionNo: string }
    >({
      query: (params) => ({
        url: "financials/reconciliation/bank-deposits/history",
        params,
        method: 'POST'
      }),
      providesTags: ["Reconciliation"],
    }),
    getBaiTriggerHistory: builder.query<
      { data: { baiDataRecords: BaiDataRecord[]; remitDataRecords: RemitDataRecord[]; cashPostingRecords: CashPostingRecord[] } },
      { eftNo: string; pageFlag: string; clientName: string }
    >({
      query: (params) => ({
        url: "financials/reconciliation/bai-trigger/history",
        params,
        method: 'POST'
      }),
      providesTags: ["Reconciliation"],
    }),
  }),
});

export const {
  useSearchBankDepositsBodyQuery,
  useGetBankDepositWidgetsQuery,
  useLazyExportBankDepositsQuery,
  useGetMappedHeadersDataQuery,
  useGetUserMappedBrandsQuery,
  useLazyGetBankDepositHistoryQuery,
  useGetBankDepositHistoryQuery,
  useLazyGetBaiTriggerHistoryQuery,
  useGetBaiTriggerHistoryQuery,
} = reconciliationApi;
