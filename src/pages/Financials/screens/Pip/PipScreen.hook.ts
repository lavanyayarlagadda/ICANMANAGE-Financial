import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useAppSelector, useAppDispatch } from "@/store";
import { useLocation } from "react-router-dom";
import { setActiveExportType, setIsGlobalFetching, setIsReloading } from "@/store/slices/uiSlice";
import { useSearchPipQuery, useLazyExportPipQuery, useGetPipSummaryQuery } from "@/store/api/financialsApi";
import { useLazyGetPipDetailsQuery } from "@/store/api/analyticsApi";
import { PipRecord, NpiAllocation } from "@/interfaces/financials";
import { useGetAllTransactionsFiltersQuery } from "@/store/api/transactionsApi";
import { PipSearchRequest, TableQueryParams } from "@/interfaces/api";
import { SORT_ORDER, DEFAULT_PAGE_SIZE, EXPORT_FORMATS } from "@/constants/common";
import { calculateDatesFromLabel } from '@/utils/dateUtils';
import { downloadFileFromBlob } from "@/utils/downloadHelper";
import { setGlobalFilters } from "@/store/slices/financialsSlice";
import { formatDateForFilename } from "@/utils/formatters";

export type PipSearchFilters = Pick<
    PipSearchRequest,
    'ptanNo' | 'checkEftNo' | 'npiPayerName' | 'claimId' | 'patientName'
>;

const EMPTY_PIP_SEARCH_FILTERS: PipSearchFilters = {
    ptanNo: '',
    checkEftNo: '',
    npiPayerName: '',
    claimId: '',
    patientName: '',
};

/** Only non-empty optional filters are sent; all five search fields are optional. */
function optionalPipSearchFields(filters: PipSearchFilters): Partial<PipSearchFilters> {
    const out: Partial<PipSearchFilters> = {};
    (Object.keys(EMPTY_PIP_SEARCH_FILTERS) as (keyof PipSearchFilters)[]).forEach((key) => {
        const value = filters[key]?.trim();
        if (value) {
            out[key] = value;
        }
    });
    return out;
}

