import { screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import RemittanceDetailScreen from './RemittanceDetailScreen';
import { useRemittanceDetailScreen } from './RemittanceDetailScreen.hook';
import { renderWithProviders } from '@/test/test-utils';

// Mock the hook
vi.mock('./RemittanceDetailScreen.hook', () => ({
    useRemittanceDetailScreen: vi.fn(),
}));

describe('RemittanceDetailScreen', () => {
    const mockUseRemittanceDetailScreen = vi.mocked(useRemittanceDetailScreen);

    const defaultMockValue = {
        detail: { 
            patientName: 'John Doe', 
            paymentDate: '2023-12-25', 
            transactionNo: 'EFT123', 
            paymentAmount: 500, 
            payerName: 'Medicare',
            patientCtlNo: 'CTL001',
            payerIcn: 'ICN999',
            statementPeriod: '2023-12',
            claimCharge: 1000,
            allowedAmount: 800,
            claimPayment: 501,
            contractAdj: 200,
            adjustmentCodes: 'CO-45',
            remitRemarks: 'N30',
            providerAdjAmount: 0,
            providerAdjCodes: '',
            providerNpi: '1234567890',
            claimStatusCode: '1',
            providerName: 'Test Hospital'
        },
        claims: [{ payerIcn: 'ICN999', claimCharge: 1000, claimStatusCode: '1' }],
        isClaimsFetching: false,
        claimsQueryParams: { page: 0, size: 3 },
        handleClaimsPageChange: vi.fn(),
        selectedIndex: 0,
        serviceLines: [],
        totalElements: 0,
        totalClaims: 1,
        isSlFetching: false,
        isSlLoading: false,
        slQueryParams: { page: 0, size: 25, sort: 'lineNo', desc: false },
        handleClaimSelect: vi.fn(),
        handlePageChange: vi.fn(),
        handleRowsPerPageChange: vi.fn(),
        handleSortChange: vi.fn(),
    };

    beforeEach(() => {
        mockUseRemittanceDetailScreen.mockReturnValue(defaultMockValue);
    });

    it('renders the remittance detail summary', () => {
        renderWithProviders(<RemittanceDetailScreen />);
        expect(screen.getByText('Claim Detail – John Doe')).toBeInTheDocument();
        expect(screen.getByText('Medicare')).toBeInTheDocument();
        expect(screen.getAllByText('$500.00').length).toBeGreaterThanOrEqual(1);
        expect(screen.getByText('ICN: ICN999')).toBeInTheDocument();
    });

    it('displays loading state in table when isSlFetching is true', () => {
        mockUseRemittanceDetailScreen.mockReturnValue({
            ...defaultMockValue,
            isSlFetching: true
        });

        const { container } = renderWithProviders(<RemittanceDetailScreen />);
        const skeletons = container.querySelectorAll('.MuiSkeleton-root');
        expect(skeletons.length).toBeGreaterThan(0);
    });

    it('renders service line table headers', () => {
        renderWithProviders(<RemittanceDetailScreen />);
        expect(screen.getByText('LINE #')).toBeInTheDocument();
        expect(screen.getByText('PROC CODE')).toBeInTheDocument();
        expect(screen.getByText('DOS START')).toBeInTheDocument();
        expect(screen.getByText('ADJ AMT')).toBeInTheDocument();
    });

    it('shows empty state when no detail is present', () => {
        mockUseRemittanceDetailScreen.mockReturnValue({
            ...defaultMockValue,
            detail: null,
            claims: []
        });
        renderWithProviders(<RemittanceDetailScreen />);
        expect(screen.getByText('No remittance detail selected.')).toBeInTheDocument();
    });
});
