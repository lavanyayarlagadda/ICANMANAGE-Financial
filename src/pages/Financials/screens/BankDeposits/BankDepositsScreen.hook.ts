import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { useAppSelector, useAppDispatch } from '@/store';
import { setIsGlobalFetching, setActiveExportType } from '@/store/slices/uiSlice';
import { useSearchBankDepositsBodyQuery, useLazyExportBankDepositsQuery, useGetBankDepositWidgetsQuery, useGetMappedHeadersDataQuery, useGetUserMappedBrandsQuery, useLazyGetBaiTriggerHistoryQuery, useGetAllTransactionsFiltersQuery } from '@/store/api/financialsApi';
import { skipToken } from '@reduxjs/toolkit/query/react';
import { downloadFileFromBlob } from '@/utils/downloadHelper';
import { setGlobalFilters } from '@/store/slices/financialsSlice';
import { calculateDatesFromLabel } from '@/utils/dateUtils';
import { useUserPermissions } from '@/hooks/useUserPermissions';
import { BankDepositItem, RowHistoryData } from '@/interfaces/financials';
import { formatDateForFilename } from '@/utils/formatters';
import { SORT_ORDER, DEFAULT_PAGE_SIZE, EXPORT_FORMATS, DEFAULT_CLIENT_NAME } from '@/constants/common';

