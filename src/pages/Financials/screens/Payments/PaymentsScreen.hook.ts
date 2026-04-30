import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { useAppSelector, useAppDispatch, RootState } from '@/store';
import {

    setActiveExportType,
    setIsReloading,
    setIsDrillingDown as setGlobalDrillingDown,
    setIsGlobalFetching
} from '@/store/slices/uiSlice';
import {
    setShowRemittanceDetail,
    setSelectedPaymentId,
    setRemittanceDetail,
    setRemittanceClaims,
    setSelectedClaimIndex,
    setGlobalFilters
} from '@/store/slices/financialsSlice';

import { calculateDatesFromLabel } from '@/utils/dateUtils';
import { formatDateForFilename } from '@/utils/formatters';
import {
    useSearchPaymentsQuery,
    useLazyExportPaymentsQuery,
    useLazySearchServiceLinesQuery,
    useLazyGetRemittanceClaimsQuery,
} from '@/store/api/financialsApi';
import { useGetAllTransactionsFiltersQuery } from '@/store/api/transactionsApi';
import { PaymentQueryParams } from '@/interfaces/api';
import { downloadFileFromBlob } from '@/utils/downloadHelper';
import { PaymentTransaction, RemittanceDetail } from '@/interfaces/financials';
import { isRemittanceDetail, normalizeRemittanceClaims } from '@/utils/normalizeRemittanceClaims';
import { SORT_ORDER, DEFAULT_PAGE_SIZE, EXPORT_FORMATS } from '@/constants/common';

