import { baseApi } from './baseApi';
import { RootState } from '../index';
import { RemitDataRecord, CashPostingRecord, BaiDataRecord } from '@/interfaces/financials';
import {
  BankDepositSearchResponse,
  BankDepositSearchRequest,
  BankDepositWidgetResponse,
  BankDepositWidgetParams,
  BankDepositExportRequest,
  MappedHeadersResponse,
  MappedHeadersParams,
  DynamicTabsResponse,
  UserMappedBrandsParams,
  BankDepositHistoryParams,
  BaiTriggerHistoryParams,
} from '@/interfaces/api';

export const reconciliationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    searchBankDepositsBody: builder.query<BankDepositSearchResponse, BankDepositSearchRequest>({
      queryFn: async (body, api, _extraOptions, baseQuery) => {
        const state = api.getState() as RootState;
        const clientIdFromLogin = state.auth?.user?.company;
        const selectedTenantId = state.tenant?.selectedTenantId;
        const isCognitiveClient =
          String(clientIdFromLogin || '').toLowerCase() === 'cognitivehealthit';
        const clientName =
          isCognitiveClient && selectedTenantId
            ? selectedTenantId
            : clientIdFromLogin || body.clientName;

        return await baseQuery({
          url: 'financials/reconciliation/bank-deposits/search',
          method: 'POST',
          body: {
            ...body,
            clientName,
          },
        });
      },
      providesTags: ['Reconciliation'],
    }),
    getBankDepositWidgets: builder.query<BankDepositWidgetResponse, BankDepositWidgetParams>({
      queryFn: async (params, api, _extraOptions, baseQuery) => {
        const state = api.getState() as RootState;
        const clientIdFromLogin = state.auth?.user?.company;
        const selectedTenantId = state.tenant?.selectedTenantId;
        const isCognitiveClient =
          String(clientIdFromLogin || '').toLowerCase() === 'cognitivehealthit';
        const clientName =
          isCognitiveClient && selectedTenantId
            ? selectedTenantId
            : clientIdFromLogin || params.clientName;

        return await baseQuery({
          url: 'financials/reconciliation/bank-deposits/widgets-data',
          method: 'GET',
          params: {
            ...params,
            clientName,
          },
        });
      },
      providesTags: ['Reconciliation'],
    }),
    exportBankDeposits: builder.query<Blob, BankDepositExportRequest>({
      queryFn: async (body, api, _extraOptions, baseQuery) => {
        const state = api.getState() as RootState;
        const clientIdFromLogin = state.auth?.user?.company;
        const selectedTenantId = state.tenant?.selectedTenantId;
        const isCognitiveClient =
          String(clientIdFromLogin || '').toLowerCase() === 'cognitivehealthit';
        const clientName =
          isCognitiveClient && selectedTenantId
            ? selectedTenantId
            : clientIdFromLogin || body.clientName;

        return await baseQuery({
          url: `financials/reconciliation/bank-deposits/export`,
          method: 'POST',
          body: {
            ...body,
            clientName,
          },
          responseHandler: (response) => response.blob(),
        });
      },
    }),
    getMappedHeadersData: builder.query<MappedHeadersResponse, MappedHeadersParams>({
      query: (params) => ({
        url: 'financials/reconciliation/get-mapped-headers-data',
        params,
        method: 'POST',
      }),
      providesTags: ['Reconciliation'],
    }),
    getUserMappedBrands: builder.query<DynamicTabsResponse, UserMappedBrandsParams>({
      query: (params) => ({
        url: 'financials/reconciliation/get-user-mapped-brands',
        params,
        method: 'POST',
      }),
      providesTags: ['Reconciliation'],
    }),
    getBankDepositHistory: builder.query<
      { data: { remittanceAdvice: RemitDataRecord[]; postingApplication: CashPostingRecord[] } },
      BankDepositHistoryParams
    >({
      query: (params) => ({
        url: 'financials/reconciliation/bank-deposits/history',
        params,
        method: 'POST',
      }),
      providesTags: ['Reconciliation'],
    }),
    getBaiTriggerHistory: builder.query<
      {
        data: {
          baiDataRecords: BaiDataRecord[];
          remitDataRecords: RemitDataRecord[];
          cashPostingRecords: CashPostingRecord[];
        };
      },
      BaiTriggerHistoryParams
    >({
      query: (params) => ({
        url: 'financials/reconciliation/bai-trigger/history',
        params,
        method: 'POST',
      }),
      providesTags: ['Reconciliation'],
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
