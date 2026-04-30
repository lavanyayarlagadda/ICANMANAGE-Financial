import { useState, useCallback, useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { setIsGlobalFetching, setActiveExportType } from '@/store/slices/uiSlice';
import { setGlobalFilters } from '@/store/slices/financialsSlice';
import { useSearchSuspenseAccountsQuery, useLazyExportSuspenseAccountsQuery } from '@/store/api/financialsApi';
import { calculateDatesFromLabel } from '@/utils/dateUtils';
import { downloadFileFromBlob } from '@/utils/downloadHelper';
import { formatDateForFilename } from '@/utils/formatters';
import { SORT_ORDER, DEFAULT_PAGE_SIZE, EXPORT_FORMATS } from '@/constants/common';

export const useSuspenseAccountsScreen = ({ skip = false }: { skip?: boolean } = {}) => {
    const dispatch = useAppDispatch();
    const { globalFilters } = useAppSelector(s => s.financials);
    const { actionTriggers } = useAppSelector(s => s.ui);
    const exportCount = useRef(actionTriggers.export);
    const printCount = useRef(actionTriggers.print);
    const [viewType, setViewType] = useState<'account' | 'payer' | 'month'>('account');
    const [manageDialogOpen, setManageDialogOpen] = useState(false);

    const [queryParams, setQueryParams] = useState({
        page: 0,
        size: DEFAULT_PAGE_SIZE,
        sortField: '',
        sortOrder: SORT_ORDER.DESC as 'asc' | 'desc',
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
        desc: queryParams.sortOrder === SORT_ORDER.DESC,
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

    const [triggerExport] = useLazyExportSuspenseAccountsQuery();

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
                    `Suspense_Accounts_Report_${formatDateForFilename(queryParams.fromDate)}_to_${formatDateForFilename(queryParams.toDate)}.${formatType}`
                );
            }
        } catch (err) {
            console.error('Suspense Accounts Export failed:', err);
        } finally {
            dispatch(setActiveExportType(null));
        }
    }, [dispatch, queryParams.fromDate, queryParams.toDate, triggerExport]);

    useEffect(() => {
        if (actionTriggers.export > exportCount.current) {
            handleExport(EXPORT_FORMATS.XLSX);
            exportCount.current = actionTriggers.export;
        }
    }, [actionTriggers.export, handleExport]);

    useEffect(() => {
        if (actionTriggers.print > printCount.current) {
            handleExport(EXPORT_FORMATS.PDF);
            printCount.current = actionTriggers.print;
        }
    }, [actionTriggers.print, handleExport]);

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
        isFetching,
        isError,
        refetch,
    };
};
