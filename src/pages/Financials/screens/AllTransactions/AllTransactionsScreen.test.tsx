import { screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import AllTransactionsScreen from './AllTransactionsScreen';
import { useAllTransactionsScreen } from './AllTransactionsScreen.hook';
import { renderWithProviders } from '@/test/test-utils';

// Mock the hook
vi.mock('./AllTransactionsScreen.hook', () => ({
    useAllTransactionsScreen: vi.fn(),
}));

describe('AllTransactionsScreen', () => {
    const mockUseAllTransactionsScreen = vi.mocked(useAllTransactionsScreen);

    const defaultMockValue = {
        filteredTransactions: [],
        totalElements: 0,
        queryParams: { page: 0, size: 25, sortField: 'effectiveDate', sortOrder: 'desc' as const, fromDate: '2023-11-25', toDate: '2023-12-25' },
        searchTerm: '',
        setSearchTerm: vi.fn(),
        onSearch: vi.fn(),
        globalFilters: { rangeLabel: '1 month', fromDate: '2023-11-25', toDate: '2023-12-25' },
        drillDownParams: { page: 0, size: 25, sortField: 'paymentDate', sortOrder: 'desc' as const },
        handleDrillDown: vi.fn(),
        handleEdit: vi.fn(),
        handleDelete: vi.fn(),
        handleRangeChange: vi.fn(),
        handleFilterChange: vi.fn(),
        handleSortChange: vi.fn(),
        onPageChange: vi.fn(),
        onRowsPerPageChange: vi.fn(),
        onDrillDownParamsChange: vi.fn(),
        statusOptions: [],
        statusOptionsLoading: false,
        statusOptionsError: false,
        payerOptions: [],
        filterOptionsLoading: false,
        filterOptionsError: false,
        transactionTypeOptions: [],
        categoryOptions: [],
        isError: false,
        isFetching: false,
        dispatch: vi.fn()
    };

    beforeEach(() => {
        mockUseAllTransactionsScreen.mockReturnValue(defaultMockValue);
    });

    it('renders the search field and search button', () => {
        renderWithProviders(<AllTransactionsScreen />);
        expect(screen.getByPlaceholderText('Search by Transaction #')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Search/i })).toBeInTheDocument();
    });

    it('displays loading state in table when isFetching is true', () => {
        mockUseAllTransactionsScreen.mockReturnValue({
            ...defaultMockValue,
            isFetching: true
        });

        const { container } = renderWithProviders(<AllTransactionsScreen />);
        const skeletons = container.querySelectorAll('.MuiSkeleton-root');
        expect(skeletons.length).toBeGreaterThan(0);
    });

    it('renders table headers correctly', () => {
        renderWithProviders(<AllTransactionsScreen />);
        expect(screen.getByText('EFFECTIVE DATE')).toBeInTheDocument();
        expect(screen.getByText('TRANSACTION NUMBER')).toBeInTheDocument();
        expect(screen.getByText('CATEGORY')).toBeInTheDocument();
        expect(screen.getByText('AMOUNT')).toBeInTheDocument();
        expect(screen.getByText('STATUS')).toBeInTheDocument();
    });
});
