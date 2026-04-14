import { useMemo, useCallback, useRef, useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch, RootState } from '@/store';
import { openViewDialog, openEditDialog, openConfirmDelete, setActiveExportType, setIsGlobalFetching } from '@/store/slices/uiSlice';
import { AllTransaction, PaymentTransaction, RemittanceDetail } from '@/interfaces/financials';
import { useLazyExportAllTransactionsQuery, useLazyGetRemittanceClaimsQuery, useLazySearchServiceLinesQuery, useSearchAllTransactionsQuery } from '@/store/api/financialsApi';
import { format } from 'date-fns';
import { calculateDatesFromLabel } from '@/utils/dateUtils';
import { setRemittanceClaims, setRemittanceDetail, setSelectedClaimIndex, setSelectedPaymentId, setShowRemittanceDetail, setGlobalFilters } from '@/store/slices/financialsSlice';
import {
    setIsDrillingDown as setGlobalDrillingDown,
} from '@/store/slices/uiSlice';
import { isRemittanceDetail, normalizeRemittanceClaims } from '@/utils/normalizeRemittanceClaims';
import { downloadFileFromBlob } from '@/utils/downloadHelper';


export const useAllTransactionsScreen = ({ skip = false }: { skip?: boolean } = {}) => {
    const dispatch = useAppDispatch();
    const user = useAppSelector((s: RootState) => s.auth.user);
    const { selectedTenantId } = useAppSelector((s: RootState) => s.tenant);
    const { actionTriggers } = useAppSelector((s: RootState) => s.ui);
    const { globalFilters } = useAppSelector((s: RootState) => s.financials);

    // const isMindPath = useMemo(
    //     () => user?.company?.toLowerCase() === 'mindpath' || selectedTenantId?.toLowerCase() === 'mindpath',
    //     [user, selectedTenantId]
    // );

    const [queryParams, setQueryParams] = useState({
        page: 0,
        size: 10,
        sortField: 'effectiveDate',
        sortOrder: 'desc' as 'asc' | 'desc',
        fromDate: globalFilters.fromDate,
        toDate: globalFilters.toDate,
    });

    // Dynamic parameters for Drill-down APIs
    const [drillDownParams, setDrillDownParams] = useState({
        page: 0,
        size: 10,
        sortField: 'paymentDate',
        sortOrder: 'desc' as 'asc' | 'desc',
    });

    const { data, isFetching, isError, refetch } = useSearchAllTransactionsQuery({
        page: queryParams.page + 1,
        size: queryParams.size,
        sort: queryParams.sortField,
        desc: queryParams.sortOrder === 'desc',
        fromDate: queryParams.fromDate,
        toDate: queryParams.toDate
    }, { skip });

    const transactions = useMemo(() => {
        const raw = data?.data?.content ?? [];
        return raw;
    }, [data]);

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

    const [triggerExport] = useLazyExportAllTransactionsQuery();

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
                    `All_Transactions_Report_${queryParams.fromDate}_to_${queryParams.toDate}.${formatType}`
                );
            }
        } catch (err) {
            console.error('All Transactions Export failed:', err);
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


    const [triggerSearchServiceLines] = useLazySearchServiceLinesQuery();
    const [triggerGetRemittance] = useLazyGetRemittanceClaimsQuery();

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
                        desc: drillDownParams.sortOrder === 'desc'
                    }).unwrap(),
                    triggerSearchServiceLines({
                        page: drillDownParams.page + 1,
                        size: drillDownParams.size,
                        sort: drillDownParams.sortField,
                        desc: drillDownParams.sortOrder === 'desc',
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

    const handleEdit = useCallback((r: AllTransaction) => dispatch(openEditDialog(r)), [dispatch]);
    const handleDelete = useCallback((id: string) => dispatch(openConfirmDelete({ id, type: 'transaction' })), [dispatch]);

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

    const handleSortChange = useCallback((colId: string, direction: 'asc' | 'desc') => {
        setQueryParams(prev => ({ ...prev, sortField: colId, sortOrder: direction, page: 0 }));
    }, []);

    const onPageChange = useCallback((p: number) => setQueryParams(prev => ({ ...prev, page: p })), []);
    const onRowsPerPageChange = useCallback((s: number) => setQueryParams(prev => ({ ...prev, size: s, page: 0 })), []);

    // Expose drill-down parameter updates
    const onDrillDownParamsChange = useCallback((params: Partial<typeof drillDownParams>) => {
        setDrillDownParams(prev => ({ ...prev, ...params }));
    }, []);

    return {
        filteredTransactions: transactions,
        totalElements: data?.data?.totalElements ?? 0,
        queryParams,
        globalFilters,
        drillDownParams,
        // isMindPath,
        handleDrillDown,
        handleEdit,
        handleDelete,
        handleRangeChange,
        handleSortChange,
        onPageChange,
        onRowsPerPageChange,
        onDrillDownParamsChange,
        isError,
        dispatch
    };
};