export const usePipScreen = ({ skip = false }: { skip?: boolean } = {}) => {
    const dispatch = useAppDispatch();
    const location = useLocation();
    const { actionTriggers } = useAppSelector(s => s.ui);
    const { globalFilters } = useAppSelector(s => s.financials);
    const selectedTenantId = useAppSelector(s => s.tenant.selectedTenantId);

    const exportCount = useRef(actionTriggers.export);
    const printCount = useRef(actionTriggers.print);
    const reloadCount = useRef(actionTriggers.reload);

    const [queryParams, setQueryParams] = useState<TableQueryParams>({
        page: 0,
        size: DEFAULT_PAGE_SIZE,
        sortField: '',
        sortOrder: SORT_ORDER.DESC as 'asc' | 'desc',
        fromDate: globalFilters.fromDate,
        toDate: globalFilters.toDate,
        status: null,
        payer: null,
        transactionNo: '',
    });

    const [searchFilters, setSearchFilters] = useState<PipSearchFilters>(EMPTY_PIP_SEARCH_FILTERS);
    const [appliedSearchFilters, setAppliedSearchFilters] = useState<PipSearchFilters>(EMPTY_PIP_SEARCH_FILTERS);

    const handleSearchFilterChange = useCallback((field: keyof PipSearchFilters, value: string) => {
        setSearchFilters((prev) => ({ ...prev, [field]: value }));
    }, []);

    const handleApplySearch = useCallback(() => {
        setAppliedSearchFilters({ ...searchFilters });
        setQueryParams((prev) => ({ ...prev, page: 0 }));
    }, [searchFilters]);

    const handleClearSearch = useCallback(() => {
        setSearchFilters(EMPTY_PIP_SEARCH_FILTERS);
        setAppliedSearchFilters(EMPTY_PIP_SEARCH_FILTERS);
        setQueryParams((prev) => ({ ...prev, page: 0 }));
    }, []);

    useEffect(() => {
        setQueryParams(prev => ({
            ...prev,
            fromDate: globalFilters.fromDate,
            toDate: globalFilters.toDate,
            page: 0
        }));
    }, [globalFilters.fromDate, globalFilters.toDate]);

    // Reset search term and filters when tenant or tab/route changes
    useEffect(() => {
        setSearchFilters(EMPTY_PIP_SEARCH_FILTERS);
        setAppliedSearchFilters(EMPTY_PIP_SEARCH_FILTERS);
        setQueryParams(prev => ({
            ...prev,
            status: null,
            payer: null,
            transactionNo: '',
            page: 0
        }));
    }, [selectedTenantId, location.pathname]);

    const isActualSkip = skip;

    const { data, isError, isFetching, refetch } = useSearchPipQuery({
        page: queryParams.page + 1,
        size: queryParams.size,
        sort: queryParams.sortField,
        desc: queryParams.sortOrder === SORT_ORDER.DESC,
        fromDate: queryParams.fromDate,
        toDate: queryParams.toDate,
        status: queryParams.status,
        ...optionalPipSearchFields(appliedSearchFilters),
        includeDetails: false,
    }, { skip: isActualSkip });

    const [fetchPipDetails] = useLazyGetPipDetailsQuery();
    const [detailsByPtan, setDetailsByPtan] = useState<Record<string, NpiAllocation[]>>({});
    const [loadingDetailsPtans, setLoadingDetailsPtans] = useState<Set<string>>(new Set());
    const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

    useEffect(() => {
        setDetailsByPtan({});
        setExpandedRows(new Set());
    }, [
        queryParams.fromDate,
        queryParams.toDate,
        appliedSearchFilters,
        queryParams.status,
        queryParams.page,
        queryParams.size,
        queryParams.sortField,
        queryParams.sortOrder,
    ]);

    const { data: pipSummaryData, isFetching: isFetchingSummary, isError: isSummaryError } = useGetPipSummaryQuery({
        fromDate: queryParams.fromDate,
        toDate: queryParams.toDate,
    }, { skip: isActualSkip });

    const { data: dropdownData, isFetching: dropdownFetching, isError: dropdownError } = useGetAllTransactionsFiltersQuery(undefined, { skip: isActualSkip });
    const statusOptions = useMemo(() => {
        if (dropdownData?.data?.transactionStatusTypes) {
            return dropdownData.data.transactionStatusTypes.map((status) => ({
                label: status,
                value: status
            }));
        }
        return [];
    }, [dropdownData]);

    const isAnyError = isError || isSummaryError || dropdownError;
    const isAnyFetching = isFetching || isFetchingSummary || dropdownFetching;

    const [triggerExport] = useLazyExportPipQuery();

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
                    `PIP_Report_${formatDateForFilename(queryParams.fromDate)}_to_${formatDateForFilename(queryParams.toDate)}.${formatType}`
                );
            }
        } catch (err) {
            console.error('Export failed:', err);
        } finally {
            dispatch(setActiveExportType(null));
        }
    }, [dispatch, queryParams.fromDate, queryParams.toDate, triggerExport]);

    useEffect(() => {
        if (isActualSkip || isAnyError) {
            dispatch(setIsGlobalFetching(false));
            return;
        }

        dispatch(setIsGlobalFetching(isAnyFetching));

        return () => {
            dispatch(setIsGlobalFetching(false));
        };
    }, [isAnyFetching, isAnyError, isActualSkip, dispatch]);

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

    useEffect(() => {
        if (actionTriggers.reload > reloadCount.current) {
            const doReload = async () => {
                try {
                    dispatch(setIsReloading(true));
                    if (!isActualSkip) {
                        await refetch();
                    }
                } finally {
                    dispatch(setIsReloading(false));
                }
            };
            doReload();
            reloadCount.current = actionTriggers.reload;
        }
    }, [actionTriggers.reload, isActualSkip, refetch, dispatch]);

    const pipRecords = useMemo(() => {
        const content = data?.data?.content ?? [];
        return content.map((row) => ({
            ...row,
            npiDetails: detailsByPtan[row.ptan] ?? row.npiDetails ?? [],
        }));
    }, [data?.data?.content, detailsByPtan]);

    const toggleRow = useCallback(async (row: PipRecord, e: React.MouseEvent) => {
        e.stopPropagation();
        const id = row.id || row.ptan;
        const isExpanded = expandedRows.has(id);
        if (isExpanded) {
            setExpandedRows((prev) => {
                const next = new Set(prev);
                next.delete(id);
                return next;
            });
            return;
        }

        setExpandedRows((prev) => new Set(prev).add(id));

        const hasDetails = (detailsByPtan[row.ptan]?.length ?? 0) > 0 || (row.npiDetails?.length ?? 0) > 0;
        if (hasDetails || loadingDetailsPtans.has(row.ptan)) {
            return;
        }

        setLoadingDetailsPtans((prev) => new Set(prev).add(row.ptan));
        try {
            const result = await fetchPipDetails({
                ptan: row.ptan,
                fromDate: queryParams.fromDate,
                toDate: queryParams.toDate,
            }).unwrap();
            setDetailsByPtan((prev) => ({ ...prev, [row.ptan]: result.data ?? [] }));
        } catch (err) {
            console.error("Failed to load PIP details:", err);
            setExpandedRows((prev) => {
                const next = new Set(prev);
                next.delete(id);
                return next;
            });
        } finally {
            setLoadingDetailsPtans((prev) => {
                const next = new Set(prev);
                next.delete(row.ptan);
                return next;
            });
        }
    }, [
        expandedRows,
        detailsByPtan,
        loadingDetailsPtans,
        fetchPipDetails,
        queryParams.fromDate,
        queryParams.toDate,
    ]);

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
        pipRecords,
        loadingDetailsPtans,
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
        searchFilters,
        appliedSearchFilters,
        handleSearchFilterChange,
        handleApplySearch,
        handleClearSearch,
        handleExport,
        statusOptions,
        isError: isAnyError,
        isFetching: isAnyFetching,
        globalFilters,
    };
};
