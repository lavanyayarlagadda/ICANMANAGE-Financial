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
        payerNames: string[];
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
     statusIds: string | number | null;
    // categoryIds: string | number | null;
    // transactionTypeIds: string | number | null;
    // payerIds: string | number | null;
    transactionNo: string;
    // status?:string;
    category?:string;
    type?:string;
      payer?:string;

}

export interface AssociatedEraFile {
    transactionNo: string;
    npi: string;
    remitDate: string;
    amount: number;
}

export interface PlbDetailRecord {
    id: string;
    date: string;
    transactionNo: string;
    type: string;
    state: string;
    payor: string;
    npi: string;
    identifier: string;
    amount: number;
    suspenseBalance: number;
    status: string;
    associatedEraFiles: AssociatedEraFile[];
}

export interface PlbDetailsSearchRequest {
    fromDate: string;
    toDate: string;
    payers: string[];
    ptanNumbers: string[];
    transactionNumber: string;
    brands: string[];
    status: string;
    icanManageId: number;
    offset: number;
    limit: number;
    sortColumn: string;
    sortDir: 'ASC' | 'DESC';
}

export interface RawPlbDetailRecord {
    brand: string | null;
    brandId: string | null;
    chequeStatus: string | null;
    children?: {
        NPI: string;
        chkDate: string;
        chkTrnNo: string;
        parentRow: boolean;
        paymentType: string;
        plbAmount: number;
        plbId: number;
        plbIdentifier: string;
    }[];
    chkAmt: number;
    chkDate: string;
    chkTrnNo: string;
    claimRefNo: string | null;
    createdOn: string;
    npi: string;
    payerId: number | null;
    payerName: string;
    paymentType: string;
    plbAmount: number;
    plbDate: string | null;
    plbId: number;
    plbIdentifier: string;
    postedOn: string | null;
    postingStatus: string | null;
    ptanNo: string;
    reason: string | null;
    totalAdjustment: number;
    totalCount: number;
    totalPayment: number | null;
}

export interface PlbDetailsSearchResponse {
    data: RawPlbDetailRecord[];
    message?: string | null;
}

