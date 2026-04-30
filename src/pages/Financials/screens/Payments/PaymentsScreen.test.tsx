import { screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import PaymentsScreen from './PaymentsScreen';
import { usePaymentsScreen } from './PaymentsScreen.hook';
import { renderWithProviders } from '@/test/test-utils';

// Mock the hook
vi.mock('./PaymentsScreen.hook', () => ({
    usePaymentsScreen: vi.fn(),
}));

describe('PaymentsScreen', () => {
    const mockUsePaymentsScreen = vi.mocked(usePaymentsScreen);

    const defaultMockValue = {
        payments: [],
        totalElements: 0,
        queryParams: { page: 0, size: 25, sortField: 'effectiveDate', sortOrder: 'desc' as const, fromDate: '2023-11-25', toDate: '2023-12-25', transactionNo: '' },
        globalFilters: { rangeLabel: '1 month', fromDate: '2023-11-25', toDate: '2023-12-25' },
        handleDrillDown: vi.fn(),
        handleRangeChange: vi.fn(),
        handleFilterChange: vi.fn(),
        handleSortChange: vi.fn(),
        onPageChange: vi.fn(),
        onRowsPerPageChange: vi.fn(),
        onDrillDownParamsChange: vi.fn(),
        statusOptions: [],
        payerOptions: [],
        searchTerm: '',
        setSearchTerm: vi.fn(),
        onSearch: vi.fn(),
        isError: false,
        isFetching: false,
        dispatch: vi.fn(),
    };

    beforeEach(() => {
        mockUsePaymentsScreen.mockReturnValue(defaultMockValue);
    });

    it('renders the search field and search button', () => {
        renderWithProviders(<PaymentsScreen />);
        expect(screen.getByPlaceholderText('Search by Transaction #')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Search/i })).toBeInTheDocument();
    });

    it('displays loading state in table when isFetching is true', () => {
        mockUsePaymentsScreen.mockReturnValue({
            ...defaultMockValue,
            isFetching: true
        });

        const { container } = renderWithProviders(<PaymentsScreen />);
        const skeletons = container.querySelectorAll('.MuiSkeleton-root');
        expect(skeletons.length).toBeGreaterThan(0);
    });

    it('renders table headers correctly', () => {
        renderWithProviders(<PaymentsScreen />);
        expect(screen.getByText('EFFECTIVE DATE')).toBeInTheDocument();
        expect(screen.getByText('TRANSACTION NUMBER')).toBeInTheDocument();
        expect(screen.getByText('PAYER')).toBeInTheDocument();
        expect(screen.getByText('AMOUNT')).toBeInTheDocument();
    });
});
