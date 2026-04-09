import { useState, useCallback, useMemo } from 'react';
import { useAppSelector, useAppDispatch } from '@/store';
import { setRemittanceDetail, setSelectedClaimIndex } from '@/store/slices/financialsSlice';
import { useSearchServiceLinesQuery, useGetRemittanceClaimsQuery } from '@/store/api/financialsApi';

export const useRemittanceDetailScreen = () => {
    const dispatch = useAppDispatch();
    const detail = useAppSelector((s) => s.financials.remittanceDetail);
    const claims = useAppSelector((s) => s.financials.remittanceClaims);
    const selectedIndex = useAppSelector((s) => s.financials.selectedClaimIndex);
    const selectedPaymentId = useAppSelector((s) => s.financials.selectedPaymentId);

    const [claimsQueryParams, setClaimsQueryParams] = useState({
        page: 0,
        size: 5, // Smaller default for the claims list
        sort: 'payerIcn', // or another relevant field
        desc: false,
    });

    const [slQueryParams, setSlQueryParams] = useState({
        page: 0,
        size: 10,
        sort: 'lineNumber',
        desc: false,
    });

    // Dynamically fetch claims if they weren't already provided, or to allow pagination
    const { data: claimsData, isFetching: isClaimsFetching } = useGetRemittanceClaimsQuery({
        claimId: selectedPaymentId || '',
        page: claimsQueryParams.page + 1,
        size: claimsQueryParams.size,
        sort: claimsQueryParams.sort,
        desc: claimsQueryParams.desc,
    }, { skip: !selectedPaymentId });

    // Effective claims are either from the query or from original store (fallback)
    const effectiveClaims = useMemo(() => {
        if (claimsData && Array.isArray(claimsData)) return claimsData;
        return claims;
    }, [claimsData, claims]);

    const { data: slData, isFetching: isSlFetching, isLoading: isSlLoading } = useSearchServiceLinesQuery({
        page: slQueryParams.page + 1,
        size: slQueryParams.size,
        sort: slQueryParams.sort,
        desc: slQueryParams.desc,
        check: detail?.transactionNo || '',
    }, { skip: !detail?.transactionNo });

    const handleClaimSelect = useCallback((index: number) => {
        const selectedClaim = effectiveClaims[index];
        if (selectedClaim) {
            dispatch(setSelectedClaimIndex(index));
            dispatch(setRemittanceDetail(selectedClaim));
            setSlQueryParams(prev => ({ ...prev, page: 0 }));
        }
    }, [dispatch, effectiveClaims]);

    const handleClaimsPageChange = useCallback((p: number) => setClaimsQueryParams(prev => ({ ...prev, page: p })), []);
    const handleClaimsRowsPerPageChange = useCallback((s: number) => setClaimsQueryParams(prev => ({ ...prev, size: s, page: 0 })), []);
    const handleClaimsSortChange = useCallback((col: string, dir: string) => setClaimsQueryParams(prev => ({ ...prev, sort: col, desc: dir === 'desc', page: 0 })), []);

    const handlePageChange = useCallback((p: number) => setSlQueryParams(prev => ({ ...prev, page: p })), []);
    const handleRowsPerPageChange = useCallback((s: number) => setSlQueryParams(prev => ({ ...prev, size: s, page: 0 })), []);
    const handleSortChange = useCallback((col: string, dir: string) => setSlQueryParams(prev => ({ ...prev, sort: col, desc: dir === 'desc', page: 0 })), []);

    return {
        detail,
        claims: effectiveClaims,
        isClaimsFetching,
        claimsQueryParams,
        handleClaimsPageChange,
        handleClaimsRowsPerPageChange,
        handleClaimsSortChange,
        selectedIndex,
        serviceLines: slData?.data?.content || [],
        totalElements: slData?.data?.totalElements || 0,
        isSlFetching,
        isSlLoading,
        slQueryParams,
        handleClaimSelect,
        handlePageChange,
        handleRowsPerPageChange,
        handleSortChange,
    };
};
