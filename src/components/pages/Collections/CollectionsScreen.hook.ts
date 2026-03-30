import { useMemo, useCallback } from 'react';
import { useAppSelector, useAppDispatch } from '@/store';
import { openViewDialog, openEditDialog, openConfirmDelete } from '@/store/slices/uiSlice';
import { CollectionAccount } from '@/interfaces/financials';

export const useCollectionsScreen = () => {
    const dispatch = useAppDispatch();
    const collections = useAppSelector((s) => s.financials.collections);

    const stats = useMemo(() => {
        const totalDue = collections.reduce((sum, r) => sum + r.totalDue, 0);
        const totalCollected = collections.reduce((sum, r) => sum + r.amountCollected, 0);
        const totalBalance = collections.reduce((sum, r) => sum + r.balance, 0);
        const openAccounts = collections.filter((c) => c.status === 'Open').length;
        return { totalDue, totalCollected, totalBalance, openAccounts };
    }, [collections]);

    const handleView = useCallback((r: CollectionAccount) => dispatch(openViewDialog(r)), [dispatch]);
    const handleEdit = useCallback((r: CollectionAccount) => dispatch(openEditDialog(r)), [dispatch]);
    const handleDelete = useCallback((id: string) => dispatch(openConfirmDelete({ id, type: 'collection' })), [dispatch]);

    return {
        collections,
        stats,
        handleView,
        handleEdit,
        handleDelete,
        dispatch
    };
};
