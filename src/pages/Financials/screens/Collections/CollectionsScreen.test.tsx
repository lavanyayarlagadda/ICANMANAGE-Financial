import { screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import CollectionsScreen from './CollectionsScreen';
import { useCollectionsScreen } from './CollectionsScreen.hook';
import { renderWithProviders } from '@/test/test-utils';

// Mock the hook
vi.mock('./CollectionsScreen.hook', () => ({
    useCollectionsScreen: vi.fn(),
}));

describe('CollectionsScreen', () => {
    const mockUseCollectionsScreen = vi.mocked(useCollectionsScreen);

    const defaultMockValue = {
        collections: [],
        totalElements: 0,
        queryParams: { page: 0, size: 25, sortField: 'accountNumber', sortOrder: 'asc' as const, fromDate: '2023-11-25', toDate: '2023-12-25' },
        stats: { totalDue: 10000, totalCollected: 5000, totalBalance: 4999, openAccounts: 10 },
        handleView: vi.fn(),
        handleEdit: vi.fn(),
        handleDelete: vi.fn(),
        handleRangeChange: vi.fn(),
        handleSortChange: vi.fn(),
        handlePageChange: vi.fn(),
        handleRowsPerPageChange: vi.fn(),
        globalFilters: { rangeLabel: '1 month', fromDate: '2023-11-25', toDate: '2023-12-25' },
        isError: false,
        dispatch: vi.fn(),
    };

    beforeEach(() => {
        mockUseCollectionsScreen.mockReturnValue(defaultMockValue);
    });

    it('renders the screen title and summary cards', () => {
        renderWithProviders(<CollectionsScreen />);
        expect(screen.getByText('Collections')).toBeInTheDocument();
        expect(screen.getByText('$10,000.00')).toBeInTheDocument(); // totalDue
        expect(screen.getByText('$5,000.00')).toBeInTheDocument(); // totalCollected
        expect(screen.getByText('10')).toBeInTheDocument(); // openAccounts
    });

    it('renders table headers correctly', () => {
        renderWithProviders(<CollectionsScreen />);
        expect(screen.getByText('Account #')).toBeInTheDocument();
        expect(screen.getByText('Patient Name')).toBeInTheDocument();
        expect(screen.getAllByText('Total Due').length).toBeGreaterThan(0);
        expect(screen.getByText('Priority')).toBeInTheDocument();
    });
});
