import { useState, useMemo, useCallback } from 'react';
import { useAppSelector } from '@/store';

export const useStatementsScreen = () => {
    const { activeSubTab } = useAppSelector((s) => s.ui);
    const user = useAppSelector((s) => s.auth.user);
 const { selectedTenantId } = useAppSelector((s) => s.tenant);
const isMindPath = useMemo(
  () =>
    user?.company?.toLowerCase() === 'mindpath' ||
    selectedTenantId?.toLowerCase() === 'mindpath',
  [user, selectedTenantId]
);  const { forwardBalanceNotices } = useAppSelector((s) => s.financials);

    const finalActiveSubTab = (isMindPath && activeSubTab === 0) ? 1 : activeSubTab;

    const stats = useMemo(() => {
        const totalOriginalAmount = forwardBalanceNotices.reduce((sum, r) => sum + (r.originalAmount ?? 0), 0);
        const totalRemainingBalance = forwardBalanceNotices.reduce((sum, r) => sum + (r.remainingBalance ?? 0), 0);
        return { totalOriginalAmount, totalRemainingBalance };
    }, [forwardBalanceNotices]);

    return {
        activeSubTab,
        finalActiveSubTab,
        forwardBalanceNotices,
        stats,
    };
};

export const useForwardBalanceNoticesTable = () => {
    const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

    const toggleRow = useCallback((id: string) => {
        setExpandedRows((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(id)) newSet.delete(id);
            else newSet.add(id);
            return newSet;
        });
    }, []);

    return {
        expandedRows,
        toggleRow,
    };
};
