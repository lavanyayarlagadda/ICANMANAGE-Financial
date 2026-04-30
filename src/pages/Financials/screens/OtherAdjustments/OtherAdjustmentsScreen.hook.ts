import { useMemo, useCallback, useRef, useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '@/store';
import {

    openEditDialog,
    openConfirmDelete,
    setActiveExportType,
    setIsGlobalFetching,
    setIsDrillingDown as setGlobalDrillingDown
} from '@/store/slices/uiSlice';
import {
    setShowRemittanceDetail,
    setSelectedPaymentId,
    setRemittanceDetail,
    setRemittanceClaims,
    setSelectedClaimIndex,
    setGlobalFilters
} from '@/store/slices/financialsSlice';
import { OtherAdjustmentRecord, RemittanceDetail } from '@/interfaces/financials';
import { TableQueryParams } from '@/interfaces/api';

import { calculateDatesFromLabel } from '@/utils/dateUtils';
import { downloadFileFromBlob } from '@/utils/downloadHelper';
import { formatDateForFilename } from '@/utils/formatters';
import { isRemittanceDetail, normalizeRemittanceClaims } from '@/utils/normalizeRemittanceClaims';
import { SORT_ORDER, DEFAULT_PAGE_SIZE, EXPORT_FORMATS } from '@/constants/common';
import { useLazyExportOtherAdjustmentsQuery, useLazyGetRemittanceClaimsQuery, useLazySearchServiceLinesQuery, useSearchOtherAdjustmentsQuery, useGetRecoupmentFiltersQuery } from '@/store/api/financialsApi';

export const useOtherAdjustmentsScreen = ({ skip = false }: { skip?: boolean } = {}) => {
    const dispatch = useAppDispatch();
    const { actionTriggers } = useAppSelector(s => s.ui);
    const { globalFilters } = useAppSelector(s => s.financials);

    const [queryParams, setQueryParams] = useState<TableQueryParams>({
        page: 0,
        size: DEFAULT_PAGE_SIZE,
        sortField: 'effectiveDate',
        sortOrder: SORT_ORDER.DESC as 'asc' | 'desc',
        fromDate: globalFilters.fromDate,
        toDate: globalFilters.toDate,
        status: null,
        payerName: null,
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

    const { selectedTenantId } = useAppSelector(s => s.tenant);
    const isActualSkip = skip || !selectedTenantId;

    const { data, isFetching, isError, refetch } = useSearchOtherAdjustmentsQuery({
        page: queryParams.page + 1,
        size: queryParams.size,
        sort: queryParams.sortField,
        desc: queryParams.sortOrder === SORT_ORDER.DESC,
        fromDate: queryParams.fromDate,
        toDate: queryParams.toDate,
        status: queryParams.status,
        payerName: queryParams.payerName,
        transactionNo: queryParams.transactionNo
    }, { skip: isActualSkip });
    const [drillDownParams] = useState({
        page: 0,
        size: DEFAULT_PAGE_SIZE,
        sortField: 'paymentDate',
        sortOrder: SORT_ORDER.DESC,
    });
    const adjustments = useMemo(() => data?.data?.content ?? [], [data]);

    const { data: filtersData } = useGetRecoupmentFiltersQuery(undefined, { skip: isActualSkip });
    const payerOptions = useMemo(() => filtersData?.data?.map(p => ({
        label: p.payer,
        value: p.payer
    })) ?? [], [filtersData]);
    // const typeOptions = useMemo(() => filtersData?.data?.transactionTypes?.map(t => t.transactionType) ?? [], [filtersData]);

    const [triggerExportOtherAdjustments] = useLazyExportOtherAdjustmentsQuery();
    const [triggerGetRemittance] = useLazyGetRemittanceClaimsQuery();
    const [triggerSearchServiceLines] = useLazySearchServiceLinesQuery();

    const exportCount = useRef(actionTriggers.export);
    const printCount = useRef(actionTriggers.print);
    const reloadCount = useRef(actionTriggers.reload);

    useEffect(() => {
        if (skip) {
            dispatch(setIsGlobalFetching(false));
            return;
        }
        dispatch(setIsGlobalFetching(isFetching));
        return () => { dispatch(setIsGlobalFetching(false)); };
    }, [isFetching, skip, dispatch]);

    const handleExport = useCallback(async (exportFormat: typeof EXPORT_FORMATS.PDF | typeof EXPORT_FORMATS.XLSX) => {
        dispatch(setActiveExportType(exportFormat));
        try {
            const blob = await triggerExportOtherAdjustments({
                fromDate: queryParams.fromDate,
                toDate: queryParams.toDate,
                format: exportFormat
            }).unwrap();

            const filename = `adjustments_${formatDateForFilename(queryParams.fromDate)}_to_${formatDateForFilename(queryParams.toDate)}.${exportFormat}`;
            downloadFileFromBlob(blob, filename);
        } catch (error) {
            console.error('Export failed:', error);
        } finally {
            setTimeout(() => {
                dispatch(setActiveExportType(null));
            }, 1200);
        }
    }, [dispatch, queryParams.fromDate, queryParams.toDate, triggerExportOtherAdjustments]);

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
            refetch();
            reloadCount.current = actionTriggers.reload;
        }
    }, [actionTriggers.reload, refetch]);

    const handleDrillDown = useCallback(async (row: OtherAdjustmentRecord) => {
        try {
            dispatch(setGlobalDrillingDown(true));
            const identifier = row.adjustmentId || row.referenceId || row.id || '';
            if (identifier) {
                dispatch(setSelectedPaymentId(identifier));

                // Call both APIs simultaneously
                const [claimResult] = await Promise.all([
                    triggerGetRemittance({
                        claimId: identifier,
                        page: drillDownParams.page + 1,
                        size: drillDownParams.size,
                        sort: drillDownParams.sortField,
                        desc: drillDownParams.sortOrder === SORT_ORDER.DESC
                    }).unwrap(),
                    triggerSearchServiceLines({
                        page: drillDownParams.page + 1,
                        size: drillDownParams.size,
                        sort: drillDownParams.sortField,
                        desc: drillDownParams.sortOrder === SORT_ORDER.DESC,
                        check: identifier
                    }).unwrap()
                ]);

                const claimsArr = normalizeRemittanceClaims(claimResult);

                if (claimsArr.length === 0) {
                    dispatch(setRemittanceClaims([]));
                    dispatch(setRemittanceDetail(null));
                    dispatch(setShowRemittanceDetail(true));
                    return;
                }

                dispatch(setRemittanceClaims(claimsArr));
                dispatch(setSelectedClaimIndex(0));
                const selectedClaim: RemittanceDetail | null = claimsArr.find(isRemittanceDetail) ?? null;
                dispatch(setRemittanceDetail(selectedClaim));
                dispatch(setShowRemittanceDetail(true));
            }
        } catch (err) {
            console.error('Failed to fetch remittance drill-down data:', err);
        } finally {
            dispatch(setGlobalDrillingDown(false));
        }
    }, [dispatch, triggerGetRemittance, triggerSearchServiceLines, drillDownParams]);

    const handleEdit = useCallback((r: OtherAdjustmentRecord) => dispatch(openEditDialog(r)), [dispatch]);
    const handleDelete = useCallback((id: string) => dispatch(openConfirmDelete({ id, type: 'adjustment' })), [dispatch]);

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

    const handleFilterChange = useCallback((filters: Record<string, string>) => {
        setQueryParams(prev => {
            const next = {
                ...prev,
                status: filters.status || null,
                payerName: filters.payer || null,
                page: 0
            };
            const isChanged = prev.status !== next.status || prev.payerName !== next.payerName;
            return isChanged ? next : prev;
        });
    }, []);

    const onPageChange = useCallback((p: number) => setQueryParams(prev => ({ ...prev, page: p })), []);
    const onRowsPerPageChange = useCallback((s: number) => setQueryParams(prev => ({ ...prev, size: s, page: 0 })), []);

    return {
        adjustments,
        totalElements: data?.data?.totalElements ?? 0,
        queryParams,
        payerOptions,
        // typeOptions,
        handleDrillDown,
        handleEdit,
        handleDelete,
        handleRangeChange,
        handleFilterChange,
        handleSortChange,
        onPageChange,
        onRowsPerPageChange,
        searchTerm,
        setSearchTerm,
        onSearch: handleSearch,
        isError,
        isFetching,
        dispatch,
        globalFilters
    };
};
