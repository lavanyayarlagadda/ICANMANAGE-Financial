import { useState, useMemo, useCallback } from 'react';
import { useAppSelector } from '@/store';

export const useBankDepositsScreen = () => {
    const bankDeposits = useAppSelector((s) => s.financials.bankDeposits);
    const [selectedEntityId, setSelectedEntityId] = useState<'all' | string>('all');
    const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

    const entities = useMemo(() => [
        { id: 'all', name: 'All Entities (Consolidated)' },
        { id: 'e1', name: 'Apex Primary Care' },
        { id: 'e2', name: 'Apex Surgical Center' },
        { id: 'e3', name: 'Apex Home Health' },
    ], []);

    const toggleRow = useCallback((id: string) => {
        setExpandedRows((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(id)) newSet.delete(id);
            else newSet.add(id);
            return newSet;
        });
    }, []);

    const filteredDeposits = useMemo(() => {
        return bankDeposits.filter(entity => selectedEntityId === 'all' || entity.id === selectedEntityId);
    }, [bankDeposits, selectedEntityId]);

    return {
        bankDeposits,
        filteredDeposits,
        selectedEntityId,
        setSelectedEntityId,
        expandedRows,
        entities,
        toggleRow,
    };
};
