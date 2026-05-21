import { useState, useCallback, useMemo, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/store';
import { setRemittanceDetail, setSelectedClaimIndex } from '@/store/slices/financialsSlice';
import { setIsGlobalFetching } from '@/store/slices/uiSlice';
import { useSearchServiceLinesQuery, useGetRemittanceClaimsQuery } from '@/store/api/financialsApi';

export const useRemittanceDetailScreen = () => {
    const dispatch = useAppDispatch();
    const detail = useAppSelector((s) => s.financials.remittanceDetail);
    const claims = useAppSelector((s) => s.financials.remittanceClaims);
    const selectedIndex = useAppSelector((s) => s.financials.selectedClaimIndex);
    const selectedPaymentId = useAppSelector((s) => s.financials.selectedPaymentId);

    const [claimsQueryParams, setClaimsQueryParams] = useState({
        page: 0,
        size: 3,
    });

    const [slQueryParams, setSlQueryParams] = useState({
        page: 0,
        size: 10,
        sort: 'lineNumber',
        desc: false,
    });

    // Dynamically fetch claims if they weren't already provided, or to allow pagination
    const { data: claimsData, isFetching: isClaimsFetching } = useGetRemittanceClaimsQuery({
        claimId: selectedPaymentId as string,
    }, { skip: !selectedPaymentId });

    // Front-end pagination logic for claims
    const effectiveClaims = useMemo(() => {
        const source = (claimsData && Array.isArray(claimsData)) ? claimsData : (Array.isArray(claims) ? claims : []);
        return source;
    }, [claimsData, claims]);

    const paginatedClaims = useMemo(() => {
        const start = claimsQueryParams.page * claimsQueryParams.size;
        return effectiveClaims.slice(start, start + claimsQueryParams.size);
    }, [effectiveClaims, claimsQueryParams]);

    const { data: slData, isFetching: isSlFetching, isLoading: isSlLoading } = useSearchServiceLinesQuery({
        page: slQueryParams.page + 1,
        size: slQueryParams.size,
        sort: slQueryParams.sort,
        desc: slQueryParams.desc,
        check: detail?.transactionNo || '',
    }, { skip: !detail?.transactionNo });

    // Global loader for service lines
    useEffect(() => {
        dispatch(setIsGlobalFetching(isSlFetching || isSlLoading));
        return () => {
            dispatch(setIsGlobalFetching(false));
        };
    }, [isSlFetching, isSlLoading, dispatch]);

    const paginatedSelectedIndex = useMemo(() => {
        const start = claimsQueryParams.page * claimsQueryParams.size;
        const relIndex = selectedIndex - start;
        return (relIndex >= 0 && relIndex < 3) ? relIndex : -1;
    }, [selectedIndex, claimsQueryParams]);

    const handleClaimSelect = useCallback((paginatedIndex: number) => {
        const actualIndex = (claimsQueryParams.page * claimsQueryParams.size) + paginatedIndex;
        const selectedClaim = effectiveClaims[actualIndex];
        if (selectedClaim) {
            dispatch(setSelectedClaimIndex(actualIndex));
            dispatch(setRemittanceDetail(selectedClaim));
            setSlQueryParams(prev => ({ ...prev, page: 0 }));
        } else {
            dispatch(setRemittanceDetail(null));
        }
    }, [dispatch, effectiveClaims, claimsQueryParams.page, claimsQueryParams.size]);

    const handleClaimsPageChange = useCallback((p: number) => setClaimsQueryParams(prev => ({ ...prev, page: p })), []);

    const handlePageChange = useCallback((p: number) => setSlQueryParams(prev => ({ ...prev, page: p })), []);
    const handleRowsPerPageChange = useCallback((s: number) => setSlQueryParams(prev => ({ ...prev, size: s, page: 0 })), []);
    const handleSortChange = useCallback((col: string, dir: string) => setSlQueryParams(prev => ({ ...prev, sort: col, desc: dir === 'desc', page: 0 })), []);

    return {
        detail,
        claims: paginatedClaims,
        totalClaims: effectiveClaims.length,
        isClaimsFetching,
        claimsQueryParams,
        handleClaimsPageChange,
        selectedIndex: paginatedSelectedIndex,
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
