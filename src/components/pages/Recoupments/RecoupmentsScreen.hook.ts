import { useRef, useEffect, useCallback, useMemo, useState } from 'react';
import { useAppSelector, useAppDispatch } from '@/store';
import {
    openViewDialog,
    openEditDialog,
    openConfirmDelete,
    setActiveExportType,
    setIsReloading,
    setIsGlobalFetching,
    setIsDrillingDown as setGlobalDrillingDown
} from '@/store/slices/uiSlice';
import {
    setShowRemittanceDetail,
    setSelectedPaymentId,
    setRemittanceDetail,
    setRemittanceClaims,
    setSelectedClaimIndex
} from '@/store/slices/financialsSlice';
import { RecoupmentRecord, RemittanceDetail, PaymentTransaction } from '@/interfaces/financials';
import {
    useLazyExportRecoupmentsQuery,
    useLazyGetRemittanceClaimsQuery,
    useLazySearchServiceLinesQuery,
    useSearchRecoupmentsQuery
} from '@/store/api/financialsApi';
import { TableQueryParams } from '@/interfaces/api';
import { subMonths, format } from 'date-fns';
import { downloadFileFromBlob } from '@/utils/downloadHelper';
import { isRemittanceDetail, normalizeRemittanceClaims } from '@/utils/normalizeRemittanceClaims';

export const useRecoupmentsScreen = ({ skip = false }: { skip?: boolean } = {}) => {
    const dispatch = useAppDispatch();
    const { actionTriggers } = useAppSelector(s => s.ui);

    const [queryParams, setQueryParams] = useState<TableQueryParams>({
        page: 0,
        size: 10,
        sortField: '',
        sortOrder: 'desc' as 'asc' | 'desc',
        fromDate: format(subMonths(new Date(), 6), 'yyyy-MM-dd'),
        toDate: format(new Date(), 'yyyy-MM-dd'),
    });

    const [drillDownParams, setDrillDownParams] = useState({
        page: 0,
        size: 10,
        sortField: 'paymentDate',
        sortOrder: 'desc' as 'asc' | 'desc',
    });

    const { data, isFetching, isError, refetch } = useSearchRecoupmentsQuery({
        page: queryParams.page + 1,
        size: queryParams.size,
        sort: queryParams.sortField,
        desc: queryParams.sortOrder === 'desc',
        fromDate: queryParams.fromDate,
        toDate: queryParams.toDate
    }, { skip });

    const recoupments = useMemo(() => data?.data?.content ?? [], [data]);

    const [triggerExportRecoupments] = useLazyExportRecoupmentsQuery();
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

    const handleExport = useCallback(async (exportFormat: 'pdf' | 'xlsx') => {
        dispatch(setActiveExportType(exportFormat));
        try {
            const blob = await triggerExportRecoupments({
                fromDate: queryParams.fromDate,
                toDate: queryParams.toDate,
                format: exportFormat
            }).unwrap();

            const filename = `recoupments_${queryParams.fromDate}_to_${queryParams.toDate}.${exportFormat}`;
            downloadFileFromBlob(blob, filename);
        } catch (error) {
            console.error('Export failed:', error);
        } finally {
            setTimeout(() => {
                dispatch(setActiveExportType(null));
            }, 1200);
        }
    }, [dispatch, queryParams.fromDate, queryParams.toDate, triggerExportRecoupments]);

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

    const stats = useMemo(() => {
        const totalRecouped = recoupments.reduce((sum, r) => sum + Math.abs(r.recoupmentAmount ?? 0), 0);
        const totalOriginal = recoupments.reduce((sum, r) => sum + (r.originalPaymentAmount ?? 0), 0);
        return { totalRecouped, totalOriginal };
    }, [recoupments]);

    const handleDrillDown = useCallback(async (row: RecoupmentRecord) => {
        try {
            dispatch(setGlobalDrillingDown(true));
            const identifier = row.claimId || row.recoupmentId || row.id || '';
            if (identifier) {
                dispatch(setSelectedPaymentId(identifier));

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

    const handleEdit = useCallback((r: RecoupmentRecord) => dispatch(openEditDialog(r)), [dispatch]);
    const handleDelete = useCallback((id: string) => dispatch(openConfirmDelete({ id, type: 'recoupment' })), [dispatch]);

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
        recoupments,
        totalElements: data?.data?.totalElements ?? 0,
        queryParams,
        drillDownParams,
        stats,
        handleDrillDown,
        handleEdit,
        handleDelete,
        handleRangeChange,
        handleSortChange,
        onPageChange,
        onRowsPerPageChange,
        isError,
        dispatch
    };
};
