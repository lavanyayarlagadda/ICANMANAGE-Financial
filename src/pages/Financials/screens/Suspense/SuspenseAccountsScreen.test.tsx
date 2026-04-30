import { screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import SuspenseAccountsScreen from './SuspenseAccountsScreen';
import { useSuspenseAccountsScreen } from './SuspenseAccountsScreen.hook';
import { renderWithProviders } from '@/test/test-utils';

// Mock the hook
vi.mock('./SuspenseAccountsScreen.hook', () => ({
    useSuspenseAccountsScreen: vi.fn(),
}));

describe('SuspenseAccountsScreen', () => {
    const mockUseSuspenseAccountsScreen = vi.mocked(useSuspenseAccountsScreen);

    beforeEach(() => {
        mockUseSuspenseAccountsScreen.mockReturnValue({
            viewType: 'account',
            manageDialogOpen: false,
            handleViewChange: vi.fn(),
            toggleManageDialog: vi.fn(),
            suspenseAccounts: [],
            summary: { totalOpenSuspense: 150000, oldestItemAgeDays: 120, avgDaysInSuspense: 45, atRiskCount: 15 },
            periods: ['2023-12', '2023-11'],
            totalElements: 0,
            queryParams: { page: 0, size: 25, sortField: 'accountType', sortOrder: 'asc', fromDate: '2023-11-25', toDate: '2023-12-25' },
            onPageChange: vi.fn(),
            onRowsPerPageChange: vi.fn(),
            handleSortChange: vi.fn(),
            searchTerm: '',
            setSearchTerm: vi.fn(),
            onSearch: vi.fn(),
            isFetching: false,
            globalFilters: { rangeLabel: '1 month', fromDate: '2023-11-25', toDate: '2023-12-25' },
        });
    });

    it('renders the screen title and summary cards', () => {
        renderWithProviders(<SuspenseAccountsScreen />);
        expect(screen.getByText('Suspense Accounts')).toBeInTheDocument();
        expect(screen.getByText('$150,000.00')).toBeInTheDocument(); // totalOpenSuspense
        expect(screen.getByText('120 days')).toBeInTheDocument(); // oldestItemAgeDays
        expect(screen.getByText('15')).toBeInTheDocument(); // atRiskCount
    });

    it('renders the view toggle and manage button', () => {
        renderWithProviders(<SuspenseAccountsScreen />);
        expect(screen.getByText('Manage Accounts')).toBeInTheDocument();
        expect(screen.getByText('By Account')).toBeInTheDocument();
        expect(screen.getByText('By Payer')).toBeInTheDocument();
    });

    it('renders table headers for Account view', () => {
        renderWithProviders(<SuspenseAccountsScreen />);
        expect(screen.getByText('ACCOUNT TYPE')).toBeInTheDocument();
        expect(screen.getByText('ITEMS')).toBeInTheDocument();
        expect(screen.getByText('TOTAL BALANCE')).toBeInTheDocument();
    });
});
