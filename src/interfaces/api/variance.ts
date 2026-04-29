import { FeeScheduleVariance, PaymentVariance, FeeScheduleVarianceSummary, PaymentVarianceSummary } from '../financials';

export interface FeeScheduleVarianceDetailsResponse {
    data: {
        content: FeeScheduleVariance[];
        totalElements: number;
        totalPages: number;
        size: number;
        number: number;
    }
}

export interface PaymentVarianceDetailsResponse {
    data: {
        content: PaymentVariance[];
        totalElements: number;
        totalPages: number;
        size: number;
        number: number;
    }
}

export interface FeeScheduleVarianceSummaryResponse {
    data: FeeScheduleVarianceSummary;
}

export interface PaymentVarianceSummaryResponse {
    data: PaymentVarianceSummary;
}
