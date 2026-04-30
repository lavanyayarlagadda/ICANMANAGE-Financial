import { screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ReconciliationScreen from './ReconciliationScreen';
import { ReconciliationStatus, useReconciliation, HeaderConfig, ReconciliationRow, FilterState } from './ReconciliationScreen.hook';
import { renderWithProviders } from '@/test/test-utils';

// Mock the hook
vi.mock('./ReconciliationScreen.hook', () => ({
    useReconciliation: vi.fn(),
}));

describe('ReconciliationScreen', () => {
    const mockUseReconciliation = vi.mocked(useReconciliation);

    const defaultMockValue = {
        view: 'unreconciled' as ReconciliationStatus,
        loading: false,
        headerData: [
            { id: 'transactionNo', label: 'TX NO', align: 'left', isLink: true },
            { id: 'bankDeposit', label: 'AMOUNT', align: 'right', isCurrency: true },
            { id: 'actions', label: 'ACTIONS', align: 'center' }
        ] as HeaderConfig[],
        filteredData: [] as ReconciliationRow[],
        stats: {
            bankDeposit: 1000,
            remittance: 1000,
            cashPosting: 1000,
            payVariance: 1000,
            postVariance: 1000,
            reconciliationRate: 98.4,
        },
        handleToggle: vi.fn(),
        locations: ['All'],
        activeLocation: 'All',
        setActiveLocation: vi.fn(),
        searchFilters: { 
            payor: 'All',
            status: 'All',
            fromDate: '2023-11-25',
            toDate: '2023-12-25',
            transactionNo: '' 
        } as FilterState,
        setSearchFilters: vi.fn(),
        applyFilters: vi.fn(),
        handleGlobalTransactionSearch: vi.fn(),
        handleRangeChange: vi.fn(),
        setActiveAge: vi.fn(),
        activeAge: '0-30',
        ageRanges: ['0-30', '31-60', '61-90', '>90'],
        globalFilters: { rangeLabel: '1 month', fromDate: '2023-11-25', toDate: '2023-12-25' },
    };

    beforeEach(() => {
        mockUseReconciliation.mockReturnValue(defaultMockValue);
    });

    it('renders the screen tabs and stats', () => {
        renderWithProviders(<ReconciliationScreen />);
        expect(screen.getByText('All Locations')).toBeInTheDocument();
        expect(screen.getAllByText('$1,000.00').length).toBeGreaterThan(0);
    });

    it('displays loading state when loading is true', () => {
        mockUseReconciliation.mockReturnValue({
            ...defaultMockValue,
            loading: true
        });

        renderWithProviders(<ReconciliationScreen />);
        expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    it('renders table headers correctly', () => {
        renderWithProviders(<ReconciliationScreen />);
        expect(screen.getByText('TX NO')).toBeInTheDocument();
        expect(screen.getByText('AMOUNT')).toBeInTheDocument();
    });

    it('renders the search input in unreconciled view', () => {
        renderWithProviders(<ReconciliationScreen />);
        expect(screen.getByPlaceholderText('Search Tx No')).toBeInTheDocument();
    });
});
