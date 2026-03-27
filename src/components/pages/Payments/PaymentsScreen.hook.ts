import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { useAppSelector, useAppDispatch } from '@/store';
import { 
  openEditDialog, 
  openConfirmDelete, 
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
  setSelectedClaimIndex 
} from '@/store/slices/financialsSlice';
import { subMonths, format } from 'date-fns';
import { 
  useSearchPaymentsQuery, 
  useLazyExportPaymentsQuery, 
  useLazyGetRemittanceClaimsQuery 
} from '@/store/api/financialsApi';
import { downloadFileFromBlob } from '@/utils/downloadHelper';

export const usePaymentsScreen = () => {
    const dispatch = useAppDispatch();
    const { actionTriggers } = useAppSelector(s => s.ui);

    const [queryParams, setQueryParams] = useState({
        page: 0,
        size: 10,
        sortField: '',
        sortOrder: 'desc' as 'asc' | 'desc',
        status: null as string | null,
        fromDate: format(subMonths(new Date(), 6), 'yyyy-MM-dd'),
        toDate: format(new Date(), 'yyyy-MM-dd'),
    });

    const { data, isError, isFetching, refetch } = useSearchPaymentsQuery({
        page: queryParams.page + 1,
        size: queryParams.size,
        sort: queryParams.sortField,
        desc: queryParams.sortOrder === 'desc',
        status: queryParams.status === 'All' ? null : queryParams.status,
        fromDate: queryParams.fromDate,
        toDate: queryParams.toDate
    });

    const [triggerExport] = useLazyExportPaymentsQuery();
    const [triggerGetRemittance] = useLazyGetRemittanceClaimsQuery();

    const exportCount = useRef(actionTriggers.export);
    const printCount = useRef(actionTriggers.print);
    const reloadCount = useRef(actionTriggers.reload);

    useEffect(() => {
        dispatch(setIsGlobalFetching(isFetching));
        return () => { dispatch(setIsGlobalFetching(false)); };
    }, [isFetching, dispatch]);

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
                    result as unknown as Blob,
                    `Payments_Report_${queryParams.fromDate}_to_${queryParams.toDate}.${formatType}`
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

    const handleDrillDown = useCallback(async (row: any) => {
        try {
            dispatch(setGlobalDrillingDown(true));
            dispatch(setSelectedPaymentId(row.transactionNo));

            const claimResult = await triggerGetRemittance(row.transactionNo).unwrap() as any;
            const claimsArr = Array.isArray(claimResult?.data) ? claimResult.data : (Array.isArray(claimResult) ? claimResult : (claimResult ? [claimResult] : []));

            if (claimsArr.length === 0) {
                dispatch(setRemittanceClaims([]));
                dispatch(setRemittanceDetail(null));
                dispatch(setShowRemittanceDetail(true));
                return;
            }

            dispatch(setRemittanceClaims(claimsArr));
            dispatch(setSelectedClaimIndex(0));
            dispatch(setRemittanceDetail(claimsArr[0]));
            dispatch(setShowRemittanceDetail(true));
        } catch (err) {
            console.error('Failed to fetch primary remittance details:', err);
        } finally {
            dispatch(setGlobalDrillingDown(false));
        }
    }, [dispatch, triggerGetRemittance]);

    const handleRangeChange = useCallback((range: string) => {
        if (range.includes(' to ')) {
            const [from, to] = range.split(' to ');
            setQueryParams(prev => {
                if (prev.fromDate === from && prev.toDate === to) return prev;
                return { ...prev, fromDate: from, toDate: to, page: 0 };
            });
        }
    }, []);

    const handleFilterChange = useCallback((filters: Record<string, string>) => {
        if (filters.status !== undefined) {
            const newStatus = filters.status || null;
            setQueryParams(prev => prev.status === newStatus ? prev : { ...prev, status: newStatus, page: 0 });
        }
    }, []);

    const handleSortChange = useCallback((colId: string, direction: 'asc' | 'desc') => {
        setQueryParams(prev => {
            if (prev.sortField === colId && prev.sortOrder === direction) return prev;
            return { ...prev, sortField: colId, sortOrder: direction, page: 0 };
        });
    }, []);

    const onPageChange = useCallback((p: number) => setQueryParams(prev => prev.page === p ? prev : { ...prev, page: p }), []);
    const onRowsPerPageChange = useCallback((s: number) => setQueryParams(prev => prev.size === s ? prev : { ...prev, size: s, page: 0 }), []);

    return {
        payments: data?.data?.content ?? [],
        totalElements: data?.data?.totalElements ?? 0,
        queryParams,
        handleDrillDown,
        handleRangeChange,
        handleFilterChange,
        handleSortChange,
        onPageChange,
        onRowsPerPageChange,
        isError,
        dispatch
    };
};
