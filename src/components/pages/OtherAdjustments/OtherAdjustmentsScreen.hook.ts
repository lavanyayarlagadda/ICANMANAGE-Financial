import { useRef, useEffect, useCallback } from 'react';
import { useAppSelector, useAppDispatch } from '@/store';
import { openViewDialog, openEditDialog, openConfirmDelete, setActiveExportType, setIsReloading } from '@/store/slices/uiSlice';

export const useOtherAdjustmentsScreen = () => {
    const dispatch = useAppDispatch();
    const otherAdjustments = useAppSelector((s) => s.financials.otherAdjustments);
    const { actionTriggers } = useAppSelector(s => s.ui);

    const exportCount = useRef(actionTriggers.export);
    const printCount = useRef(actionTriggers.print);
    const reloadCount = useRef(actionTriggers.reload);

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
            const doReload = async () => {
                dispatch(setIsReloading(true));
                await new Promise(r => setTimeout(r, 800));
                dispatch(setIsReloading(false));
            };
            doReload();
            reloadCount.current = actionTriggers.reload;
        }
    }, [actionTriggers.reload, dispatch]);

    const handleView = useCallback((r: any) => dispatch(openViewDialog(r)), [dispatch]);
    const handleEdit = useCallback((r: any) => dispatch(openEditDialog(r)), [dispatch]);
    const handleDelete = useCallback((id: string) => dispatch(openConfirmDelete({ id, type: 'adjustment' })), [dispatch]);

    return {
        otherAdjustments,
        handleView,
        handleEdit,
        handleDelete,
        dispatch
    };
};
