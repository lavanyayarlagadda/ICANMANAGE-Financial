import { useState, useMemo, useCallback, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/store';
import { openViewDialog, openEditDialog, openConfirmDelete, setIsGlobalFetching } from '@/store/slices/uiSlice';
import { CollectionAccount } from '@/interfaces/financials';
import { useSearchCollectionsQuery } from '@/store/api/financialsApi';
import { subMonths, format } from 'date-fns';

export const useCollectionsScreen = ({ skip = false }: { skip?: boolean } = {}) => {
    const dispatch = useAppDispatch();
    const { actionTriggers } = useAppSelector(s => s.ui);
    
    const [queryParams, setQueryParams] = useState({
        page: 0,
        size: 10,
        sortField: 'accountNumber',
        sortOrder: 'desc' as 'asc' | 'desc',
        fromDate: format(subMonths(new Date(), 6), 'yyyy-MM-dd'),
        toDate: format(new Date(), 'yyyy-MM-dd'),
    });

    const { data: searchData, isFetching: isSearching, isError: isSearchError, refetch: refetchSearch } = useSearchCollectionsQuery({
        page: queryParams.page + 1,
        size: queryParams.size,
        sort: queryParams.sortField,
        desc: queryParams.sortOrder === 'desc',
        fromDate: queryParams.fromDate,
        toDate: queryParams.toDate
    }, { skip });

    useEffect(() => {
        dispatch(setIsGlobalFetching(isSearching));
        return () => { dispatch(setIsGlobalFetching(false)); };
    }, [isSearching, dispatch]);

    const collections = useMemo(() => searchData?.data?.content ?? [], [searchData]);
    const totalElements = searchData?.data?.totalElements ?? 0;

    const stats = useMemo(() => {
        const totalDue = collections.reduce((sum, r) => sum + r.totalDue, 0);
        const totalCollected = collections.reduce((sum, r) => sum + r.amountCollected, 0);
        const totalBalance = collections.reduce((sum, r) => sum + r.balance, 0);
        const openAccounts = collections.filter((c) => c.status === 'Open').length;
        return { totalDue, totalCollected, totalBalance, openAccounts };
    }, [collections]);

    const handleView = useCallback((r: CollectionAccount) => dispatch(openViewDialog(r)), [dispatch]);
    const handleEdit = useCallback((r: CollectionAccount) => dispatch(openEditDialog(r)), [dispatch]);
    const handleDelete = useCallback((id: string) => dispatch(openConfirmDelete({ id, type: 'collection' })), [dispatch]);

    const handleRangeChange = useCallback((range: string) => {
        if (range.includes(' to ')) {
            const [from, to] = range.split(' to ');
            setQueryParams(prev => ({ ...prev, fromDate: from, toDate: to, page: 0 }));
        }
    }, []);

    const handleSortChange = useCallback((colId: string, direction: 'asc' | 'desc') => {
        setQueryParams(prev => ({ ...prev, sortField: colId, sortOrder: direction, page: 0 }));
    }, []);

    const handlePageChange = useCallback((p: number) => setQueryParams(prev => ({ ...prev, page: p })), []);
    const handleRowsPerPageChange = useCallback((s: number) => setQueryParams(prev => ({ ...prev, size: s, page: 0 })), []);

    return {
        collections,
        totalElements,
        queryParams,
        stats,
        handleView,
        handleEdit,
        handleDelete,
        handleRangeChange,
        handleSortChange,
        handlePageChange,
        handleRowsPerPageChange,
        isError: isSearchError,
        dispatch
    };
};
