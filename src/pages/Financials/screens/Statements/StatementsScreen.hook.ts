import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { useAppSelector, useAppDispatch, RootState } from '@/store';
import { setIsGlobalFetching, setActiveExportType } from '@/store/slices/uiSlice';
import { useSearchForwardBalanceNoticesQuery, useLazyExportForwardBalanceNoticesQuery, useGetForwardBalanceSummaryQuery, useLazyGetForwardBalanceDetailsQuery } from '@/store/api/financialsApi';
import { downloadFileFromBlob } from '@/utils/downloadHelper';
import { formatDateForFilename } from '@/utils/formatters';
import { ForwardBalanceDetailsResponse, TableQueryParams } from '@/interfaces/api';
import { calculateDatesFromLabel } from '@/utils/dateUtils';
import { setGlobalFilters } from '@/store/slices/financialsSlice';
import { useGetAllTransactionsFiltersQuery } from '@/store/api/financialsApi';
import { OffsetEvent } from '@/interfaces/financials';
import { SORT_ORDER, DEFAULT_PAGE_SIZE, EXPORT_FORMATS } from '@/constants/common';

export const useStatementsScreen = ({ skip = false }: { skip?: boolean } = {}) => {
    const dispatch = useAppDispatch();
    const { activeSubTab, actionTriggers } = useAppSelector((s: RootState) => s.ui);
    const { globalFilters } = useAppSelector((s: RootState) => s.financials);
    const exportCount = useRef(actionTriggers.export);
    const printCount = useRef(actionTriggers.print);

    // const isMindPath = useMemo(
    //     () => user?.company?.toLowerCase() === 'mindpath' || selectedTenantId?.toLowerCase() === 'mindpath',
    //     [user, selectedTenantId]
    // );

    const finalActiveSubTab = (activeSubTab === 0) ? 1 : activeSubTab;

    const [queryParams, setQueryParams] = useState<TableQueryParams>({
        page: 0,
        size: DEFAULT_PAGE_SIZE,
        sortField: 'notificationDate',
        sortOrder: SORT_ORDER.DESC as 'asc' | 'desc',
        fromDate: globalFilters.fromDate,
        toDate: globalFilters.toDate,
        status: null as string | null,
        payerName: null as string | null,
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

    // Sync local queryParams with global filters
    useEffect(() => {
        setQueryParams(prev => ({
            ...prev,
            fromDate: globalFilters.fromDate,
            toDate: globalFilters.toDate,
            page: 0
        }));
    }, [globalFilters.fromDate, globalFilters.toDate]);

    const isNoticesTab = finalActiveSubTab === 1;

    const { data: noticeData, isFetching: isFetchingNotices, isError: isErrorNotices, refetch: refetchNotices } = useSearchForwardBalanceNoticesQuery({
        page: queryParams.page + 1,
        size: queryParams.size,
        sort: queryParams.sortField,
        desc: queryParams.sortOrder === SORT_ORDER.DESC,
        fromDate: queryParams.fromDate,
        toDate: queryParams.toDate,
        status: queryParams.status,
        payerName: queryParams.payerName,
        transactionNo: queryParams.transactionNo
    }, { skip: skip || !isNoticesTab });

    const { data: filterData } = useGetAllTransactionsFiltersQuery(undefined, { skip: !isNoticesTab });
    const statusOptions = useMemo(() => filterData?.data?.transactionStatusTypes || [], [filterData]);
    const payerOptions = useMemo(() => filterData?.data?.payerNames?.map(p => ({ label: p, value: p })) || [], [filterData]);

    useEffect(() => {
        if (!isNoticesTab || skip) {
            dispatch(setIsGlobalFetching(false));
            return;
        }
        dispatch(setIsGlobalFetching(isFetchingNotices));
        return () => { dispatch(setIsGlobalFetching(false)); };
    }, [isFetchingNotices, isNoticesTab, skip, dispatch]);

    const [triggerExport] = useLazyExportForwardBalanceNoticesQuery();

    const handleExport = useCallback(async (formatType: typeof EXPORT_FORMATS.PDF | typeof EXPORT_FORMATS.XLSX) => {
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
                    `Forward_Balance_Notices_${formatDateForFilename(queryParams.fromDate)}_to_${formatDateForFilename(queryParams.toDate)}.${formatType}`
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
            handleExport(EXPORT_FORMATS.XLSX);
            exportCount.current = actionTriggers.export;
        }
    }, [actionTriggers.export, handleExport, isNoticesTab]);

    useEffect(() => {
        if (!isNoticesTab) return;
        if (actionTriggers.print > printCount.current) {
            handleExport(EXPORT_FORMATS.PDF);
            printCount.current = actionTriggers.print;
        }
    }, [actionTriggers.print, handleExport, isNoticesTab]);

    const forwardBalanceNotices = useMemo(() => noticeData?.data?.content ?? [], [noticeData]);

    const { data: summaryData } = useGetForwardBalanceSummaryQuery({
        fromDate: queryParams.fromDate,
        toDate: queryParams.toDate
    }, { skip: skip || !isNoticesTab });

    const stats = useMemo(() => {
        const s = summaryData?.data || summaryData;
        if (s && ('totalOriginalAmount' in s || 'totalRemainingBalance' in s)) {
            return {
                totalOriginalAmount: s.totalOriginalAmount ?? null,
                totalRemainingBalance: s.totalRemainingBalance ?? null,
                actionRequired: s.actionRequired ?? '-'
            };
        }
        const totalOriginalAmount = forwardBalanceNotices.reduce((sum, r) => sum + (r.originalAmount ?? 0), 0);
        const totalRemainingBalance = forwardBalanceNotices.reduce((sum, r) => sum + (r.remainingBalance ?? 0), 0);
        return { totalOriginalAmount, totalRemainingBalance, actionRequired: 0 };
    }, [forwardBalanceNotices, summaryData]);

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
                payerName: filters.provider || null,
                page: 0
            };
            const isChanged = prev.status !== next.status || prev.payerName !== next.payerName;
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
        isFetching: isFetchingNotices,
        isError: isErrorNotices,
        refetchNotices
    };
};

