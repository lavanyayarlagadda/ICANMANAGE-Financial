import { screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import PipScreen from './PipScreen';
import { usePipScreen } from './PipScreen.hook';
import { renderWithProviders } from '@/test/test-utils';

// Mock the hook
vi.mock('./PipScreen.hook', () => ({
    usePipScreen: vi.fn(),
}));

describe('PipScreen', () => {
    const mockUsePipScreen = vi.mocked(usePipScreen);

    const defaultMockValue = {
        pipRecords: [],
        totalElements: 0,
        pipSummary: { totalPaidAmount: 25000, totalSuspenseBalance: 15000, actionRequired: 10 },
        queryParams: { page: 0, size: 25, sortField: 'date', sortOrder: 'desc' as const, fromDate: '2023-11-25', toDate: '2023-12-25', transactionNo: '' },
        expandedRows: new Set<string>(),
        toggleRow: vi.fn(),
        handleRangeChange: vi.fn(),
        handleFilterChange: vi.fn(),
        handleSortChange: vi.fn(),
        handlePageChange: vi.fn(),
        handleRowsPerPageChange: vi.fn(),
        searchTerm: '',
        setSearchTerm: vi.fn(),
        onSearch: vi.fn(),
        handleExport: vi.fn(),
        statusOptions: [],
        isError: false,
        isFetching: false,
        globalFilters: { rangeLabel: '1 month', fromDate: '2023-11-25', toDate: '2023-12-25' },
    };

    beforeEach(() => {
        mockUsePipScreen.mockReturnValue(defaultMockValue);
    });

    it('renders the screen header and summary cards', () => {
        renderWithProviders(<PipScreen />);
        expect(screen.getByPlaceholderText('Search by Transaction #')).toBeInTheDocument();
        expect(screen.getByText('$25,000.00')).toBeInTheDocument(); // totalPaidAmount
        expect(screen.getByText('$15,000.00')).toBeInTheDocument(); // totalSuspenseBalance
        expect(screen.getByText('10')).toBeInTheDocument(); // actionRequired
    });

    it('displays loading state in table when isFetching is true', () => {
        mockUsePipScreen.mockReturnValue({
            ...defaultMockValue,
            isFetching: true
        });

        const { container } = renderWithProviders(<PipScreen />);
        const skeletons = container.querySelectorAll('.MuiSkeleton-root');
        expect(skeletons.length).toBeGreaterThan(0);
    });

    it('renders table headers correctly', () => {
        renderWithProviders(<PipScreen />);
        expect(screen.getByText('PTAN')).toBeInTheDocument();
        expect(screen.getByText('CHECK/EFT NUMBER')).toBeInTheDocument();
        expect(screen.getByText('SUSPENSE BALANCE')).toBeInTheDocument();
        expect(screen.getByText('STATUS')).toBeInTheDocument();
    });
});
