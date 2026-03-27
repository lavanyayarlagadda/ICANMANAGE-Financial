import { useState, useCallback } from 'react';

export const useSuspenseAccountsScreen = () => {
    const [viewType, setViewType] = useState<'account' | 'payer' | 'month'>('account');
    const [manageDialogOpen, setManageDialogOpen] = useState(false);

    const handleViewChange = useCallback((_: React.MouseEvent<HTMLElement>, nextView: 'account' | 'payer' | 'month') => {
        if (nextView !== null) setViewType(nextView);
    }, []);

    const toggleManageDialog = useCallback((open: boolean) => {
        setManageDialogOpen(open);
    }, []);

    return {
        viewType,
        manageDialogOpen,
        handleViewChange,
        toggleManageDialog,
    };
};