export const useForwardBalanceNoticesTable = () => {
    const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
    const [noticeDetails, setNoticeDetails] = useState<Record<string, ForwardBalanceDetailsResponse['data']>>({});
    const [loadingDetails, setLoadingDetails] = useState<Set<string>>(new Set());
    const [triggerGetDetails] = useLazyGetForwardBalanceDetailsQuery();

    const toggleRow = useCallback(async (id: string, noticeId: string, initialOffsets?: OffsetEvent[]) => {
        setExpandedRows((prev) => {
            const newSet = new Set(prev);
            const isExpanding = !newSet.has(id);
            if (isExpanding) {
                newSet.add(id);
                // Trigger detail fetch if not already loaded, not loading, and no initial data
                const hasInitialData = initialOffsets && initialOffsets.length > 0;
                if (!noticeDetails[id] && !loadingDetails.has(id) && !hasInitialData) {
                    setLoadingDetails(prev => new Set(prev).add(id));
                    triggerGetDetails(noticeId).unwrap().then((res: ForwardBalanceDetailsResponse) => {
                        if (res?.data) {
                            setNoticeDetails(prevDetails => ({
                                ...prevDetails,
                                [id]: res.data
                            }));
                        }
                    }).catch((err: unknown) => {
                        console.error('Failed to fetch details:', err);
                    }).finally(() => {
                        setLoadingDetails(prev => {
                            const next = new Set(prev);
                            next.delete(id);
                            return next;
                        });
                    });
                }
            } else {
                newSet.delete(id);
            }
            return newSet;
        });
    }, [noticeDetails, loadingDetails, triggerGetDetails]);

    return {
        expandedRows,
        toggleRow,
        noticeDetails,
        loadingDetails
    };
};
