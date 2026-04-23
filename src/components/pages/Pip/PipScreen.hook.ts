import { useState, useEffect, useCallback, useRef } from "react";
import { useAppSelector, useAppDispatch } from "@/store";
import { setActiveExportType, setIsGlobalFetching, setIsReloading } from "@/store/slices/uiSlice";
import { useSearchPipQuery, useLazyExportPipQuery, useGetPipSummaryQuery } from "@/store/api/financialsApi";
import { TableQueryParams } from "@/interfaces/api";
import { format, subMonths } from 'date-fns';
import { calculateDatesFromLabel } from '@/utils/dateUtils';
import { downloadFileFromBlob } from "@/utils/downloadHelper";
import { setGlobalFilters } from "@/store/slices/financialsSlice";
import { useUserPermissions } from "@/hooks/useUserPermissions";

export const usePipScreen = ({ skip = false }: { skip?: boolean } = {}) => {
    const dispatch = useAppDispatch();
    const { actionTriggers } = useAppSelector(s => s.ui);
    const { globalFilters } = useAppSelector(s => s.financials);
    // const { canViewPip } = useUserPermissions();

    const exportCount = useRef(actionTriggers.export);
    const printCount = useRef(actionTriggers.print);
    const reloadCount = useRef(actionTriggers.reload);

    const [queryParams, setQueryParams] = useState<TableQueryParams>({
        page: 0,
        size: 10,
        sortField: '',
        sortOrder: 'desc' as 'asc' | 'desc',
        fromDate: globalFilters.fromDate,
        toDate: globalFilters.toDate,
        status: null,
        payer: null,
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

    // Keep local queryParams in sync with global filters
    useEffect(() => {
        setQueryParams(prev => ({
            ...prev,
            fromDate: globalFilters.fromDate,
            toDate: globalFilters.toDate,
            page: 0
        }));
    }, [globalFilters.fromDate, globalFilters.toDate]);

    const { selectedTenantId } = useAppSelector(s => s.tenant);
    const isActualSkip = skip || !selectedTenantId;

    const { data, isError, isFetching, refetch } = useSearchPipQuery({
        page: queryParams.page + 1,
        size: queryParams.size,
        sort: queryParams.sortField,
        desc: queryParams.sortOrder === 'desc',
        fromDate: queryParams.fromDate,
        toDate: queryParams.toDate,
        status: queryParams.status,
        payer: queryParams.payer,
        category: queryParams.category,
        transactionNo: queryParams.transactionNo,
    }, { skip: isActualSkip });

    const { data: pipSummaryData, isFetching: isFetchingSummary } = useGetPipSummaryQuery({
        fromDate: queryParams.fromDate,
        toDate: queryParams.toDate,
    } as any, { skip: isActualSkip });

    const isAnyFetching = isFetching || isFetchingSummary;

    const [triggerExport] = useLazyExportPipQuery();

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
                    `PIP_Report_${queryParams.fromDate}_to_${queryParams.toDate}.${formatType}`
                );
            }
        } catch (err) {
            console.error('Export failed:', err);
        } finally {
            dispatch(setActiveExportType(null));
        }
    }, [dispatch, queryParams.fromDate, queryParams.toDate, triggerExport]);

    useEffect(() => {
        if (isActualSkip) {
            dispatch(setIsGlobalFetching(false));
            return;
        }

        dispatch(setIsGlobalFetching(isAnyFetching));

        return () => {
            dispatch(setIsGlobalFetching(false));
        };
    }, [isAnyFetching, isActualSkip, dispatch]);

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
            const doReload = async () => {
                try {
                    dispatch(setIsReloading(true));
                    await refetch();
                } finally {
                    dispatch(setIsReloading(false));
                }
            };
            doReload();
            reloadCount.current = actionTriggers.reload;
        }
    }, [actionTriggers.reload, refetch, dispatch]);

    const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

    const toggleRow = useCallback((id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setExpandedRows((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(id)) newSet.delete(id);
            else newSet.add(id);
            return newSet;
        });
    }, []);

    const handleRangeChange = useCallback((range: string) => {
        if (range.includes(' to ')) {
            const [from, to] = range.split(' to ');
            setQueryParams(prev => {
                if (prev.fromDate === from && prev.toDate === to) return prev;
                return { ...prev, fromDate: from, toDate: to, page: 0 };
            });
            dispatch(setGlobalFilters({ fromDate: from, toDate: to, rangeLabel: 'Custom' }));
        } else {
            const dates = calculateDatesFromLabel(range);
            if (dates) {
                setQueryParams(prev => {
                    if (prev.fromDate === dates.from && prev.toDate === dates.to) return prev;
                    return { ...prev, fromDate: dates.from, toDate: dates.to, page: 0 };
                });
                dispatch(setGlobalFilters({ fromDate: dates.from, toDate: dates.to, rangeLabel: range }));
            }
        }
    }, [dispatch]);

    const handleSortChange = useCallback((colId: string, direction: 'asc' | 'desc') => {
        setQueryParams(prev => ({ ...prev, sortField: colId, sortOrder: direction, page: 0 }));
    }, []);

    const handleFilterChange = useCallback((filters: Record<string, string>) => {
        setQueryParams(prev => {
            const next = {
                ...prev,
                status: filters.status || null,
                payer: filters.payer || null,
                category: filters.category || null,
                page: 0
            };
            const isChanged = prev.status !== next.status || prev.payer !== next.payer || prev.category !== next.category;
            return isChanged ? next : prev;
        });
    }, []);

    const handlePageChange = useCallback((p: number) => setQueryParams(prev => ({ ...prev, page: p })), []);
    const handleRowsPerPageChange = useCallback((s: number) => setQueryParams(prev => ({ ...prev, size: s, page: 0 })), []);

    return {
        // canViewPip,
        pipRecords: data?.data?.content ?? [],
        totalElements: data?.data?.totalElements ?? 0,
        pipSummary: pipSummaryData?.data,
        queryParams,
        expandedRows,
        toggleRow,
        handleRangeChange,
        handleFilterChange,
        handleSortChange,
        handlePageChange,
        handleRowsPerPageChange,
        searchTerm,
        setSearchTerm,
        onSearch: handleSearch,
        handleExport,
        isError,
    };
};
