import { screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import BankDepositsScreen from './BankDepositsScreen';
import { useBankDepositsScreen } from './BankDepositsScreen.hook';
import { renderWithProviders } from '@/test/test-utils';

// Mock the hook
vi.mock('./BankDepositsScreen.hook', () => ({
    useBankDepositsScreen: vi.fn(),
}));

describe('BankDepositsScreen', () => {
    const mockUseBankDepositsScreen = vi.mocked(useBankDepositsScreen);

    const defaultMockValue = {
        // Data & Processed State
        bankDeposits: [],
        filteredDeposits: [{ id: '1', name: 'Main Entity', items: [], totalItems: 0 }],
        totalElements: 0,
        summaryStats: { totalBankAmt: 100000, reconRate: '98.50', exceptions: 5 },
        summaryData: undefined,
        payerOptions: [],
        statusOptions: [],
        dynamicColumns: [],
        entities: [{ id: '1', name: 'Main Entity' }],
        isFetching: false,
        isError: false,
        isHeadersSuccess: true,

        // Filter State & Handlers
        queryParams: { 
            page: 0, 
            size: 25, 
            sortField: 'id', 
            sortOrder: 'desc' as const,
            fromDate: '2024-01-01',
            toDate: '2024-01-31',
            transactionNo: ''
        },
        searchTerm: '',
        setSearchTerm: vi.fn(),
        onSearch: vi.fn(),
        filters: {
            payerList: [],
            stateList: [],
            transactionsList: [],
            accountList: [],
            batchOwnerIds: [],
            status: '',
        },
        setFilters: vi.fn(),
        selectedEntityId: '1',
        setSelectedEntityId: vi.fn(),
        exceptionsOnly: false,
        setExceptionsOnly: vi.fn(),
        handleRangeChange: vi.fn(),
        handleSortChange: vi.fn(),
        onPageChange: vi.fn(),
        onRowsPerPageChange: vi.fn(),

        // Action Handlers
        handleExport: vi.fn(),

        // History & Expansion State
        expandedRows: new Set<string>(),
        rowHistory: {},
        toggleRow: vi.fn(),

        // Global State
        globalFilters: { 
            rangeLabel: '1 month', 
            fromDate: '2024-01-01', 
            toDate: '2024-01-31' 
        }
    };

    beforeEach(() => {
        mockUseBankDepositsScreen.mockReturnValue(defaultMockValue);
    });

    it('renders the screen header and summary cards', () => {
        renderWithProviders(<BankDepositsScreen />);
        
        expect(screen.getByText('Bank Deposit Reconciliation')).toBeInTheDocument();
        expect(screen.getByText('$100,000.00')).toBeInTheDocument(); // totalBankAmt formatted
        expect(screen.getByText('98.50%')).toBeInTheDocument(); // reconRate
        expect(screen.getByText('5')).toBeInTheDocument(); // exceptions
    });

    it('renders the search field and tabs', () => {
        renderWithProviders(<BankDepositsScreen />);
        
        expect(screen.getByPlaceholderText('Search by Check')).toBeInTheDocument();
        expect(screen.getByText('Main Entity')).toBeInTheDocument();
    });

    it('displays loading state in table when isFetching is true', () => {
        mockUseBankDepositsScreen.mockReturnValue({
            ...defaultMockValue,
            isFetching: true,
        });

        const { container } = renderWithProviders(<BankDepositsScreen />);
        
        // DataTable should show TableSkeleton (MUI Skeletons)
        const skeletons = container.querySelectorAll('.MuiSkeleton-root');
        expect(skeletons.length).toBeGreaterThan(0);
    });
});
