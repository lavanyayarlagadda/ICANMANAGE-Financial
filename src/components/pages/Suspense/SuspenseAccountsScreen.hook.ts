import { useState, useCallback, useEffect, useMemo } from 'react';
import { useAppDispatch } from '@/store';
import { setIsGlobalFetching } from '@/store/slices/uiSlice';
import { useSearchSuspenseAccountsQuery } from '@/store/api/financialsApi';
import { subMonths, format } from 'date-fns';

export const useSuspenseAccountsScreen = ({ skip = false }: { skip?: boolean } = {}) => {
    const dispatch = useAppDispatch();
    const [viewType, setViewType] = useState<'account' | 'payer' | 'month'>('account');
    const [manageDialogOpen, setManageDialogOpen] = useState(false);

    const [queryParams, setQueryParams] = useState({
        page: 0,
        size: 10,
        sortField: '',
        sortOrder: 'desc' as 'asc' | 'desc',
        fromDate: format(subMonths(new Date(), 6), 'yyyy-MM-dd'),
        toDate: format(new Date(), 'yyyy-MM-dd'),
    });

    const { data, isFetching, isError, refetch } = useSearchSuspenseAccountsQuery({
        page: queryParams.page + 1,
        size: queryParams.size,
        sort: queryParams.sortField,
        desc: queryParams.sortOrder === 'desc',
        fromDate: queryParams.fromDate,
        toDate: queryParams.toDate
    }, { skip });

    useEffect(() => {
        if (data) {
            console.log('[SuspenseScreen] API Response:', data);
        }
        if (isError) {
            console.error('[SuspenseScreen] API Error');
        }
    }, [data, isError]);

    useEffect(() => {
        if (!skip) {
            dispatch(setIsGlobalFetching(isFetching));
        }
        return () => {
             if (!skip) dispatch(setIsGlobalFetching(false));
        };
    }, [isFetching, skip, dispatch]);

    const handleViewChange = useCallback((_: React.MouseEvent<HTMLElement>, nextView: 'account' | 'payer' | 'month') => {
        if (nextView !== null) setViewType(nextView);
    }, []);

    const toggleManageDialog = useCallback((open: boolean) => {
        setManageDialogOpen(open);
    }, []);

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

    const responseData = data;

    return {
        viewType,
        suspenseAccounts: responseData?.rows ?? [],
        summary: responseData?.summary,
        periods: responseData?.periods ?? [],
        totalElements: responseData?.totalElements ?? 0,
        queryParams,
        manageDialogOpen,
        handleViewChange,
        toggleManageDialog,
        handleRangeChange,
        handleSortChange,
        onPageChange,
        onRowsPerPageChange,
        isError,
        refetch,
    };
};
