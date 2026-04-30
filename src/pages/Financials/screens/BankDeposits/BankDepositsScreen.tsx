import React, { useCallback } from 'react';
import {
    Box,
    Typography,
    useTheme,
    InputAdornment,
    Button
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { BankDepositItem } from '@/interfaces/financials';
import DataTable from '@/components/molecules/DataTable/DataTable';
import RangeDropdown from '@/components/atoms/RangeDropdown/RangeDropdown';
import {
    ScreenWrapper,
    ScreenHeader,
    ToolbarWrapper,
    SearchField,
    EntitySectionHeader,
} from './BankDepositsScreen.styles';
import { useBankDepositsScreen } from './BankDepositsScreen.hook';
import { useBankDepositColumns } from './useBankDepositColumns';

import BankDepositSummary from './components/BankDepositSummary';
import BankDepositTabs from './components/BankDepositTabs';
import BankDepositExpandedContent from './components/BankDepositExpandedContent';

const BankDepositsScreen: React.FC<{ skip?: boolean }> = ({ skip = false }) => {
    const theme = useTheme();
    const {
        filteredDeposits,
        queryParams,
        searchTerm,
        setSearchTerm,
        setFilters,
        selectedEntityId,
        setSelectedEntityId,
        expandedRows,
        entities,
        toggleRow,
        handleRangeChange,
        handleSortChange,
        onPageChange,
        onRowsPerPageChange,
        statusOptions,
        payerOptions,
        dynamicColumns,
        isHeadersSuccess,
        onSearch,
        rowHistory,
        globalFilters,
        isFetching,
        summaryStats
    } = useBankDepositsScreen({ skip });

    const { columns } = useBankDepositColumns({
        expandedRows,
        toggleRow,
        dynamicColumns,
        isHeadersSuccess,
        payerOptions,
        statusOptions,
    });

    const renderExpandedContent = useCallback((item: BankDepositItem) => {
        const history = rowHistory[item.transactionNo];
        const { data: historyData, isLoading } = history || { data: null, isLoading: false };
        return <BankDepositExpandedContent historyData={historyData} isLoading={isLoading} />;
    }, [rowHistory]);

    return (
        <ScreenWrapper>
            <ScreenHeader>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>Bank Deposit Reconciliation</Typography>
                <Typography variant="body2" color="text.secondary">Match bank deposits to remittances and track their posting status across various systems.</Typography>
            </ScreenHeader>

            <BankDepositTabs
                entities={entities}
                selectedEntityId={selectedEntityId}
                onEntityChange={setSelectedEntityId}
            />

            <ToolbarWrapper>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    <SearchField
                        size="small"
                        placeholder="Search by Check"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && onSearch(searchTerm)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon sx={{ fontSize: 18, color: theme.palette.primary.main }} />
                                </InputAdornment>
                            ),
                        }}
                    />
                    <Button
                        variant="contained"
                        size="small"
                        onClick={() => onSearch(searchTerm)}
                        sx={{ height: '36px', borderRadius: '8px', textTransform: 'none', fontWeight: 600 }}
                    >
                        Search
                    </Button>
                </Box>
            </ToolbarWrapper>

            <BankDepositSummary
                totalBankAmt={summaryStats.totalBankAmt}
                reconRate={summaryStats.reconRate}
                exceptions={summaryStats.exceptions}
            />

            {filteredDeposits.map((entity) => (
                <Box key={entity.id} sx={{ mb: 4 }}>
                    <EntitySectionHeader>
                        <Typography variant="body2" sx={{ fontWeight: 700, color: theme.palette.text.primary }}>{entity.name} — {entity.items.length} Items</Typography>
                    </EntitySectionHeader>
                    <DataTable
                        columns={columns}
                        data={entity.items}
                        rowKey={(row) => row.transactionNo}
                        expandedRows={expandedRows}
                        expandedContent={renderExpandedContent}
                        paginated={true}
                        searchable={false}
                        customToolbarContent={<RangeDropdown value={globalFilters.rangeLabel} onChange={handleRangeChange} />}
                        dictionaryId="bank-deposits"
                        serverSide
                        sortCol={queryParams.sortField}
                        sortDir={queryParams.sortOrder}
                        onSortChange={handleSortChange}
                        page={queryParams.page}
                        rowsPerPage={queryParams.size}
                        totalElements={entity.totalItems || 0}
                        onPageChange={onPageChange}
                        onRowsPerPageChange={onRowsPerPageChange}
                        onFilterChange={(newFilters) => {
                            const filterKeys = Object.keys(newFilters);
                            const statusKey = filterKeys.find(k => k.toLowerCase().includes('status'));
                            const payerKey = filterKeys.find(k => k.toLowerCase().includes('payer') || k.toLowerCase().includes('payor'));
                            const transKey = filterKeys.find(k => k.toLowerCase().includes('transactiontype') || k.toLowerCase().includes('transtype'));
                            const accountKey = filterKeys.find(k => k.toLowerCase().includes('account'));

                            setFilters({
                                status: statusKey ? newFilters[statusKey] : null,
                                payerList: (payerKey && newFilters[payerKey]) ? [newFilters[payerKey]] : [],
                                transactionsList: (transKey && newFilters[transKey]) ? [newFilters[transKey]] : [],
                                accountList: (accountKey && newFilters[accountKey]) ? [newFilters[accountKey]] : [],
                            });
                        }}
                        download={false}
                        loading={isFetching}
                    />
                </Box>
            ))}

            {isHeadersSuccess && columns.length <= 1 && filteredDeposits.length === 0 && (
                <Box sx={{ p: 4, textAlign: 'center', backgroundColor: theme.palette.action.hover, borderRadius: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                        No configurable columns found for this entity. Please contact support.
                    </Typography>
                </Box>
            )}
        </ScreenWrapper>
    );
};

export default BankDepositsScreen;
