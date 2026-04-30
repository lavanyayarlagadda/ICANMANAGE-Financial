import { screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import OtherAdjustmentsScreen from './OtherAdjustmentsScreen';
import { useOtherAdjustmentsScreen } from './OtherAdjustmentsScreen.hook';
import { renderWithProviders } from '@/test/test-utils';

// Mock the hook
vi.mock('./OtherAdjustmentsScreen.hook', () => ({
    useOtherAdjustmentsScreen: vi.fn(),
}));

describe('OtherAdjustmentsScreen', () => {
    const mockUseOtherAdjustmentsScreen = vi.mocked(useOtherAdjustmentsScreen);

    const defaultMockValue = {
        adjustments: [],
        totalElements: 0,
        queryParams: { page: 0, size: 25, sortField: 'date', sortOrder: 'desc' as const, fromDate: '2023-11-25', toDate: '2023-12-25' },
        summaryData: { totalAdjustments: 50, totalAmount: 25000, activeAdjustments: 10 },
        handleDrillDown: vi.fn(),
        handleRangeChange: vi.fn(),
        handleFilterChange: vi.fn(),
        handleSortChange: vi.fn(),
        onPageChange: vi.fn(),
        onRowsPerPageChange: vi.fn(),
        searchTerm: '',
        setSearchTerm: vi.fn(),
        onSearch: vi.fn(),
        statusOptions: [],
        payerOptions: [],
        isError: false,
        isFetching: false,
        dispatch: vi.fn(),
        globalFilters: { rangeLabel: '1 month', fromDate: '2023-11-25', toDate: '2023-12-25' },
    };

    beforeEach(() => {
        mockUseOtherAdjustmentsScreen.mockReturnValue(defaultMockValue);
    });

    it('renders the screen header and summary cards', () => {
        renderWithProviders(<OtherAdjustmentsScreen />);
        expect(screen.getByText('Other Adjustments')).toBeInTheDocument();
        expect(screen.getByText('50')).toBeInTheDocument(); // totalAdjustments
        expect(screen.getByText('$25,000.00')).toBeInTheDocument(); // totalAmount
    });

    it('displays loading state in table when isFetching is true', () => {
        mockUseOtherAdjustmentsScreen.mockReturnValue({
            ...defaultMockValue,
            isFetching: true
        });

        const { container } = renderWithProviders(<OtherAdjustmentsScreen />);
        const skeletons = container.querySelectorAll('.MuiSkeleton-root');
        expect(skeletons.length).toBeGreaterThan(0);
    });

    it('renders table headers correctly', () => {
        renderWithProviders(<OtherAdjustmentsScreen />);
        expect(screen.getByText('Adjustment ID')).toBeInTheDocument();
        expect(screen.getByText('EFFECTIVE DATE')).toBeInTheDocument();
        expect(screen.getByText('PAYER')).toBeInTheDocument();
        expect(screen.getByText('AMOUNT')).toBeInTheDocument();
    });
});
