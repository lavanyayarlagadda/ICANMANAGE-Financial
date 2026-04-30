import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { openViewDialog, openEditDialog, openConfirmDelete, setActiveExportType } from '@/store/slices/uiSlice';
import { setGlobalFilters } from '@/store/slices/financialsSlice';
import { CollectionAccount } from '@/interfaces/financials';
import { useLazyExportCollectionsQuery } from '@/store/api/financialsApi';
import { calculateDatesFromLabel } from '@/utils/dateUtils';
import { downloadFileFromBlob } from '@/utils/downloadHelper';
import { formatDateForFilename } from '@/utils/formatters';
import { SORT_ORDER, DEFAULT_PAGE_SIZE, EXPORT_FORMATS } from '@/constants/common';

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
    const { actionTriggers } = useAppSelector(s => s.ui);
    const exportCount = useRef(actionTriggers.export);
    const printCount = useRef(actionTriggers.print);

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
        size: DEFAULT_PAGE_SIZE,
        sortField: 'accountNumber',
        sortOrder: SORT_ORDER.DESC as 'asc' | 'desc',
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

    const [triggerExport] = useLazyExportCollectionsQuery();

    const handleExport = useCallback(async (formatType: typeof EXPORT_FORMATS.PDF | typeof EXPORT_FORMATS.XLSX) => {
        try {
            dispatch(setActiveExportType(formatType));
            const result = await triggerExport({
                fromDate: queryParams.fromDate,
                toDate: queryParams.toDate,
                format: formatType
            }).unwrap();

            if (result !== undefined) {
                downloadFileFromBlob(
                    result,
                    `Collections_Report_${formatDateForFilename(queryParams.fromDate)}_to_${formatDateForFilename(queryParams.toDate)}.${formatType}`
                );
            }
        } catch (err) {
            console.error('Collections Export failed:', err);
        } finally {
            dispatch(setActiveExportType(null));
        }
    }, [dispatch, queryParams.fromDate, queryParams.toDate, triggerExport]);

    useEffect(() => {
        if (actionTriggers.export > exportCount.current) {
            handleExport(EXPORT_FORMATS.XLSX);
            exportCount.current = actionTriggers.export;
        }
    }, [actionTriggers.export, handleExport]);

    useEffect(() => {
        if (actionTriggers.print > printCount.current) {
            handleExport(EXPORT_FORMATS.PDF);
            printCount.current = actionTriggers.print;
        }
    }, [actionTriggers.print, handleExport]);

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
