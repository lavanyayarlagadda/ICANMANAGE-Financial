import { useState, useMemo, useCallback, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/store';
import { setIsGlobalFetching } from '@/store/slices/uiSlice';
import { useSearchForwardBalanceNoticesQuery } from '@/store/api/financialsApi';
import { subMonths, format } from 'date-fns';

export const useStatementsScreen = ({ skip = false }: { skip?: boolean } = {}) => {
    const dispatch = useAppDispatch();
    const { activeSubTab } = useAppSelector((s) => s.ui);
    const user = useAppSelector((s) => s.auth.user);
    const { selectedTenantId } = useAppSelector((s) => s.tenant);

    const isMindPath = useMemo(
        () => user?.company?.toLowerCase() === 'mindpath' || selectedTenantId?.toLowerCase() === 'mindpath',
        [user, selectedTenantId]
    );

    const finalActiveSubTab = (isMindPath && activeSubTab === 0) ? 1 : activeSubTab;

    const [queryParams, setQueryParams] = useState({
        page: 0,
        size: 10,
        sortField: 'notificationDate',
        sortOrder: 'desc' as 'asc' | 'desc',
        fromDate: format(subMonths(new Date(), 6), 'yyyy-MM-dd'),
        toDate: format(new Date(), 'yyyy-MM-dd'),
    });

    const isNoticesTab = finalActiveSubTab === 1;

    const { data: noticeData, isFetching: isFetchingNotices, isError: isErrorNotices, refetch: refetchNotices } = useSearchForwardBalanceNoticesQuery({
        page: queryParams.page + 1,
        size: queryParams.size,
        sort: queryParams.sortField,
        desc: queryParams.sortOrder === 'desc',
        fromDate: queryParams.fromDate,
        toDate: queryParams.toDate
    }, { skip: skip || !isNoticesTab });

    useEffect(() => {
        if (isNoticesTab) {
            dispatch(setIsGlobalFetching(isFetchingNotices));
        }
        return () => { 
            if (isNoticesTab) dispatch(setIsGlobalFetching(false)); 
        };
    }, [isFetchingNotices, isNoticesTab, dispatch]);

    const forwardBalanceNotices = useMemo(() => noticeData?.data?.content ?? [], [noticeData]);

    const stats = useMemo(() => {
        const totalOriginalAmount = forwardBalanceNotices.reduce((sum, r) => sum + (r.originalAmount ?? 0), 0);
        const totalRemainingBalance = forwardBalanceNotices.reduce((sum, r) => sum + (r.remainingBalance ?? 0), 0);
        return { totalOriginalAmount, totalRemainingBalance };
    }, [forwardBalanceNotices]);

    const handleRangeChange = useCallback((range: string) => {
        if (range.includes(' to ')) {
            const [from, to] = range.split(' to ');
            setQueryParams(prev => ({ ...prev, fromDate: from, toDate: to, page: 0 }));
        }
    }, []);

    const handleSortChange = useCallback((colId: string, direction: 'asc' | 'desc') => {
        setQueryParams(prev => ({ ...prev, sortField: colId, sortOrder: direction, page: 0 }));
    }, []);

    const onPageChange = useCallback((p: number) => setQueryParams(prev => ({ ...prev, page: p })), []);
    const onRowsPerPageChange = useCallback((s: number) => setQueryParams(prev => ({ ...prev, size: s, page: 0 })), []);

    return {
        activeSubTab,
        finalActiveSubTab,
        forwardBalanceNotices,
        totalElements: noticeData?.data?.totalElements ?? 0,
        queryParams,
        handleRangeChange,
        handleSortChange,
        onPageChange,
        onRowsPerPageChange,
        stats,
        isError: isErrorNotices,
        refetchNotices
    };
};

export const useForwardBalanceNoticesTable = () => {
    const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

    const toggleRow = useCallback((id: string) => {
        setExpandedRows((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(id)) newSet.delete(id);
            else newSet.add(id);
            return newSet;
        });
    }, []);

    return {
        expandedRows,
        toggleRow,
    };
};
