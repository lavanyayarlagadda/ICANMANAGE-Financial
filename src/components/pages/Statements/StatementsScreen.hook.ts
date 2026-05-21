import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { useAppSelector, useAppDispatch, RootState } from '@/store';
import { setIsGlobalFetching, setActiveExportType } from '@/store/slices/uiSlice';
import { useSearchForwardBalanceNoticesQuery, useLazyExportForwardBalanceNoticesQuery } from '@/store/api/financialsApi';
import { downloadFileFromBlob } from '@/utils/downloadHelper';
import { TableQueryParams } from '@/interfaces/api';
import { format } from 'date-fns';
import { calculateDatesFromLabel } from '@/utils/dateUtils';
import { setGlobalFilters } from '@/store/slices/financialsSlice';
import { useGetAllTransactionsFiltersQuery } from '@/store/api/financialsApi';

export const useStatementsScreen = ({ skip = false }: { skip?: boolean } = {}) => {
    const dispatch = useAppDispatch();
    const { activeSubTab, actionTriggers } = useAppSelector((s: RootState) => s.ui);
    const { globalFilters } = useAppSelector((s: RootState) => s.financials);
    const user = useAppSelector((s: RootState) => s.auth.user);
    const { selectedTenantId } = useAppSelector((s: RootState) => s.tenant);
    const exportCount = useRef(actionTriggers.export);
    const printCount = useRef(actionTriggers.print);

    // const isMindPath = useMemo(
    //     () => user?.company?.toLowerCase() === 'mindpath' || selectedTenantId?.toLowerCase() === 'mindpath',
    //     [user, selectedTenantId]
    // );

    const finalActiveSubTab = (activeSubTab === 0) ? 1 : activeSubTab;

    const [queryParams, setQueryParams] = useState<TableQueryParams>({
        page: 0,
        size: 10,
        sortField: 'notificationDate',
        sortOrder: 'desc' as 'asc' | 'desc',
        fromDate: globalFilters.fromDate,
        toDate: globalFilters.toDate,
        status: null as string | null,
        payer: null as string | null,
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

    const isNoticesTab = finalActiveSubTab === 1;

    const { data: noticeData, isFetching: isFetchingNotices, isError: isErrorNotices, refetch: refetchNotices } = useSearchForwardBalanceNoticesQuery({
        page: queryParams.page + 1,
        size: queryParams.size,
        sort: queryParams.sortField,
        desc: queryParams.sortOrder === 'desc',
        fromDate: queryParams.fromDate,
        toDate: queryParams.toDate,
        status: queryParams.status,
        payer: queryParams.payer,
        transactionNo: queryParams.transactionNo
    }, { skip: skip || !isNoticesTab });

    const { data: filterData } = useGetAllTransactionsFiltersQuery(undefined, { skip: !isNoticesTab });
    const statusOptions = useMemo(() => filterData?.data?.transactionStatusTypes || [], [filterData]);
    const payerOptions = useMemo(() => filterData?.data?.payers?.map(p => ({ label: p.payerName, value: String(p.payerId) })) || [], [filterData]);

    useEffect(() => {
        if (!isNoticesTab || skip) {
            dispatch(setIsGlobalFetching(false));
            return;
        }
        dispatch(setIsGlobalFetching(isFetchingNotices));
        return () => { dispatch(setIsGlobalFetching(false)); };
    }, [isFetchingNotices, isNoticesTab, skip, dispatch]);

    const [triggerExport] = useLazyExportForwardBalanceNoticesQuery();

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
                    `Forward_Balance_Notices_${queryParams.fromDate}_to_${queryParams.toDate}.${formatType}`
                );
            }
        } catch (err) {
            console.error('Forward Balance Notices Export failed:', err);
        } finally {
            dispatch(setActiveExportType(null));
        }
    }, [dispatch, queryParams.fromDate, queryParams.toDate, triggerExport]);

    useEffect(() => {
        if (!isNoticesTab) return;
        if (actionTriggers.export > exportCount.current) {
            handleExport('xlsx');
            exportCount.current = actionTriggers.export;
        }
    }, [actionTriggers.export, handleExport, isNoticesTab]);

    useEffect(() => {
        if (!isNoticesTab) return;
        if (actionTriggers.print > printCount.current) {
            handleExport('pdf');
            printCount.current = actionTriggers.print;
        }
    }, [actionTriggers.print, handleExport, isNoticesTab]);

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
            // Update global filters for persistence - label is 'Custom' if it's a date string
            dispatch(setGlobalFilters({ fromDate: from, toDate: to, rangeLabel: 'Custom' }));
        } else {
            // It's a preset label
            const dates = calculateDatesFromLabel(range);
            if (dates) {
                setQueryParams(prev => ({ ...prev, fromDate: dates.from, toDate: dates.to, page: 0 }));
                // Update global filters for persistence - preserve the label
                dispatch(setGlobalFilters({ fromDate: dates.from, toDate: dates.to, rangeLabel: range }));
            }
        }
    }, [dispatch]);

    const handleSortChange = useCallback((colId: string, direction: 'asc' | 'desc') => {
        setQueryParams(prev => ({ ...prev, sortField: colId, sortOrder: direction, page: 0 }));
    }, []);

    const onPageChange = useCallback((p: number) => setQueryParams(prev => ({ ...prev, page: p })), []);
    const onRowsPerPageChange = useCallback((s: number) => setQueryParams(prev => ({ ...prev, size: s, page: 0 })), []);

    const handleFilterChange = useCallback((filters: Record<string, string>) => {
        setQueryParams(prev => {
            const next = {
                ...prev,
                status: filters.status || null,
                payer: filters.payerName || null,
                page: 0
            };
            const isChanged = prev.status !== next.status || prev.payer !== next.payer;
            return isChanged ? next : prev;
        });
    }, []);

    return {
        activeSubTab,
        finalActiveSubTab,
        forwardBalanceNotices,
        totalElements: noticeData?.data?.totalElements ?? 0,
        queryParams,
        globalFilters,
        handleRangeChange,
        handleSortChange,
        onPageChange,
        onRowsPerPageChange,
        searchTerm,
        setSearchTerm,
        onSearch: handleSearch,
        handleFilterChange,
        statusOptions,
        payerOptions,
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
