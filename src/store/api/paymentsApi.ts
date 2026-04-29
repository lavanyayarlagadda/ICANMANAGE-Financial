import { baseApi } from "./baseApi";
import {
  PaymentSearchRequest,
  PaymentSearchResponse,
  PaymentStatusResponse,
  RawRemittanceClaimsResponse,
  RemittanceClaimsResponse,
  ServiceLineSearchRequest,
  ServiceLineSearchResponse,
  DateRangeParams
} from "@/interfaces/api";
import { RemittanceDetail } from "@/interfaces/financials";
import { normalizeRemittanceClaims } from "@/utils/normalizeRemittanceClaims";

export const paymentsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    searchPayments: builder.query<PaymentSearchResponse, PaymentSearchRequest>({
      query: (body) => ({
        url: "financials/payments/search",
        method: "POST",
        body,
      }),
      providesTags: ["Payments"],
    }),
    getPaymentStatus: builder.query<PaymentStatusResponse, void>({
      query: () => '/financials/posting-status/list',
      providesTags: ["Payments"],
    }),
    getRemittanceClaims: builder.query<RemittanceDetail[], { claimId: string; } & Partial<PaymentSearchRequest>>({
      query: ({ claimId, ...params }) => ({
        url: `financials/payments/remittance-claims/${claimId}`,
        params
      }),
      transformResponse: (
        response: RawRemittanceClaimsResponse,
      ): RemittanceClaimsResponse => normalizeRemittanceClaims(response),
      providesTags: ["Payments"],
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
      providesTags: ["Payments"],
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
  }),
});

export const {
  useSearchPaymentsQuery,
  useGetPaymentStatusQuery,
  useGetRemittanceClaimsQuery,
  useLazyGetRemittanceClaimsQuery,
  useSearchServiceLinesQuery,
  useLazySearchServiceLinesQuery,
  useLazyExportPaymentsQuery,
} = paymentsApi;
