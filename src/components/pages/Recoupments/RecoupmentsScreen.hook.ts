import { useRef, useEffect, useCallback, useMemo, useState } from 'react';
import { useAppSelector, useAppDispatch } from '@/store';
import { openViewDialog, openEditDialog, openConfirmDelete, setActiveExportType, setIsReloading, setIsGlobalFetching } from '@/store/slices/uiSlice';
import { RecoupmentRecord } from '@/interfaces/financials';
import { useSearchRecoupmentsQuery } from '@/store/api/financialsApi';
import { subMonths, format } from 'date-fns';

export const useRecoupmentsScreen = ({ skip = false }: { skip?: boolean } = {}) => {
    const dispatch = useAppDispatch();
    const { actionTriggers } = useAppSelector(s => s.ui);

    const [queryParams, setQueryParams] = useState({
        page: 0,
        size: 10,
        sortField: 'recoupmentDate',
        sortOrder: 'desc' as 'asc' | 'desc',
        fromDate: format(subMonths(new Date(), 6), 'yyyy-MM-dd'),
        toDate: format(new Date(), 'yyyy-MM-dd'),
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

    const exportCount = useRef(actionTriggers.export);
    const printCount = useRef(actionTriggers.print);
    const reloadCount = useRef(actionTriggers.reload);

    useEffect(() => {
        dispatch(setIsGlobalFetching(isFetching));
        return () => { dispatch(setIsGlobalFetching(false)); };
    }, [isFetching, dispatch]);

    const handleExport = useCallback((format: 'pdf' | 'xlsx') => {
        dispatch(setActiveExportType(format));
        setTimeout(() => {
            dispatch(setActiveExportType(null));
        }, 1200);
    }, [dispatch]);

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

    const handleView = useCallback((r: RecoupmentRecord) => dispatch(openViewDialog(r)), [dispatch]);
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
        stats,
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
