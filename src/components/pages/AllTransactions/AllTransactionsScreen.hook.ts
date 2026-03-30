import { useMemo, useCallback, useRef, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/store';
import { openViewDialog, openEditDialog, openConfirmDelete, setActiveExportType } from '@/store/slices/uiSlice';

export const useAllTransactionsScreen = () => {
    const dispatch = useAppDispatch();
    const { allTransactions } = useAppSelector((s) => s.financials);
    const user = useAppSelector((s) => s.auth.user);
    const isMindPath = user?.company?.toLowerCase() === 'mindpath';
    const { actionTriggers } = useAppSelector(s => s.ui);

    const filteredTransactions = useMemo(() => isMindPath 
        ? allTransactions.filter(t => t.transactionType !== 'PIP') 
        : allTransactions, [allTransactions, isMindPath]);

    const exportCount = useRef(actionTriggers.export);
    const printCount = useRef(actionTriggers.print);
    const reloadCount = useRef(actionTriggers.reload);

    const handleExport = useCallback((formatType: 'pdf' | 'xlsx') => {
        dispatch(setActiveExportType(formatType));
        setTimeout(() => {
            dispatch(setActiveExportType(null));
        }, 1500);
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
            reloadCount.current = actionTriggers.reload;
        }
    }, [actionTriggers.reload]);

    const handleView = useCallback((r: any) => dispatch(openViewDialog(r)), [dispatch]);
    const handleEdit = useCallback((r: any) => dispatch(openEditDialog(r)), [dispatch]);
    const handleDelete = useCallback((id: string) => dispatch(openConfirmDelete({ id, type: 'transaction' })), [dispatch]);

    return {
        filteredTransactions,
        isMindPath,
        handleView,
        handleEdit,
        handleDelete,
        dispatch
    };
};
