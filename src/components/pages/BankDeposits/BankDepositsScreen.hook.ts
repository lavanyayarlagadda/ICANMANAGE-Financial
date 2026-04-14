import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { useAppSelector, useAppDispatch } from '@/store';
import { setIsGlobalFetching, setActiveExportType } from '@/store/slices/uiSlice';
import { useSearchBankDepositsBodyQuery, useLazyExportBankDepositsQuery } from '@/store/api/financialsApi';
import { downloadFileFromBlob } from '@/utils/downloadHelper';
import { subMonths, format } from 'date-fns';

export const useBankDepositsScreen = ({ skip = false }: { skip?: boolean } = {}) => {
    const dispatch = useAppDispatch();
    const { actionTriggers } = useAppSelector(s => s.ui);
    const exportCount = useRef(actionTriggers.export);
    const printCount = useRef(actionTriggers.print);
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

    const [triggerExport] = useLazyExportBankDepositsQuery();

    const handleExport = useCallback(async (formatType: 'pdf' | 'xlsx') => {
        try {
            dispatch(setActiveExportType(formatType));
            const result = await triggerExport({
                fromDate: queryParams.fromDate,
                toDate: queryParams.toDate,
                format: formatType
            }).unwrap();

            if (result !== undefined) {
                downloadFileFromBlob(
                    result,
                    `Bank_Deposits_Report_${queryParams.fromDate}_to_${queryParams.toDate}.${formatType}`
                );
            }
        } catch (err) {
            console.error('Bank Deposits Export failed:', err);
        } finally {
            dispatch(setActiveExportType(null));
        }
    }, [dispatch, queryParams.fromDate, queryParams.toDate, triggerExport]);

    useEffect(() => {
        if (actionTriggers.export > exportCount.current) {
            handleExport('xlsx');
            exportCount.current = actionTriggers.export;
        }
    }, [actionTriggers.export, handleExport]);

    useEffect(() => {
        if (actionTriggers.print > printCount.current) {
            handleExport('pdf');
            printCount.current = actionTriggers.print;
        }
    }, [actionTriggers.print, handleExport]);

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
