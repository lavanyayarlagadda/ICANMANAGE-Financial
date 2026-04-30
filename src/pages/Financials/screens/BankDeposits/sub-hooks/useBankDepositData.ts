import { useMemo, useEffect } from 'react';
import { useAppDispatch } from '@/store';
import { setIsGlobalFetching } from '@/store/slices/uiSlice';
import { 
    useSearchBankDepositsBodyQuery, 
    useGetBankDepositWidgetsQuery, 
    useGetMappedHeadersDataQuery, 
    useGetUserMappedBrandsQuery, 
    useGetAllTransactionsFiltersQuery 
} from '@/store/api/financialsApi';
import { skipToken } from '@reduxjs/toolkit/query/react';
import { calculateBankDepositSummary } from '@/utils/calculations';
import { SORT_ORDER, DEFAULT_CLIENT_NAME } from '@/constants/common';
import { BankDepositItem } from '@/interfaces/financials';

interface DataParams {
    skip?: boolean;
    userId: string;
    isCognitiveUser: boolean | undefined;
    selectedTenantId: string | null;
    selectedTenant: { displayName?: string } | undefined;
    selectedEntityId: string;
    queryParams: {
        fromDate: string;
        toDate: string;
        transactionNo: string;
        page: number;
        size: number;
        sortField: string;
        sortOrder: 'asc' | 'desc';
    };
    filters: {
        payerList: string[];
        stateList: string[];
        transactionsList: string[];
        accountList: string[];
        batchOwnerIds: string[];
        status: string | null;
    };
}

export const useBankDepositData = ({
    skip = false,
    userId,
    isCognitiveUser,
    selectedTenantId,
    selectedTenant,
    selectedEntityId,
    queryParams,
    filters
}: DataParams) => {
    const dispatch = useAppDispatch();

    // Sequential Fetching: Base conditions
    const isBaseReady = !skip && !!userId;
    const isTenantReady = !isCognitiveUser || !!selectedTenantId;

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

    const summaryStats = useMemo(() => 
        calculateBankDepositSummary(filteredDeposits, widgetData?.data),
    [filteredDeposits, widgetData]);

    return {
        bankDeposits,
        filteredDeposits,
        totalElements,
        summaryStats,
        summaryData: widgetData?.data,
        payerOptions,
        statusOptions,
        dynamicColumns,
        entities,
        isFetching: isFetching || isWidgetsFetching || isHeadersFetching || isTabsFetching,
        isError,
        isHeadersSuccess,
        refetch
    };
};
