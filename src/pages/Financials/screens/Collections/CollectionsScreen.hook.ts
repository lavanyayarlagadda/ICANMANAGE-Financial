import { useState, useMemo, useCallback, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { openViewDialog, openEditDialog, openConfirmDelete } from '@/store/slices/uiSlice';
import { setGlobalFilters } from '@/store/slices/financialsSlice';
import { CollectionAccount } from '@/interfaces/financials';
import { calculateDatesFromLabel } from '@/utils/dateUtils';

const DUMMY_COLLECTIONS: CollectionAccount[] = [
    {
        id: '1',
        accountNumber: 'ACC-2024-001',
        patientName: 'John Doe',
        payer: 'United Healthcare',
        totalDue: 2500.00,
        amountCollected: 1500.00,
        balance: 1000.00,
        lastActivityDate: '2024-03-15',
        assignedTo: 'Sarah Smith',
        aging: '31-60',
        priority: 'High',
        status: 'Open'
    },
    {
        id: '2',
        accountNumber: 'ACC-2024-002',
        patientName: 'Jane Smith',
        payer: 'Aetna',
        totalDue: 1200.00,
        amountCollected: 1200.00,
        balance: 0.00,
        lastActivityDate: '2024-03-20',
        assignedTo: 'Sarah Smith',
        aging: 'N/A',
        priority: 'Low',
        status: 'Closed'
    },
    {
        id: '3',
        accountNumber: 'ACC-2024-003',
        patientName: 'Robert Brown',
        payer: 'Blue Shield',
        totalDue: 5000.00,
        amountCollected: 1000.00,
        balance: 4000.00,
        lastActivityDate: '2024-03-10',
        assignedTo: 'Mike Miller',
        aging: '61-90',
        priority: 'High',
        status: 'Closed'
    },
    {
        id: '4',
        accountNumber: 'ACC-2024-004',
        patientName: 'Emily Wilson',
        payer: 'Medicare',
        totalDue: 850.00,
        amountCollected: 425.00,
        balance: 425.00,
        lastActivityDate: '2024-03-18',
        assignedTo: 'Sarah Smith',
        aging: '0-30',
        priority: 'Medium',
        status: 'Open'
    },
    {
        id: '5',
        accountNumber: 'ACC-2024-005',
        patientName: 'Michael Davis',
        payer: 'Aetna',
        totalDue: 2100.00,
        amountCollected: 0.00,
        balance: 2100.00,
        lastActivityDate: '2024-03-05',
        assignedTo: 'Mike Miller',
        aging: '91-120',
        priority: 'High',
        status: 'Open'
    }
];

export const useCollectionsScreen = (_props?: { skip?: boolean }) => {
    const dispatch = useAppDispatch();
    const { globalFilters } = useAppSelector(s => s.financials);

    interface CollectionsQueryParams {
        page: number;
        size: number;
        sortField: string;
        sortOrder: 'asc' | 'desc';
        fromDate: string;
        toDate: string;
    }

    const [queryParams, setQueryParams] = useState<CollectionsQueryParams>({
        page: 0,
        size: 10,
        sortField: 'accountNumber',
        sortOrder: 'desc',
        fromDate: globalFilters.fromDate,
        toDate: globalFilters.toDate,
    });

    // Sync local queryParams with global filters
    useEffect(() => {
        setQueryParams(prev => ({
            ...prev,
            fromDate: globalFilters.fromDate,
            toDate: globalFilters.toDate,
            page: 0
        }));
    }, [globalFilters.fromDate, globalFilters.toDate]);


    const collections = useMemo(() => DUMMY_COLLECTIONS, []);
    const totalElements = DUMMY_COLLECTIONS.length;

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

    const handleRangeChange = useCallback((range: string) => {
        if (range.includes(' to ')) {
            const [from, to] = range.split(' to ');
            setQueryParams((prev) => ({ ...prev, fromDate: from, toDate: to, page: 0 }));
            dispatch(setGlobalFilters({ fromDate: from, toDate: to, rangeLabel: 'Custom' }));
        } else {
            const dates = calculateDatesFromLabel(range);
            if (dates) {
                setQueryParams((prev) => ({ ...prev, fromDate: dates.from, toDate: dates.to, page: 0 }));
                dispatch(setGlobalFilters({ fromDate: dates.from, toDate: dates.to, rangeLabel: range }));
            }
        }
    }, [dispatch]);

    const handleSortChange = useCallback((colId: string, direction: 'asc' | 'desc') => {
        setQueryParams((prev) => ({ ...prev, sortField: colId, sortOrder: direction, page: 0 }));
    }, []);

    const handlePageChange = useCallback((p: number) => setQueryParams((prev) => ({ ...prev, page: p })), []);
    const handleRowsPerPageChange = useCallback((s: number) => setQueryParams((prev) => ({ ...prev, size: s, page: 0 })), []);

    return {
        collections,
        totalElements,
        queryParams,
        stats,
        handleView,
        handleEdit,
        handleDelete,
        handleRangeChange,
        handleSortChange,
        handlePageChange,
        handleRowsPerPageChange,
        isError: false,
        globalFilters,
        dispatch
    };
};
