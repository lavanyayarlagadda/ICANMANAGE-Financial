import { PipRecord, ForwardBalanceNotice, OffsetEvent } from '../financials';

export interface PipSearchRequest {
    page: number;
    size: number;
    sort: string;
    desc: boolean;
    fromDate: string;
    toDate: string;
    status?: string | null;
    category?: string | null;
    type?: string | null;
    payer?: string | null;
    payerName?: string | null;
    transactionNo?: string | null;
    icanManageId?: string | number;
    payerIds?: (string | number) | null;
}

export interface PipSearchResponse {
    data: {
        content: PipRecord[];
        totalElements: number;
        totalPages: number;
        size: number;
        number: number;
    }
}

export interface PipSummaryResponse {
    data: {
        totalPaidAmount: number;
        totalSuspenseBalance: number;
        actionRequired: number;
    };
    message: string | null;
}

export interface ForwardBalanceNoticeSearchResponse {
    data: {
        content: ForwardBalanceNotice[];
        totalElements: number;
        totalPages: number;
        size: number;
        number: number;
    }
}

export interface ForwardBalanceSummaryResponse {
    data?: {
        totalOriginalAmount: number | null;
        totalRemainingBalance: number | null;
        actionRequired: number | null;
    };
    totalOriginalAmount?: number | null;
    totalRemainingBalance?: number | null;
    actionRequired?: number | null;
}

export interface ForwardBalanceDetailsResponse {
    data: {
        noticeId: string;
        offsets: OffsetEvent[];
    };
    message: string | null;
}

export interface SuspenseAccountSearchResponse {
    data: {
        summary: {
            totalOpenSuspense: number;
            openItems: number;
            oldestItemAgeDays: number;
            oldestItemNote: string;
            avgDaysInSuspense: number;
            avgDaysLabel: string;
            atRiskCount: number;
            atRiskLabel: string;
        };
        periods: string[];
        rows: {
            id: string;
            accountType: string;
            items: number;
            balances: Record<string, number | null>;
            totalBalance: number;
        }[];
        page: number;
        size: number;
        totalElements: number;
    }
}
