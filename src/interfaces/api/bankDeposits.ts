import { BankDepositItem } from '../financials';

export interface BankDepositSearchRequest {
    startDate: string;
    endDate: string;
    payerList: string[];
    stateList: string[];
    transactionNo: string;
    transactionsList: string[];
    accountList: string[];
    stateId: number;
    batchOwnerIds: string[];
    icanManageId: number | string;
    pageNumber: number;
    pageSize: number;
    sort: string;
    desc: boolean;
    clientName: string;
    status: string | null;
}

export interface BankDepositExportRequest {
    startDate: string;
    endDate: string;
    icanManageId: number;
    clientName: string;
    hospitalId: number | string;
}

export interface BankDepositResponse {
    data: BankDepositItem[];
}

export interface BankDepositWidgetResponse {
    data: {
        totalRecords: number;
        totalBaiAmount: number;
        reconciledRecords: number;
        reconciledBaiAmount: number;
        nonReconciledRecords: number;
        nonReconciledBaiAmount: number;
        actionRequiredCount: number;
        reconciliationRatePercentage: number;
    };
    message: string | null;
}

export type BankDepositSearchResponse = BankDepositItem[];
