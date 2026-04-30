import { useState, useCallback } from 'react';
import { useLazyGetBaiTriggerHistoryQuery } from '@/store/api/financialsApi';
import { DEFAULT_CLIENT_NAME } from '@/constants/common';
import { RowHistoryData } from '@/interfaces/financials';

export const useBankDepositHistory = (selectedTenant: { displayName?: string } | undefined) => {
    const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
    const [rowHistory, setRowHistory] = useState<Record<string, { data: RowHistoryData, isLoading: boolean }>>({});
    const [triggerGetHistory] = useLazyGetBaiTriggerHistoryQuery();

    const fetchRowHistory = useCallback(async (transactionNo: string) => {
        if (rowHistory[transactionNo]?.data) return;

        setRowHistory(prev => ({ ...prev, [transactionNo]: { ...prev[transactionNo], isLoading: true } }));
        try {
            const pageFlag = 'Reconciled';
            const result = await triggerGetHistory({
                eftNo: transactionNo,
                pageFlag: pageFlag,
                clientName: selectedTenant?.displayName?.toLowerCase() || DEFAULT_CLIENT_NAME
            }).unwrap();

            setRowHistory(prev => ({
                ...prev,
                [transactionNo]: { data: result.data, isLoading: false }
            }));
        } catch (err) {
            console.error('Failed to fetch history:', err);
            setRowHistory(prev => ({ ...prev, [transactionNo]: { ...prev[transactionNo], isLoading: false } }));
        }
    }, [rowHistory, triggerGetHistory, selectedTenant]);

    const toggleRow = useCallback((id: string) => {
        setExpandedRows((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
                fetchRowHistory(id);
            }
            return newSet;
        });
    }, [fetchRowHistory]);

    return {
        expandedRows,
        rowHistory,
        toggleRow
    };
};
