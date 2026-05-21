import { useState, useCallback, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { setIsGlobalFetching } from '@/store/slices/uiSlice';
import { setGlobalFilters } from '@/store/slices/financialsSlice';
import { useSearchSuspenseAccountsQuery } from '@/store/api/financialsApi';
import { calculateDatesFromLabel } from '@/utils/dateUtils';

export const useSuspenseAccountsScreen = ({ skip = false }: { skip?: boolean } = {}) => {
    const dispatch = useAppDispatch();
    const { globalFilters } = useAppSelector(s => s.financials);
    const [viewType, setViewType] = useState<'account' | 'payer' | 'month'>('account');
    const [manageDialogOpen, setManageDialogOpen] = useState(false);

    const [queryParams, setQueryParams] = useState({
        page: 0,
        size: 10,
        sortField: '',
        sortOrder: 'desc' as 'asc' | 'desc',
        fromDate: globalFilters.fromDate,
        toDate: globalFilters.toDate,
        transactionNo: '',
    });

    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = useCallback((term: string) => {
        setSearchTerm(term);
        setQueryParams(prev => ({ ...prev, transactionNo: term, page: 0 }));
    }, []);

    // Handle auto-reset when search is cleared
    useEffect(() => {
        if (searchTerm === '' && queryParams.transactionNo !== '') {
            setQueryParams(prev => ({ ...prev, transactionNo: '', page: 0 }));
        }
    }, [searchTerm, queryParams.transactionNo]);

    const { data, isFetching, isError, refetch } = useSearchSuspenseAccountsQuery({
        page: queryParams.page + 1,
        size: queryParams.size,
        sort: queryParams.sortField,
        desc: queryParams.sortOrder === 'desc',
        fromDate: queryParams.fromDate,
        toDate: queryParams.toDate,
        transactionNo: queryParams.transactionNo
    }, { skip });

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
            dispatch(setGlobalFilters({ fromDate: from, toDate: to, rangeLabel: 'Custom' }));
        } else {
            const dates = calculateDatesFromLabel(range);
            if (dates) {
                setQueryParams(prev => ({ ...prev, fromDate: dates.from, toDate: dates.to, page: 0 }));
                dispatch(setGlobalFilters({ fromDate: dates.from, toDate: dates.to, rangeLabel: range }));
            }
        }
    }, [dispatch]);

    const handleSortChange = useCallback((colId: string, direction: 'asc' | 'desc') => {
        setQueryParams(prev => ({ ...prev, sortField: colId, sortOrder: direction, page: 0 }));
    }, []);

    const onPageChange = useCallback((p: number) => setQueryParams(prev => ({ ...prev, page: p })), []);
    const onRowsPerPageChange = useCallback((s: number) => setQueryParams(prev => ({ ...prev, size: s, page: 0 })), []);

    const responseData = data?.data;

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
        searchTerm,
        setSearchTerm,
        onSearch: handleSearch,
        isError,
        refetch,
    };
};