export const usePaymentsScreen = ({ skip = false }: { skip?: boolean } = {}) => {
    const dispatch = useAppDispatch();
    const { actionTriggers } = useAppSelector((s: RootState) => s.ui);
    const { globalFilters } = useAppSelector((s: RootState) => s.financials);

    const [queryParams, setQueryParams] = useState<PaymentQueryParams>({
        page: 0,
        size: DEFAULT_PAGE_SIZE,
        sortField: '',
        sortOrder: SORT_ORDER.DESC as 'asc' | 'desc',
        status: null as string | null,
        payerIds: null as string | null,
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

    // Keep local queryParams in sync with global filters when they change from other sources
    useEffect(() => {
        setQueryParams(prev => ({
            ...prev,
            fromDate: globalFilters.fromDate,
            toDate: globalFilters.toDate,
            // If the dates changed from outside, we usually want to reset to page 0
            page: 0
        }));
    }, [globalFilters.fromDate, globalFilters.toDate]);

    // Dynamic parameters for Drill-down APIs
    const [drillDownParams, setDrillDownParams] = useState({
        page: 0,
        size: DEFAULT_PAGE_SIZE,
        sortField: 'paymentDate',
        sortOrder: SORT_ORDER.DESC,
    });

    const { selectedTenantId } = useAppSelector((s: RootState) => s.tenant);
    const isActualSkip = skip || !selectedTenantId;

    const { data, isError, isFetching, refetch } = useSearchPaymentsQuery({
        page: queryParams.page + 1,
        size: queryParams.size,
        sort: queryParams.sortField,
        desc: queryParams.sortOrder === SORT_ORDER.DESC,
        status: queryParams.status === 'All' ? null : queryParams.status,
        payerIds: queryParams.payerIds as string | null,
        fromDate: queryParams.fromDate,
        toDate: queryParams.toDate,
        transactionNo: queryParams.transactionNo,
    }, { skip: isActualSkip });

    const [triggerExport] = useLazyExportPaymentsQuery();
    const [triggerGetRemittance] = useLazyGetRemittanceClaimsQuery();
    const { data: dropdownData } = useGetAllTransactionsFiltersQuery(undefined, { skip: isActualSkip });

    const exportCount = useRef(actionTriggers.export);
    const printCount = useRef(actionTriggers.print);
    const reloadCount = useRef(actionTriggers.reload);
    const statusOptions = useMemo(() => {
        if (dropdownData?.data?.transactionStatusTypes) {
            return dropdownData.data.transactionStatusTypes.map((status) => ({
                label: status,
                value: status
            }));
        }
        return [];
    }, [dropdownData]);

    const payerOptions = useMemo(() => {
        if (dropdownData?.data?.payers) {
            return dropdownData.data.payers.map((p) => ({
                label: p.payerName,
                value: p.payerName
            }));
        }
        return [];
    }, [dropdownData]);

    useEffect(() => {
        if (skip) {
            dispatch(setIsGlobalFetching(false));
            return;
        }
        dispatch(setIsGlobalFetching(isFetching));
        return () => { dispatch(setIsGlobalFetching(false)); };
    }, [isFetching, skip, dispatch]);

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
                    `Payments_Report_${formatDateForFilename(queryParams.fromDate)}_to_${formatDateForFilename(queryParams.toDate)}.${formatType}`
                );
            }
        } catch (err) {
            console.error('Export failed:', err);
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

    const [triggerSearchServiceLines] = useLazySearchServiceLinesQuery();

    const handleDrillDown = useCallback(async (row: PaymentTransaction) => {
        try {
            dispatch(setGlobalDrillingDown(true));
            const identifier = row.transactionNo || row.id || '';
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

    const handleRangeChange = useCallback((range: string) => {
        if (range.includes(' to ')) {
            const [from, to] = range.split(' to ');
            setQueryParams(prev => {
                if (prev.fromDate === from && prev.toDate === to) return prev;
                return { ...prev, fromDate: from, toDate: to, page: 0 };
            });
            // Update global filters for persistence - label is 'Custom' if it's a date string
            dispatch(setGlobalFilters({ fromDate: from, toDate: to, rangeLabel: 'Custom' }));
        } else {
            // It's a preset label
            const dates = calculateDatesFromLabel(range);
            if (dates) {
                setQueryParams(prev => {
                    if (prev.fromDate === dates.from && prev.toDate === dates.to) return prev;
                    return { ...prev, fromDate: dates.from, toDate: dates.to, page: 0 };
                });
                // Update global filters for persistence - preserve the label
                dispatch(setGlobalFilters({ fromDate: dates.from, toDate: dates.to, rangeLabel: range }));
            }
        }
    }, [dispatch]);

    const handleFilterChange = useCallback((filters: Record<string, string>) => {
        setQueryParams(prev => {
            const newStatus = filters.status || null;
            const newPayerIds = filters.payer || filters.payerIds || null;
            const newCategory = filters.transactionType || null;
            const newType = filters.type || null;
            const newSource = filters.sourceProvider || null;

            const isChanged =
                prev.status !== newStatus ||
                prev.payerIds !== newPayerIds ||
                prev.category !== newCategory ||
                prev.type !== newType ||
                prev.sourceProvider !== newSource;

            if (!isChanged) return prev;

            return {
                ...prev,
                status: newStatus,
                payerIds: newPayerIds,
                category: newCategory,
                type: newType,
                sourceProvider: newSource,
                page: 0
            };
        });
    }, []);

    const handleSortChange = useCallback((colId: string, direction: 'asc' | 'desc') => {
        setQueryParams(prev => {
            if (prev.sortField === colId && prev.sortOrder === direction) return prev;
            return { ...prev, sortField: colId, sortOrder: direction, page: 0 };
        });
    }, []);

    const onPageChange = useCallback((p: number) => setQueryParams(prev => prev.page === p ? prev : { ...prev, page: p }), []);
    const onRowsPerPageChange = useCallback((s: number) => setQueryParams(prev => prev.size === s ? prev : { ...prev, size: s, page: 0 }), []);

    // Expose drill-down parameter updates
    const onDrillDownParamsChange = useCallback((params: Partial<typeof drillDownParams>) => {
        setDrillDownParams(prev => ({ ...prev, ...params }));
    }, []);

    return {
        payments: data?.data?.content ?? [],
        totalElements: data?.data?.totalElements ?? 0,
        queryParams,
        globalFilters,
        drillDownParams,
        handleDrillDown,
        handleRangeChange,
        handleFilterChange,
        handleSortChange,
        onPageChange,
        onRowsPerPageChange,
        onDrillDownParamsChange,
        searchTerm,
        setSearchTerm,
        onSearch: handleSearch,
        isError,
        isFetching,
        dispatch,
        statusOptions,
        payerOptions
    };
};
