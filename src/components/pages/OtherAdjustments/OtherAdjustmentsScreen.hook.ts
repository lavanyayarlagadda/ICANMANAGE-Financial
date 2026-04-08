import { useMemo, useCallback, useRef, useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '@/store';
import { openViewDialog, openEditDialog, openConfirmDelete, setActiveExportType, setIsGlobalFetching } from '@/store/slices/uiSlice';
import { OtherAdjustmentRecord } from '@/interfaces/financials';
import { useSearchOtherAdjustmentsQuery, useLazyExportOtherAdjustmentsQuery } from '@/store/api/financialsApi';
import { subMonths, format } from 'date-fns';
import { downloadFileFromBlob } from '@/utils/downloadHelper';

export const useOtherAdjustmentsScreen = ({ skip = false }: { skip?: boolean } = {}) => {
    const dispatch = useAppDispatch();
    const { actionTriggers } = useAppSelector(s => s.ui);

    const [queryParams, setQueryParams] = useState({
        page: 0,
        size: 10,
        sortField: 'effectiveDate',
        sortOrder: 'desc' as 'asc' | 'desc',
        fromDate: format(subMonths(new Date(), 6), 'yyyy-MM-dd'),
        toDate: format(new Date(), 'yyyy-MM-dd'),
    });

    const { data, isFetching, isError, refetch } = useSearchOtherAdjustmentsQuery({
        page: queryParams.page + 1,
        size: queryParams.size,
        sort: queryParams.sortField,
        desc: queryParams.sortOrder === 'desc',
        fromDate: queryParams.fromDate,
        toDate: queryParams.toDate
    }, { skip });

    const adjustments = useMemo(() => data?.data?.content ?? [], [data]);

    const [triggerExportOtherAdjustments] = useLazyExportOtherAdjustmentsQuery();

    const exportCount = useRef(actionTriggers.export);
    const printCount = useRef(actionTriggers.print);
    const reloadCount = useRef(actionTriggers.reload);

    useEffect(() => {
        dispatch(setIsGlobalFetching(isFetching));
        return () => { dispatch(setIsGlobalFetching(false)); };
    }, [isFetching, dispatch]);

    const handleExport = useCallback(async (exportFormat: 'pdf' | 'xlsx') => {
        dispatch(setActiveExportType(exportFormat));
        try {
            const blob = await triggerExportOtherAdjustments({
                fromDate: queryParams.fromDate,
                toDate: queryParams.toDate,
                format: exportFormat
            }).unwrap();
            
            const filename = `adjustments_${queryParams.fromDate}_to_${queryParams.toDate}.${exportFormat}`;
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

    const handleView = useCallback((r: OtherAdjustmentRecord) => dispatch(openViewDialog(r)), [dispatch]);
    const handleEdit = useCallback((r: OtherAdjustmentRecord) => dispatch(openEditDialog(r)), [dispatch]);
    const handleDelete = useCallback((id: string) => dispatch(openConfirmDelete({ id, type: 'adjustment' })), [dispatch]);

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
        adjustments,
        totalElements: data?.data?.totalElements ?? 0,
        queryParams,
        handleView,
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
