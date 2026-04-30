import { screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import RecoupmentsScreen from './RecoupmentsScreen';
import { useRecoupmentsScreen } from './RecoupmentsScreen.hook';
import { renderWithProviders } from '@/test/test-utils';

// Mock the hook
vi.mock('./RecoupmentsScreen.hook', () => ({
    useRecoupmentsScreen: vi.fn(),
}));

describe('RecoupmentsScreen', () => {
    const mockUseRecoupmentsScreen = vi.mocked(useRecoupmentsScreen);

    const defaultMockValue = {
        recoupments: [],
        totalElements: 0,
        queryParams: { page: 0, size: 25, sortField: 'date', sortOrder: 'desc' as const, fromDate: '2023-11-25', toDate: '2023-12-25' },
        summaryData: { totalRecoupments: 50, totalAmount: 25000, activeRecoupments: 10 },
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
        payerOptionsLoading: false,
        payerOptionsError: false,
        drillDownParams: { page: 0, size: 25, sortField: 'paymentDate', sortOrder: 'desc' as const },
        isFetching: false,
        dispatch: vi.fn(),
        globalFilters: { rangeLabel: '1 month', fromDate: '2023-11-25', toDate: '2023-12-25' },
    };

    beforeEach(() => {
        mockUseRecoupmentsScreen.mockReturnValue(defaultMockValue);
    });

    it('renders the screen header and summary cards', () => {
        renderWithProviders(<RecoupmentsScreen />);
        expect(screen.getByText('Recoupments')).toBeInTheDocument();
        expect(screen.getByText('50')).toBeInTheDocument(); // totalRecoupments
        expect(screen.getByText('$25,000.00')).toBeInTheDocument(); // totalAmount
    });

    it('displays loading state in table when isFetching is true', () => {
        mockUseRecoupmentsScreen.mockReturnValue({
            ...defaultMockValue,
            isFetching: true
        });
        
        const { container } = renderWithProviders(<RecoupmentsScreen />);
        const skeletons = container.querySelectorAll('.MuiSkeleton-root');
        expect(skeletons.length).toBeGreaterThan(0);
    });

    it('renders table headers correctly', () => {
        renderWithProviders(<RecoupmentsScreen />);
        expect(screen.getByText('RECOUPMENT ID')).toBeInTheDocument();
        expect(screen.getByText('CLAIM / PATIENT')).toBeInTheDocument();
        expect(screen.getByText('RECOUPMENT AMT')).toBeInTheDocument();
        expect(screen.getByText('STATUS')).toBeInTheDocument();
    });
});
