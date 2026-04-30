import { screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import TrendsScreen from './TrendsScreen';
import { useTrendsScreen } from './TrendsScreen.hook';
import { renderWithProviders } from '@/test/test-utils';

// Mock the hook
vi.mock('./TrendsScreen.hook', () => ({
    useTrendsScreen: vi.fn(),
}));

// Mock ResizeObserver for Recharts
global.ResizeObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
}));

describe('TrendsScreen', () => {
    const mockUseTrendsScreen = vi.mocked(useTrendsScreen);

    const defaultMockValue = {
        activeSubTab: 0,
        forecastSummary: { data: { totalAmountReconciled: 1000000, totalAmountUnreconciled: 200000, globalReconciliationRate: 83, avgDaysToReconcile: 5 } },
        reconPerformance: { data: [] },
        dashboardData: [],
        execSummary: { data: { totalCollectionsMtd: 500000, reconciliationRate: 85, openSuspense: 50000, avgDaysToReconcile: 4 } },
        paymentMix: { data: { eftCount: 80, otherCount: 20 } },
        adjBreakdown: { data: { contractualCount: 50, patientRespCount: 30, denialCount: 10, otherAdjCount: 10 } },
        payerPerformanceRecords: [],
        totalElementsPayer: 0,
        handleRangeChange: vi.fn(),
        handlePageChange: vi.fn(),
        handleRowsPerPageChange: vi.fn(),
        handleDrillDown: vi.fn(),
        globalFilters: { rangeLabel: '1 month', fromDate: '2023-11-25', toDate: '2023-12-25' },
        isMindpath: false,
        isFetching: false,
    };

    beforeEach(() => {
        mockUseTrendsScreen.mockReturnValue(defaultMockValue);
    });

    it('renders the forecast trends content when activeSubTab is 0', () => {
        renderWithProviders(<TrendsScreen />);
        expect(screen.getByText('Reconciliation Trends & Forecast')).toBeInTheDocument();
        expect(screen.getByText('TOTAL RECONCILED')).toBeInTheDocument();
        expect(screen.getByText('$1,000,000.00')).toBeInTheDocument();
    });

    it('renders the executive summary content when activeSubTab is 1', () => {
        mockUseTrendsScreen.mockReturnValue({
            ...defaultMockValue,
            activeSubTab: 1
        });
        renderWithProviders(<TrendsScreen />);
        expect(screen.getByText('Executive Summary')).toBeInTheDocument();
        expect(screen.getByText('Total Collections')).toBeInTheDocument();
        expect(screen.getByText('$500,000.00')).toBeInTheDocument();
    });

    it('renders the payer performance content when activeSubTab is 2', () => {
        mockUseTrendsScreen.mockReturnValue({
            ...defaultMockValue,
            activeSubTab: 2
        });
        renderWithProviders(<TrendsScreen />);
        expect(screen.getByText('Payer Performance')).toBeInTheDocument();
    });

    it('displays loading state in table when isFetching is true', () => {
        mockUseTrendsScreen.mockReturnValue({
            ...defaultMockValue,
            isFetching: true
        });

        const { container } = renderWithProviders(<TrendsScreen />);
        const skeletons = container.querySelectorAll('.MuiSkeleton-root');
        expect(skeletons.length).toBeGreaterThan(0);
    });

    it('renders the mindpath specific charts when isMindpath is true', () => {
        mockUseTrendsScreen.mockReturnValue({
            ...defaultMockValue,
            isMindpath: true
        });
        renderWithProviders(<TrendsScreen />);
        expect(screen.getByText('Payer Performance')).toBeInTheDocument();
    });
});
