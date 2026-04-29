export interface ForecastSummaryResponse {
    data: {
        totalAmountReconciled: number;
        totalAmountUnreconciled: number;
        globalReconciliationRate: number;
        avgDaysToReconcile: number;
    };
    message: string | null;
}

export interface ReconciliationPerformanceResponse {
    data: {
        month: string;
        actualReconciledAmount: string | null;
        forecastAmount: string | null;
    }[];
    message: string | null;
}

export interface ForecastDashboardResponse {
    data: {
        team: string;
        reconciledCheckCountPct: string;
        unreconciledCheckCountPct: string;
        checkCountPctByTeam: string;
        reconciledCheckCount: string;
        unreconciledCheckCount: string;
        reconciledAmountPct: string;
        unreconciledAmountPct: string;
        amountPctByTeam: string;
        totalAmountPosted: string;
        totalAmountNotPosted: string;
        avgDaysToReconcile: string | null;
    }[];
    message: string | null;
}

export interface ExecutiveSummaryResponse {
    data: {
        totalCollectionsMtd: number;
        collectionsSubtext: string;
        reconciliationRate: number;
        reconSubtext: string;
        openSuspense: number;
        suspenseSubtext: string;
        avgDaysToReconcile: number;
        avgDaysSubtext: string;
    };
    message: string | null;
}

export interface PaymentMixResponse {
    data: {
        eftCount: number;
        otherCount: number;
    };
    message: string | null;
}

export interface AdjustmentBreakdownResponse {
    data: {
        denialCount: number;
        patientRespCount: number;
        contractualCount: number;
        otherAdjCount: number;
    };
    message: string | null;
}
