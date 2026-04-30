import { screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import StatementsScreen from './StatementsScreen';
import { useStatementsScreen } from './StatementsScreen.hook';
import { renderWithProviders } from '@/test/test-utils';

// Mock the hook
vi.mock('./StatementsScreen.hook', () => ({
    useStatementsScreen: vi.fn(),
    useForwardBalanceNoticesTable: vi.fn(() => ({
        expandedRows: new Set(),
        toggleRow: vi.fn(),
        noticeDetails: {},
        loadingDetails: new Set()
    })),
}));

// Mock PipScreen and SuspenseAccountsScreen to avoid complex nesting in this test
vi.mock('../Pip/PipScreen', () => ({
    default: () => <div data-testid="pip-screen">Pip Screen</div>
}));
vi.mock('../Suspense/SuspenseAccountsScreen', () => ({
    default: () => <div data-testid="suspense-screen">Suspense Screen</div>
}));

describe('StatementsScreen', () => {
    const mockUseStatementsScreen = vi.mocked(useStatementsScreen);

    const defaultMockValue = {
        activeSubTab: 1,
        finalActiveSubTab: 1,
        forwardBalanceNotices: [],
        totalElements: 0,
        queryParams: { page: 0, size: 25, sortField: 'effectiveDate', sortOrder: 'desc' as const, fromDate: '2023-11-25', toDate: '2023-12-25' },
        stats: { totalOriginalAmount: 50000, totalRemainingBalance: 25000, actionRequired: 5 },
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
        refetchNotices: vi.fn(),
        globalFilters: { rangeLabel: '1 month', fromDate: '2023-11-25', toDate: '2023-12-25' },
    };

    beforeEach(() => {
        mockUseStatementsScreen.mockReturnValue(defaultMockValue);
    });

    it('renders the screen header and summary cards', () => {
        renderWithProviders(<StatementsScreen />);
        expect(screen.getByText('Forward Balance Notices')).toBeInTheDocument();
        expect(screen.getByText('$50,000.00')).toBeInTheDocument(); // totalOriginalAmount
        expect(screen.getByText('$25,000.00')).toBeInTheDocument(); // totalRemainingBalance
        expect(screen.getByText('5')).toBeInTheDocument(); // actionRequired
    });

    it('renders table headers for Forward Balance Notices', () => {
        renderWithProviders(<StatementsScreen />);
        expect(screen.getByText('NOTICE ID')).toBeInTheDocument();
        expect(screen.getByText('NOTIFICATION DATE')).toBeInTheDocument();
        expect(screen.getByText('PAYER')).toBeInTheDocument();
        expect(screen.getByText('REMAINING BALANCE')).toBeInTheDocument();
    });

    it('displays loading state in table when isFetching is true', () => {
        mockUseStatementsScreen.mockReturnValue({
            ...defaultMockValue,
            isFetching: true
        });

        const { container } = renderWithProviders(<StatementsScreen />);
        const skeletons = container.querySelectorAll('.MuiSkeleton-root');
        expect(skeletons.length).toBeGreaterThan(0);
    });

    it('renders PipScreen when finalActiveSubTab is 0', () => {
        mockUseStatementsScreen.mockReturnValue({
            ...defaultMockValue,
            finalActiveSubTab: 0
        });
        renderWithProviders(<StatementsScreen />);
        expect(screen.getByTestId('pip-screen')).toBeInTheDocument();
    });

    it('renders SuspenseAccountsScreen when finalActiveSubTab is 2', () => {
        mockUseStatementsScreen.mockReturnValue({
            ...defaultMockValue,
            finalActiveSubTab: 2
        });
        renderWithProviders(<StatementsScreen />);
        expect(screen.getByTestId('suspense-screen')).toBeInTheDocument();
    });
});
