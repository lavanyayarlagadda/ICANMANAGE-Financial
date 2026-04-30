import { AllTransaction, RecoupmentRecord, OtherAdjustmentRecord, PayerPerformanceRecord } from '../financials';

export interface PayerPerformanceResponse {
    data: {
        content: PayerPerformanceRecord[];
        page: number;
        size: number;
        totalElements: number;
    };
    message: string | null;
}

export interface AllTransactionSearchResponse {
    data: {
        content: AllTransaction[];
        totalElements: number;
        totalPages: number;
        size: number;
        number: number;
    }
}

export interface RecoupmentSearchResponse {
    data: {
        content: RecoupmentRecord[];
        totalElements: number;
        totalPages: number;
        size: number;
        number: number;
    }
}

export interface OtherAdjustmentSearchResponse {
    data: {
        content: OtherAdjustmentRecord[];
        totalElements: number;
        totalPages: number;
        size: number;
        number: number;
    }
}

export interface PayerFilter {
    payerId: number;
    payerName: string;
}

export interface TransactionTypeFilter {
    transactionTypeId: number;
    transactionType: string;
}

export interface CategoryFilter {
    id: number;
    name: string;
}

export interface AllTransactionsFilterResponse {
    data: {
        payers: PayerFilter[];
        transactionTypes: TransactionTypeFilter[];
        categories: CategoryFilter[];
        transactionStatusTypes: string[];
    };
    message: string | null;
}

export type AllTransactionsDropdownResponse = AllTransactionsFilterResponse;

export interface RecoupmentFilterResponse {
    data: {
        payer: string;
    }[];
    message: string | null;
}

export interface AllTransactionsSearchRequest {
    page: number;
    size: number;
    sort: string;
    desc: boolean;
    fromDate: string;
    toDate: string;
    statusId: string | number | null;
    categoryIds: string | number | null;
    transactionTypeIds: string | number | null;
    payerIds: string | number | null;
    transactionNo: string;
}
