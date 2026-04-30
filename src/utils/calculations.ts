import { BankDepositItem } from '@/interfaces/financials';
import { ReconStatus } from '@/constants/statuses';

export interface BankDepositSummary {
    totalBankAmt: number;
    reconRate: string;
    exceptions: number;
}

export const calculateBankDepositSummary = (
    entities: { items: BankDepositItem[] }[],
    widgetData?: {
        totalBaiAmount: number;
        actionRequiredCount: number;
        reconciliationRatePercentage: number;
    } | null
): BankDepositSummary => {
    // Priority 1: Use aggregate data from widgets if available
    if (widgetData) {
        return {
            totalBankAmt: widgetData.totalBaiAmount,
            reconRate: (widgetData.reconciliationRatePercentage || 0).toFixed(2),
            exceptions: widgetData.actionRequiredCount
        };
    }

    // Priority 2: Calculate manually from the current entity/item list
    let totalItems = 0;
    let exceptions = 0;
    let totalBankAmt = 0;

    entities.forEach(entity => {
        totalItems += entity.items.length;
        entity.items.forEach((item: BankDepositItem) => {
            totalBankAmt += item.baiAmount;
            // Exception logic: explicit status OR non-zero variance
            if (item.reconciliationStatus === ReconStatus.EXCEPTION || item.varianceAmount !== 0) {
                exceptions++;
            }
        });
    });

    const reconRate = totalItems > 0 
        ? (((totalItems - exceptions) / totalItems) * 100).toFixed(2) 
        : '100.00';

    return { totalBankAmt, reconRate, exceptions };
};
