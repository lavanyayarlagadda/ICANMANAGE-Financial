import { useState, useCallback, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { setGlobalFilters } from '@/store/slices/financialsSlice';
import { calculateDatesFromLabel } from '@/utils/dateUtils';
import { DEFAULT_PAGE_SIZE, SORT_ORDER } from '@/constants/common';

export const useBankDepositFilters = () => {
    const dispatch = useAppDispatch();
    const { globalFilters } = useAppSelector(s => s.financials);

    const [selectedEntityId, setSelectedEntityId] = useState<'all' | string>('all');
    const [exceptionsOnly, setExceptionsOnly] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        payerList: [] as string[],
        stateList: [] as string[],
        transactionsList: [] as string[],
        accountList: [] as string[],
        batchOwnerIds: [] as string[],
        status: null as string | null,
    });
    const [queryParams, setQueryParams] = useState({
        page: 0,
        size: DEFAULT_PAGE_SIZE,
        sortField: 'date',
        sortOrder: SORT_ORDER.DESC as 'asc' | 'desc',
        fromDate: globalFilters.fromDate,
        toDate: globalFilters.toDate,
        transactionNo: '',
    });

    // Synchronize queryParams with global filters
    useEffect(() => {
        setQueryParams(prev => ({
            ...prev,
            fromDate: globalFilters.fromDate,
            toDate: globalFilters.toDate,
        }));
    }, [globalFilters.fromDate, globalFilters.toDate]);

    // Handle auto-reset when search is cleared
    useEffect(() => {
        if (searchTerm === '' && queryParams.transactionNo !== '') {
            setQueryParams(prev => ({ ...prev, transactionNo: '', page: 0 }));
        }
    }, [searchTerm, queryParams.transactionNo]);

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

    const handleSearch = useCallback((term: string) => {
        setSearchTerm(term);
        setQueryParams(prev => ({ ...prev, transactionNo: term, page: 0 }));
    }, []);

    const handleFilterChange = useCallback((newFilters: Partial<typeof filters>) => {
        setFilters(prev => ({ ...prev, ...newFilters }));
        setQueryParams(prev => ({ ...prev, page: 0 }));
    }, []);

    return {
        selectedEntityId,
        setSelectedEntityId,
        exceptionsOnly,
        setExceptionsOnly,
        searchTerm,
        setSearchTerm,
        filters,
        setFilters: handleFilterChange,
        queryParams,
        handleSearch,
        handleRangeChange,
        handleSortChange,
        onPageChange,
        onRowsPerPageChange,
        globalFilters
    };
};
