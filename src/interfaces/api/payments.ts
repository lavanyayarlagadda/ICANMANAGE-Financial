import { TableQueryParams } from './common';
import { PaymentTransaction } from '../financials';

export interface PaymentSearchRequest {
    page: number;
    size: number;
    sort: string;
    desc: boolean;
    status: string | null;
    payer?: string | null;
    fromDate: string;
    toDate: string;
    transactionNo?: string | null;
    icanManageId?: string | number;
}

export interface PaymentSearchResponse {
    data: {
        content: PaymentTransaction[];
        totalElements: number;
        totalPages: number;
        size: number;
        number: number;
    }
}

export interface PaymentQueryParams extends TableQueryParams {
    status: string | null;
}

export interface PaymentPostingStatus {
    postingStatusMasterId: number;
    postingStatus: string;
}

export interface PaymentStatusResponse {
    data: PaymentPostingStatus[];
    message: string | null;
}
