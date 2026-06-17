import React, { useCallback } from 'react';
import { Typography, InputAdornment } from '@mui/material';
import { BankDepositItem } from '@/interfaces/financials';
import DataTable from '@/components/molecules/DataTable/DataTable';
import RangeDropdown from '@/components/atoms/RangeDropdown/RangeDropdown';
import {
  ScreenWrapper,
  ScreenHeader,
  HeaderTitle,
  ToolbarWrapper,
  SearchField,
  SearchContainer,
  StyledSearchIcon,
  SearchButton,
  EntityContainer,
  EntitySectionHeader,
  EntityTitleText,
  NoColumnsBox,
  _ErrorAlert,
} from './BankDepositsScreen.styles';
import { useBankDepositsScreen } from './BankDepositsScreen.hook';
import { useBankDepositColumns } from './useBankDepositColumns';

import BankDepositSummary from './components/BankDepositSummary';
import BankDepositTabs from './components/BankDepositTabs';
import BankDepositExpandedContent from './components/BankDepositExpandedContent';

const BankDepositsScreen: React.FC<{ skip?: boolean }> = ({ skip = false }) => {
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
    summaryStats,
    isMindpath,
  } = useBankDepositsScreen({ skip });

  const { columns } = useBankDepositColumns({
    expandedRows,
    toggleRow,
    dynamicColumns,
    isHeadersSuccess,
    payerOptions,
    statusOptions,
  });

  const renderExpandedContent = useCallback(
    (item: BankDepositItem, isMindpathFlag: boolean) => {
      const history = rowHistory[item.transactionNo];
      const { data: historyData, isLoading } = history || { data: null, isLoading: false };
      return (
        <BankDepositExpandedContent
          historyData={historyData}
          isLoading={isLoading}
          isMindPath={isMindpathFlag}
        />
      );
    },
    [rowHistory],
  );

  return (
    <ScreenWrapper>
      <ScreenHeader>
        <HeaderTitle variant="h6">Bank Deposit Reconciliation</HeaderTitle>
        <Typography variant="body2" color="text.secondary">
          Match bank deposits to remittances and track their posting status across various systems.
        </Typography>
      </ScreenHeader>
      {/* 
            {isError && (
                <_ErrorAlert severity="error">
                    Failed to load Bank Deposit Details. Please try reloading or contact support.
                </_ErrorAlert>
            )} */}

      <BankDepositTabs
        entities={entities}
        selectedEntityId={selectedEntityId}
        onEntityChange={setSelectedEntityId}
      />

      <ToolbarWrapper>
        <SearchContainer>
          <SearchField
            size="small"
            placeholder="Search by Check"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && onSearch(searchTerm)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <StyledSearchIcon />
                </InputAdornment>
              ),
            }}
          />
          <SearchButton
            variant="contained"
            size="small"
            disabled={!searchTerm}
            onClick={() => onSearch(searchTerm)}
          >
            Search
          </SearchButton>
        </SearchContainer>
      </ToolbarWrapper>

      <BankDepositSummary
        totalBankAmt={summaryStats.totalBankAmt}
        reconRate={summaryStats.reconRate}
        exceptions={summaryStats.exceptions}
      />

      {filteredDeposits.map((entity) => (
        <EntityContainer key={entity.id}>
          <EntitySectionHeader>
            <EntityTitleText variant="body2">
              {entity.name} — {entity.items.length} Items
            </EntityTitleText>
          </EntitySectionHeader>
          <DataTable
            gridName="Bank Deposits"
            tableName="Bank Deposits"
            userId="dummy_user_123"
            columns={columns}
            data={entity.items}
            rowKey={(row) => row.transactionNo}
            expandedRows={expandedRows}
            expandedContent={(item) => renderExpandedContent(item, isMindpath)}
            paginated={true}
            searchable={false}
            customToolbarContent={
              <RangeDropdown value={globalFilters.rangeLabel} onChange={handleRangeChange} />
            }
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
              const statusKey = filterKeys.find((k) => k.toLowerCase().includes('status'));
              const payerKey = filterKeys.find(
                (k) => k.toLowerCase().includes('payer') || k.toLowerCase().includes('payor'),
              );
              const transKey = filterKeys.find(
                (k) =>
                  k.toLowerCase().includes('transactiontype') ||
                  k.toLowerCase().includes('transtype'),
              );
              const accountKey = filterKeys.find((k) => k.toLowerCase().includes('account'));

              setFilters({
                status: statusKey ? newFilters[statusKey] : null,
                payerList: payerKey && newFilters[payerKey] ? [newFilters[payerKey]] : [],
                transactionsList: transKey && newFilters[transKey] ? [newFilters[transKey]] : [],
                accountList: accountKey && newFilters[accountKey] ? [newFilters[accountKey]] : [],
              });
            }}
            download={false}
            loading={isFetching}
          />
        </EntityContainer>
      ))}

      {isHeadersSuccess && columns.length <= 1 && filteredDeposits.length === 0 && (
        <NoColumnsBox>
          <Typography variant="body2" color="text.secondary">
            No configurable columns found for this entity. Please contact support.
          </Typography>
        </NoColumnsBox>
      )}
    </ScreenWrapper>
  );
};

export default BankDepositsScreen;
