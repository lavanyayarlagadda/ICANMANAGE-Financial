import { screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import VarianceScreen from './VarianceScreen';
import { useVarianceScreen } from './VarianceScreen.hook';
import { renderWithProviders } from '@/test/test-utils';

// Mock the hook
vi.mock('./VarianceScreen.hook', () => ({
    useVarianceScreen: vi.fn(),
}));

describe('VarianceScreen', () => {
    const mockUseVarianceScreen = vi.mocked(useVarianceScreen);

    const defaultMockValue = {
        activeSubTab: 0,
        actionTriggers: { export: 0, print: 0, reload: 0 },
        queryParams: { page: 0, size: 25, sortField: 'paymentDate', sortOrder: 'desc' as const, fromDate: '2023-11-25', toDate: '2023-12-25' },
        globalFilters: { rangeLabel: '1 month', fromDate: '2023-11-25', toDate: '2023-12-25' },
        drillDownParams: { page: 0, size: 25, sortField: 'paymentDate', sortOrder: 'desc' as const },
        feeData: { data: { content: [], totalElements: 0, totalPages: 0, size: 25, number: 0 } },
        feeSummaryData: { data: { totalExpected: 1000, totalActualAllowed: 800, totalLeakage: 200 } },
        paymentData: { data: { content: [], totalElements: 0, totalPages: 0, size: 25, number: 0 } },
        paymentSummaryData: { data: { totalExpected: 2000, totalActualAllowed: 1500, totalLeakage: 500, totalActualPaid: 1500 } },
        totalElementsFee: 0,
        totalElementsPayment: 0,
        handleDrillDown: vi.fn(),
        handleRangeChange: vi.fn(),
        handleSortChange: vi.fn(),
        handlePageChange: vi.fn(),
        handleRowsPerPageChange: vi.fn(),
        onDrillDownParamsChange: vi.fn(),
        refetchFee: vi.fn(),
        refetchPayment: vi.fn(),
        searchTerm: '',
        setSearchTerm: vi.fn(),
        onSearch: vi.fn(),
        handleFilterChange: vi.fn(),
        payerOptions: [],
        payerOptionsLoading: false,
        payerOptionsError: false,
        isFetching: false,
        dispatch: vi.fn()
    };

    beforeEach(() => {
        mockUseVarianceScreen.mockReturnValue(defaultMockValue);
    });

    it('renders the screen header and summary cards', () => {
        renderWithProviders(<VarianceScreen />);
        expect(screen.getByText('Fee Variance')).toBeInTheDocument();
        expect(screen.getByText('$1,000.00')).toBeInTheDocument(); // totalExpected
    });

    it('displays loading state in table when isFetching is true', () => {
        mockUseVarianceScreen.mockReturnValue({
            ...defaultMockValue,
            isFetching: true
        });

        const { container } = renderWithProviders(<VarianceScreen />);
        const skeletons = container.querySelectorAll('.MuiSkeleton-root');
        expect(skeletons.length).toBeGreaterThan(0);
    });

    it('renders table headers correctly', () => {
        renderWithProviders(<VarianceScreen />);
        expect(screen.getByText('TRANSACTION NUMBER')).toBeInTheDocument();
        expect(screen.getByText('PATIENT NAME')).toBeInTheDocument();
        expect(screen.getByText('EXPECTED ALLOWED')).toBeInTheDocument();
        expect(screen.getByText('VARIANCE')).toBeInTheDocument();
    });
});
