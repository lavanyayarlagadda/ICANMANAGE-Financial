import { describe, it, expect } from 'vitest';
import { calculateBankDepositSummary } from './calculations';
import { ReconStatus } from '@/constants/statuses';

describe('calculateBankDepositSummary', () => {
    
    it('should use widget data if provided', () => {
        const widgetData = {
            totalBaiAmount: 5000,
            actionRequiredCount: 2,
            reconciliationRatePercentage: 95.5
        };
        const result = calculateBankDepositSummary([], widgetData);
        
        expect(result.totalBankAmt).toBe(5000);
        expect(result.exceptions).toBe(2);
        expect(result.reconRate).toBe('95.50');
    });

    it('should calculate manually if widget data is missing', () => {
        const entities = [
            {
                items: [
                    { baiAmount: 1000, varianceAmount: 0, reconciliationStatus: ReconStatus.RECONCILED },
                    { baiAmount: 2000, varianceAmount: 50, reconciliationStatus: ReconStatus.NOT_MATCHED }, // Exception due to variance
                ]
            }
        ];
        
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const result = calculateBankDepositSummary(entities as any);
        
        expect(result.totalBankAmt).toBe(3000);
        expect(result.exceptions).toBe(1);
        expect(result.reconRate).toBe('50.00'); // (2 total - 1 exception) / 2 * 100
    });

    it('should return 100% recon rate for empty lists', () => {
        const result = calculateBankDepositSummary([]);
        expect(result.reconRate).toBe('100.00');
        expect(result.totalBankAmt).toBe(0);
    });

    it('should count ReconStatus.EXCEPTION as an exception', () => {
        const entities = [
            {
                items: [
                    { baiAmount: 100, varianceAmount: 0, reconciliationStatus: ReconStatus.EXCEPTION }
                ]
            }
        ];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const result = calculateBankDepositSummary(entities as any);
        expect(result.exceptions).toBe(1);
        expect(result.reconRate).toBe('0.00');
    });
});
