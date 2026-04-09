import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { useAppSelector, useAppDispatch } from '@/store';
import { setIsGlobalFetching } from '@/store/slices/uiSlice';
import { useSearchBankDepositsBodyQuery } from '@/store/api/financialsApi';
import { subMonths, format } from 'date-fns';

export const useBankDepositsScreen = ({ skip = false }: { skip?: boolean } = {}) => {
    const dispatch = useAppDispatch();
    const { actionTriggers } = useAppSelector(s => s.ui);
    const reloadCount = useRef(actionTriggers.reload);

    const [selectedEntityId, setSelectedEntityId] = useState<'all' | string>('all');
    const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
    const [exceptionsOnly, setExceptionsOnly] = useState(false);

    const [queryParams, setQueryParams] = useState({
        page: 0,
        size: 10,
        sortField: 'date',
        sortOrder: 'desc' as 'asc' | 'desc',
        fromDate: format(subMonths(new Date(), 6), 'yyyy-MM-dd'),
        toDate: format(new Date(), 'yyyy-MM-dd'),
    });

    const { data, isFetching, isError, refetch } = useSearchBankDepositsBodyQuery({
        page: queryParams.page + 1,
        size: queryParams.size,
        sort: queryParams.sortField,
        desc: queryParams.sortOrder === 'desc',
        fromDate: queryParams.fromDate,
        toDate: queryParams.toDate
    }, { skip });

    useEffect(() => {
        if (skip) {
            dispatch(setIsGlobalFetching(false));
            return;
        }
        dispatch(setIsGlobalFetching(isFetching));
        return () => { dispatch(setIsGlobalFetching(false)); };
    }, [isFetching, skip, dispatch]);

    useEffect(() => {
        if (actionTriggers.reload > reloadCount.current) {
            refetch();
            reloadCount.current = actionTriggers.reload;
        }
    }, [actionTriggers.reload, refetch]);

    const bankDeposits = useMemo(() => data?.data?.content ?? [], [data]);

    const entities = useMemo(() => [
        { id: 'all', name: 'All Entities (Consolidated)' },
        { id: 'e1', name: 'Apex Primary Care' },
        { id: 'e2', name: 'Apex Surgical Center' },
        { id: 'e3', name: 'Apex Home Health' },
    ], []);

    const toggleRow = useCallback((id: string) => {
        setExpandedRows((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(id)) newSet.delete(id);
            else newSet.add(id);
            return newSet;
        });
    }, []);

    const filteredDeposits = useMemo(() => {
        return bankDeposits
            .filter(entity => selectedEntityId === 'all' || entity.id === selectedEntityId)
            .map(entity => ({
                ...entity,
                items: exceptionsOnly ? entity.items.filter(item => item.status === 'Exception') : entity.items
            }))
            .filter(entity => entity.items.length > 0);
    }, [bankDeposits, selectedEntityId, exceptionsOnly]);

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
        bankDeposits,
        filteredDeposits,
        totalElements: data?.data?.totalElements ?? 0,
        queryParams,
        selectedEntityId,
        setSelectedEntityId,
        expandedRows,
        entities,
        exceptionsOnly,
        setExceptionsOnly,
        toggleRow,
        handleRangeChange,
        handleSortChange,
        onPageChange,
        onRowsPerPageChange,
        isError,
        refetch,
    };
};
