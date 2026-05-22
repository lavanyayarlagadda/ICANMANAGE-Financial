import { useState, useMemo, useCallback, useEffect } from 'react';
import { useAppSelector, useAppDispatch, RootState } from '@/store';
import { setIsGlobalFetching } from '@/store/slices/uiSlice';
import { useSearchPlbDetailsQuery } from '@/store/api/transactionsApi';
import { useGetAllTransactionsFiltersQuery, useGetUserMappedBrandsQuery } from '@/store/api/financialsApi';
import { useUserPermissions } from '@/hooks/useUserPermissions';
import { setGlobalFilters } from '@/store/slices/financialsSlice';
import { calculateDatesFromLabel } from '@/utils/dateUtils';
import { formatDate } from '@/utils/formatters';
import { SORT_ORDER, DEFAULT_PAGE_SIZE } from '@/constants/common';

export const useFbRecoupScreen = ({ skip = false }: { skip?: boolean } = {}) => {
    const dispatch = useAppDispatch();
    const { globalFilters } = useAppSelector((s: RootState) => s.financials);
    const { tenants, selectedTenantId } = useAppSelector((s: RootState) => s.tenant);
    const { user } = useUserPermissions();
    const icanManageId = Number(user?.id) || 272;

    const activeTenant = useMemo(() => 
        tenants.find(t => t.tenantId === selectedTenantId),
        [tenants, selectedTenantId]
    );

    const isCareHospice = useMemo(() => {
        const tenantName = activeTenant?.displayName?.toLowerCase() || '';
        const userCompany = user?.company?.toLowerCase() || '';
        return tenantName.includes('carehospice') || userCompany.includes('carehospice');
    }, [activeTenant, user]);

    const [queryParams, setQueryParams] = useState({
        page: 0,
        size: DEFAULT_PAGE_SIZE,
        sortField: 'date',
        sortOrder: SORT_ORDER.DESC as 'asc' | 'desc',
        fromDate: globalFilters.fromDate,
        toDate: globalFilters.toDate,
        payers: [] as string[],
        ptanNumbers: [] as string[],
        transactionNumber: '',
        brands: [] as string[],
        status: 'Active' as 'Active' | 'Reconciled',
    });

    const [searchTerm, setSearchTerm] = useState('');
    const [filterPayor, setFilterPayor] = useState('All');
    const [filterNpiPtan, setFilterNpiPtan] = useState('');
    const [filterStateBrand, setFilterStateBrand] = useState('All');

    const handleSearch = useCallback(() => {
        setQueryParams(prev => ({
            ...prev,
            transactionNumber: searchTerm,
            payers: filterPayor === 'All' || filterPayor === '' ? [] : [filterPayor],
            ptanNumbers: filterNpiPtan ? [filterNpiPtan] : [],
            brands: filterStateBrand === 'All' || filterStateBrand === '' ? [] : [filterStateBrand],
            page: 0
        }));
    }, [searchTerm, filterPayor, filterNpiPtan, filterStateBrand]);

    const handleFilterPayorChange = useCallback((value: string) => {
        setFilterPayor(value);
        setQueryParams(prev => ({
            ...prev,
            payers: value === 'All' || value === '' ? [] : [value],
            page: 0
        }));
    }, []);

    const handleFilterStateBrandChange = useCallback((value: string) => {
        setFilterStateBrand(value);
        setQueryParams(prev => ({
            ...prev,
            brands: value === 'All' || value === '' ? [] : [value],
            page: 0
        }));
    }, []);

    const clearFilters = useCallback(() => {
        setSearchTerm('');
        setFilterPayor('All');
        setFilterNpiPtan('');
        setFilterStateBrand('All');
        setQueryParams(prev => ({
            ...prev,
            transactionNumber: '',
            payers: [],
            ptanNumbers: [],
            brands: [],
            page: 0
        }));
    }, []);

    // Handle auto-reset when search term is cleared from text field (optional behavior)
    useEffect(() => {
        if (searchTerm === '' && queryParams.transactionNumber !== '') {
            setQueryParams(prev => ({ ...prev, transactionNumber: '', page: 0 }));
        }
    }, [searchTerm, queryParams.transactionNumber]);

    // Sync local queryParams with global filters
    useEffect(() => {
        setQueryParams(prev => ({
            ...prev,
            fromDate: globalFilters.fromDate,
            toDate: globalFilters.toDate,
            page: 0
        }));
    }, [globalFilters.fromDate, globalFilters.toDate]);

    // Format dates for API request (YYYY-MM-DD -> MM/DD/YYYY)
    const requestFromDate = useMemo(() => formatDate(queryParams.fromDate), [queryParams.fromDate]);
    const requestToDate = useMemo(() => formatDate(queryParams.toDate), [queryParams.toDate]);

    const { data: noticeData, isFetching: isFetchingNotices, isError: isErrorNotices, refetch: refetchNotices } = useSearchPlbDetailsQuery({
        fromDate: requestFromDate,
        toDate: requestToDate,
        payers: queryParams.payers,
        ptanNumbers: queryParams.ptanNumbers,
        transactionNumber: queryParams.transactionNumber,
        brands: queryParams.brands,
        status: queryParams.status,
        icanManageId,
        offset: queryParams.page * queryParams.size,
        limit: queryParams.size,
        sortColumn: queryParams.sortField === 'date' ? 'chkdate' : queryParams.sortField,
        sortDir: queryParams.sortOrder.toUpperCase() as 'ASC' | 'DESC'
    }, { skip });

    const { data: filterData } = useGetAllTransactionsFiltersQuery(undefined, { skip });
    const payerOptions = useMemo(() => filterData?.data?.payers?.map(p => ({ label: p.payerName, value: String(p.payerId) })) || [], [filterData]);

    const { data: userBrandsData } = useGetUserMappedBrandsQuery({
        icanManageId,
        facilityMasterId: 0
    }, { skip });

    const brandOrStateOptions = useMemo(() => {
        return userBrandsData?.data?.map(b => ({
            label: b.hospitalAbbr,
            value: String(b.fkHospitalMasterId)
        })) || [];
    }, [userBrandsData]);

    useEffect(() => {
        if (skip) {
            dispatch(setIsGlobalFetching(false));
            return;
        }
        dispatch(setIsGlobalFetching(isFetchingNotices));
        return () => { dispatch(setIsGlobalFetching(false)); };
    }, [isFetchingNotices, skip, dispatch]);

    const plbDetails = useMemo(() => {
        const rawContent = noticeData?.data ?? [];
        return rawContent.map((item) => ({
            id: String(item.plbId),
            date: item.chkDate,
            transactionNo: item.chkTrnNo,
            type: item.paymentType,
            state: item.brand || '',
            payor: item.payerName,
            npi: isCareHospice ? item.ptanNo : item.npi,
            identifier: item.plbIdentifier,
            amount: item.plbAmount,
            suspenseBalance: item.totalAdjustment ?? 0,
            status: item.chequeStatus || 'Active',
            associatedEraFiles: item.children?.map((child) => ({
                transactionNo: child.chkTrnNo,
                npi: child.NPI,
                remitDate: child.chkDate,
                amount: child.plbAmount
            })) || []
        }));
    }, [noticeData, isCareHospice]);

    const totalElements = useMemo(() => {
        const rawContent = noticeData?.data ?? [];
        return rawContent[0]?.totalCount ?? 0;
    }, [noticeData]);

    const stats = useMemo(() => {
        const firstRecord = noticeData?.data?.[0];
        const totalOriginalAmount = firstRecord?.totalOrginalAmount ?? firstRecord?.totalOriginalAmount ?? 0;
        const totalRemainingAmount = firstRecord?.totalRemainingAmount ?? firstRecord?.totalRemainingBalance ?? 0;
        const actionRequired = firstRecord?.actionRequired ?? 0;
        return {
            totalOriginalAmount,
            totalRemainingAmount,
            actionRequired,
            activeCount: totalElements
        };
    }, [noticeData, totalElements]);

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

    const handleFilterChange = useCallback((filters: Record<string, string>) => {
    if (Object.keys(filters).length === 0) {
      clearFilters();
      return;
    }
    
    let newPayor = filterPayor;
    let newStateBrand = filterStateBrand;

    // Update local filter states based on column filters
    if (filters.payor !== undefined) {
      newPayor = filters.payor || 'All';
      setFilterPayor(newPayor);
    }
    if (filters.state !== undefined) {
      newStateBrand = filters.state || 'All';
      setFilterStateBrand(newStateBrand);
    }
    // Update queryParams for server-side filtering
    const payers = newPayor && newPayor !== 'All' && newPayor !== '' ? [newPayor] : [];
    const brands = newStateBrand && newStateBrand !== 'All' && newStateBrand !== '' ? [newStateBrand] : [];
    setQueryParams(prev => ({
      ...prev,
      payers,
      brands,
      page: 0,
    }));
  }, [clearFilters, filterPayor, filterStateBrand]);

    return {
        setQueryParams,
        plbDetails,
        totalElements,
        queryParams,
        globalFilters,
        searchTerm,
        setSearchTerm,
        filterPayor,
        setFilterPayor,
        handleFilterPayorChange,
        filterNpiPtan,
        setFilterNpiPtan,
        filterStateBrand,
        setFilterStateBrand,
        handleFilterStateBrandChange,
        brandOrStateOptions,
        onSearch: handleSearch,
        applyFilters: handleSearch,
        clearFilters,
        handleRangeChange,
        handleSortChange,
        onPageChange,
        onRowsPerPageChange,
        handleFilterChange,
        payerOptions,
        stats,
        isFetching: isFetchingNotices,
        isError: isErrorNotices,
        refetchNotices,
        isCareHospice
    };
};

export const useFbRecoupTable = () => {
    const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

    const toggleRow = useCallback((id: string) => {
        setExpandedRows((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return newSet;
        });
    }, []);

    return {
        expandedRows,
        toggleRow
    };
};
