import { useState, useCallback } from 'react';
import { useAppSelector, useAppDispatch } from '@/store';
import { setRemittanceDetail, setSelectedClaimIndex } from '@/store/slices/financialsSlice';
import { useSearchServiceLinesQuery } from '@/store/api/financialsApi';

export const useRemittanceDetailScreen = () => {
    const dispatch = useAppDispatch();
    const detail = useAppSelector((s) => s.financials.remittanceDetail);
    const claims = useAppSelector((s) => s.financials.remittanceClaims);
    const selectedIndex = useAppSelector((s) => s.financials.selectedClaimIndex);

    const [slQueryParams, setSlQueryParams] = useState({
        page: 0,
        size: 10,
        sort: 'lineNumber',
        desc: false,
    });

    const { data: slData, isFetching: isSlFetching, isLoading: isSlLoading } = useSearchServiceLinesQuery({
        page: slQueryParams.page + 1,
        size: slQueryParams.size,
        sort: slQueryParams.sort,
        desc: slQueryParams.desc,
        check: detail?.transactionNo || '',
    }, { skip: !detail?.transactionNo });

    const handleClaimSelect = useCallback((index: number) => {
        const selectedClaim = claims[index];
        dispatch(setSelectedClaimIndex(index));
        dispatch(setRemittanceDetail(selectedClaim));
        setSlQueryParams(prev => ({ ...prev, page: 0 }));
    }, [dispatch, claims]);

    const handlePageChange = useCallback((p: number) => setSlQueryParams(prev => ({ ...prev, page: p })), []);
    const handleRowsPerPageChange = useCallback((s: number) => setSlQueryParams(prev => ({ ...prev, size: s, page: 0 })), []);
    const handleSortChange = useCallback((col: string, dir: string) => setSlQueryParams(prev => ({ ...prev, sort: col, desc: dir === 'desc', page: 0 })), []);

    return {
        detail,
        claims,
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
