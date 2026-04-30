import { useMemo } from 'react';
import { useAppSelector } from '@/store';
import { useUserPermissions } from '@/hooks/useUserPermissions';
import { useBankDepositFilters } from './sub-hooks/useBankDepositFilters';
import { useBankDepositData } from './sub-hooks/useBankDepositData';
import { useBankDepositActions } from './sub-hooks/useBankDepositActions';
import { useBankDepositHistory } from './sub-hooks/useBankDepositHistory';

export const useBankDepositsScreen = ({ skip = false }: { skip?: boolean } = {}) => {
    // 1. Core Permissions and Tenant State
    const { user, isCognitiveUser } = useUserPermissions();
    const tenant = useAppSelector(s => s.tenant);
    const userId = user?.id || '';

    const selectedTenant = useMemo(() =>
        tenant.tenants.find(t => t.tenantId === tenant.selectedTenantId),
        [tenant.tenants, tenant.selectedTenantId]);

    // 2. Sub-hook: Filters & Query Params
    const filterState = useBankDepositFilters();
    const { queryParams, filters, selectedEntityId } = filterState;

    // 3. Sub-hook: Data Fetching & Processing
    const dataState = useBankDepositData({
        skip,
        userId,
        isCognitiveUser,
        selectedTenantId: tenant.selectedTenantId,
        selectedTenant,
        selectedEntityId,
        queryParams,
        filters
    });

    // 4. Sub-hook: Actions (Export, Print, Reload)
    const { handleExport } = useBankDepositActions({
        queryParams,
        userId,
        selectedTenant,
        selectedEntityId,
        refetch: dataState.refetch
    });

    // 5. Sub-hook: Row History & Expansion
    const historyState = useBankDepositHistory(selectedTenant);

    // 6. Final Composition
    return {
        // Data & Processed State
        bankDeposits: dataState.bankDeposits,
        filteredDeposits: dataState.filteredDeposits,
        totalElements: dataState.totalElements,
        summaryStats: dataState.summaryStats,
        summaryData: dataState.summaryData,
        payerOptions: dataState.payerOptions,
        statusOptions: dataState.statusOptions,
        dynamicColumns: dataState.dynamicColumns,
        entities: dataState.entities,
        isFetching: dataState.isFetching,
        isError: dataState.isError,
        isHeadersSuccess: dataState.isHeadersSuccess,

        // Filter State & Handlers
        queryParams,
        searchTerm: filterState.searchTerm,
        setSearchTerm: filterState.setSearchTerm,
        onSearch: filterState.handleSearch,
        filters,
        setFilters: filterState.setFilters,
        selectedEntityId,
        setSelectedEntityId: filterState.setSelectedEntityId,
        exceptionsOnly: filterState.exceptionsOnly,
        setExceptionsOnly: filterState.setExceptionsOnly,
        handleRangeChange: filterState.handleRangeChange,
        handleSortChange: filterState.handleSortChange,
        onPageChange: filterState.onPageChange,
        onRowsPerPageChange: filterState.onRowsPerPageChange,

        // Action Handlers
        handleExport,

        // History & Expansion State
        expandedRows: historyState.expandedRows,
        rowHistory: historyState.rowHistory,
        toggleRow: historyState.toggleRow,

        // Global State
        globalFilters: filterState.globalFilters
    };
};
