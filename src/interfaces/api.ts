export * from './api/common';
export * from './api/payments';
export * from './api/variance';
export * from './api/bankDeposits';
export * from './api/statements';
export * from './api/forecast';
export * from './api/transactions';

import {
  PaymentTransaction,
  CollectionAccount,
  BankDepositEntity,
  PipRecord,
  RemittanceDetail,
  ServiceLine,
  FeeScheduleVariance,
  PaymentVariance,
  FeeScheduleVarianceSummary,
  PaymentVarianceSummary,
  PayerPerformanceRecord,
  RecoupmentRecord,
  OtherAdjustmentRecord,
  AllTransaction,
  ForwardBalanceNotice,
  BankDepositItem,
  OffsetEvent
} from './financials';

export type {
  PaymentTransaction,
  CollectionAccount,
  BankDepositEntity,
  PipRecord,
  RemittanceDetail,
  ServiceLine,
  FeeScheduleVariance,
  PaymentVariance,
  FeeScheduleVarianceSummary,
  PaymentVarianceSummary,
  PayerPerformanceRecord,
  RecoupmentRecord,
  OtherAdjustmentRecord,
  AllTransaction,
  ForwardBalanceNotice,
  BankDepositItem,
  OffsetEvent
};

export type RawRemittanceClaimsResponse =
  | RemittanceDetail
  | { data: RemittanceDetail[] }
  | RemittanceDetail[];

export type RemittanceClaimsResponse = RemittanceDetail[];

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

// Reusing PipSearchRequest for simple table searches (imported from statements)
import { PipSearchRequest } from './api/statements';
export type TableSearchRequest = PipSearchRequest;