export const useBankDepositsScreen = ({ skip = false }: { skip?: boolean } = {}) => {
    const dispatch = useAppDispatch();
    const { actionTriggers } = useAppSelector(s => s.ui);
    const { globalFilters } = useAppSelector(s => s.financials);
    const exportCount = useRef(actionTriggers.export);
    const printCount = useRef(actionTriggers.print);
    const reloadCount = useRef(actionTriggers.reload);

    const [selectedEntityId, setSelectedEntityId] = useState<'all' | string>('all');
    const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
    const [exceptionsOnly, setExceptionsOnly] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        payerList: [] as string[],
        stateList: [] as string[],
        transactionsList: [] as string[],
        accountList: [] as string[],
        batchOwnerIds: [] as string[],
        status: null as string | null,
    });
    const [queryParams, setQueryParams] = useState({
        page: 0,
        size: DEFAULT_PAGE_SIZE,
        sortField: 'date',
        sortOrder: SORT_ORDER.DESC as 'asc' | 'desc',
        fromDate: globalFilters.fromDate,
        toDate: globalFilters.toDate,
        transactionNo: '',
    });

    const { user, isCognitiveUser } = useUserPermissions();
    const tenant = useAppSelector(s => s.tenant);
    const userId = user?.id || '';

    // Synchronize queryParams with global filters
    useEffect(() => {
        setQueryParams(prev => ({
            ...prev,
            fromDate: globalFilters.fromDate,
            toDate: globalFilters.toDate,
        }));
    }, [globalFilters.fromDate, globalFilters.toDate]);

    // Handle auto-reset when search is cleared
    useEffect(() => {
        if (searchTerm === '' && queryParams.transactionNo !== '') {
            setQueryParams(prev => ({ ...prev, transactionNo: '', page: 0 }));
        }
    }, [searchTerm, queryParams.transactionNo]);

    const selectedTenant = useMemo(() =>
        tenant.tenants.find(t => t.tenantId === tenant.selectedTenantId),
        [tenant.tenants, tenant.selectedTenantId]);

    // Base conditions for APIs
    const isBaseReady = !skip && !!userId;
    const isTenantReady = !isCognitiveUser || !!tenant.selectedTenantId;

    const {
        data: tabsResponse,
        isFetching: isTabsFetching,
        isSuccess: isTabsSuccess
    } = useGetUserMappedBrandsQuery(
        !isBaseReady ? skipToken : {
            icanManageId: userId,
            facilityMasterId: 0
        }
    );

    const entities = useMemo(() => {
        const dynamicEntries = tabsResponse?.data?.map(t => ({
            id: String(t.fkHospitalMasterId),
            name: t.hospitalAbbr
        })) || [];
        return [{ id: 'all', name: 'All' }, ...dynamicEntries];
    }, [tabsResponse]);

    // Sequential Fetching: Wait for Brands/Tabs AND Tenant before fetching widgets, headers, and search data
    const shouldFetchDependent = isBaseReady && isTenantReady && (isTabsSuccess || (!!tabsResponse && !isTabsFetching));

    const { data: widgetData, isFetching: isWidgetsFetching } = useGetBankDepositWidgetsQuery(
        !shouldFetchDependent ? skipToken : {
            startDate: queryParams.fromDate,
            endDate: queryParams.toDate,
            icanManageId: userId
        }
    );

    const { data: headersResponse, isFetching: isHeadersFetching, isSuccess: isHeadersSuccess } = useGetMappedHeadersDataQuery(
        !shouldFetchDependent ? skipToken : {
            hospitalId: selectedEntityId === 'all' ? 0 : Number(selectedEntityId),
            pageName: 'Bank Deposits'
        }
    );

    const { data: filterData } = useGetAllTransactionsFiltersQuery(undefined, { skip: !isBaseReady });
    const payerOptions = useMemo(() => filterData?.data?.payers?.map(p => ({
        label: p.payerName,
        value: String(p.payerId)
    })) ?? [], [filterData]);

    const statusOptions = useMemo(() => {
        const base = filterData?.data?.transactionStatusTypes ?? [];
        const combined = [...base];
        if (!combined.includes('Forward Balance')) {
            combined.push('Forward Balance');
        }
        return combined;
    }, [filterData]);

    const dynamicColumns = useMemo(() => headersResponse?.data || [], [headersResponse]);

    const { data, isFetching, isError, refetch } = useSearchBankDepositsBodyQuery(
        !shouldFetchDependent ? skipToken : {
            startDate: queryParams.fromDate || '',
            endDate: queryParams.toDate || '',
            payerList: filters.payerList || [],
            stateList: filters.stateList || [],
            transactionNo: queryParams.transactionNo || '',
            transactionsList: filters.transactionsList || [],
            accountList: filters.accountList || [],
            stateId: selectedEntityId === 'all' ? 0 : Number(selectedEntityId),
            batchOwnerIds: filters.batchOwnerIds || [],
            icanManageId: userId || 0,
            pageNumber: queryParams.page + 1,
            pageSize: queryParams.size,
            sort: queryParams.sortField === 'date' ? 'bai_received_date' : queryParams.sortField || 'transactionNo',
            desc: queryParams.sortOrder === SORT_ORDER.DESC,
            clientName: selectedTenant?.displayName?.toLowerCase() || DEFAULT_CLIENT_NAME,
            status: filters.status || null
        }
    );

    useEffect(() => {
        if (skip) {
            dispatch(setIsGlobalFetching(false));
            return;
        }
        dispatch(setIsGlobalFetching(isFetching || isWidgetsFetching || isHeadersFetching || isTabsFetching));
        return () => { dispatch(setIsGlobalFetching(false)); };
    }, [isFetching, isWidgetsFetching, isHeadersFetching, isTabsFetching, skip, dispatch]);

    const [triggerExport] = useLazyExportBankDepositsQuery();

    const handleExport = useCallback(async (formatType: typeof EXPORT_FORMATS.PDF | typeof EXPORT_FORMATS.XLSX) => {
        try {
            dispatch(setActiveExportType(formatType));
            const result = await triggerExport({
                startDate: queryParams.fromDate,
                endDate: queryParams.toDate,
                icanManageId: Number(userId),
                clientName: selectedTenant?.displayName?.toLowerCase() || DEFAULT_CLIENT_NAME,
                hospitalId: selectedEntityId === 'all' ? 0 : Number(selectedEntityId),

            }).unwrap();

            if (result !== undefined) {
                downloadFileFromBlob(
                    result,
                    `Bank_Deposits_Report_${formatDateForFilename(queryParams.fromDate)}_to_${formatDateForFilename(queryParams.toDate)}.${formatType}`
                );
            }
        } catch (err) {
            console.error('Bank Deposits Export failed:', err);
        } finally {
            dispatch(setActiveExportType(null));
        }
    }, [dispatch, queryParams.fromDate, queryParams.toDate, userId, selectedTenant, triggerExport, selectedEntityId]);

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

    useEffect(() => {
        if (actionTriggers.reload > reloadCount.current) {
            refetch();
            reloadCount.current = actionTriggers.reload;
        }
    }, [actionTriggers.reload, refetch]);

    const bankDeposits: BankDepositItem[] = useMemo(() => {
        if (Array.isArray(data)) return data as BankDepositItem[];
        const responseData = data as unknown as Record<string, unknown>;
        if (responseData && typeof responseData === 'object' && 'data' in responseData && Array.isArray(responseData.data)) {
            return responseData.data as BankDepositItem[];
        }
        return [];
    }, [data]);

    const totalElements = useMemo(() => {
        const list = bankDeposits;
        if (!list || list.length === 0) return 0;
        return list[0]?.totalRows || list.length;
    }, [bankDeposits]);




    const [rowHistory, setRowHistory] = useState<Record<string, { data: RowHistoryData, isLoading: boolean }>>({});
    const [triggerGetHistory] = useLazyGetBaiTriggerHistoryQuery();

    const fetchRowHistory = useCallback(async (transactionNo: string) => {
        if (rowHistory[transactionNo]?.data) return;

        setRowHistory(prev => ({ ...prev, [transactionNo]: { ...prev[transactionNo], isLoading: true } }));
        try {
            // Find the item to get its current status for the pageFlag
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

    const filteredDeposits = useMemo(() => {
        if (selectedEntityId === 'all') {
            return [{
                id: 'all',
                name: 'All Entities',
                items: bankDeposits,
                totalItems: totalElements
            }];
        }

        const foundEntity = entities.find(e => e.id === selectedEntityId);
        const entityLabel = foundEntity?.name || 'Selected Entity';

        return [{
            id: selectedEntityId,
            name: entityLabel,
            items: bankDeposits,
            totalItems: totalElements
        }];
    }, [bankDeposits, selectedEntityId, entities, totalElements]);

    const summaryStats = useMemo(() => {
        const summaryData = widgetData?.data;
        if (summaryData) {
            const { totalBaiAmount, actionRequiredCount, reconciliationRatePercentage } = summaryData;
            return {
                totalBankAmt: totalBaiAmount,
                reconRate: (reconciliationRatePercentage || 0).toFixed(2),
                exceptions: actionRequiredCount
            };
        }

        let totalItems = 0;
        let exceptions = 0;
        let totalBankAmt = 0;

        filteredDeposits.forEach(entity => {
            totalItems += entity.items.length;
            entity.items.forEach((item: BankDepositItem) => {
                totalBankAmt += item.baiAmount;
                if (item.reconciliationStatus === 'Exception' || item.varianceAmount !== 0) exceptions++;
            });
        });

        const reconRate = totalItems > 0 ? (((totalItems - exceptions) / totalItems) * 100).toFixed(2) : '100.00';
        return { totalBankAmt, reconRate, exceptions };
    }, [filteredDeposits, widgetData]);

    const handleRangeChange = useCallback((range: string) => {
        if (range.includes(' to ')) {
            const [from, to] = range.split(' to ');
            setQueryParams(prev => ({ ...prev, fromDate: from, toDate: to, page: 0 }));
            dispatch(setGlobalFilters({ fromDate: from, toDate: to, rangeLabel: 'Custom' }));
        } else {
            const dates = calculateDatesFromLabel(range);
            if (dates) {
                setQueryParams(prev => ({ ...prev, fromDate: dates.from, toDate: dates.to, page: 0 }));
                dispatch(setGlobalFilters({ fromDate: dates.from, toDate: dates.to, rangeLabel: range }));
            }
        }
    }, [dispatch]);

    const handleSortChange = useCallback((colId: string, direction: 'asc' | 'desc') => {
        setQueryParams(prev => ({ ...prev, sortField: colId, sortOrder: direction, page: 0 }));
    }, []);

    const onPageChange = useCallback((p: number) => setQueryParams(prev => ({ ...prev, page: p })), []);
    const onRowsPerPageChange = useCallback((s: number) => setQueryParams(prev => ({ ...prev, size: s, page: 0 })), []);

    const handleSearch = useCallback((term: string) => {
        setSearchTerm(term);
        setQueryParams(prev => ({ ...prev, transactionNo: term, page: 0 }));
    }, []);

    const handleFilterChange = useCallback((newFilters: Partial<typeof filters>) => {
        setFilters(prev => ({ ...prev, ...newFilters }));
        setQueryParams(prev => ({ ...prev, page: 0 }));
    }, []);

    return {
        bankDeposits,
        filteredDeposits,
        totalElements,
        queryParams,
        searchTerm,
        setSearchTerm,
        onSearch: handleSearch,
        filters,
        setFilters: handleFilterChange,
        selectedEntityId,
        setSelectedEntityId,
        expandedRows,
        entities,
        exceptionsOnly,
        setExceptionsOnly,
        toggleRow,
        handleRangeChange,
        handleSortChange,
        onPageChange,
        onRowsPerPageChange,
        statusOptions,
        payerOptions,
        dynamicColumns,
        isError,
        isFetching: isFetching || isWidgetsFetching || isHeadersFetching || isTabsFetching,
        isHeadersSuccess,
        summaryData: widgetData?.data,
        rowHistory,
        globalFilters,
        summaryStats
    };
};
