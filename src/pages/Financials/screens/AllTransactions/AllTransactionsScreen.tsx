import React, { useMemo } from 'react';
import { Box, InputAdornment } from '@mui/material';
import DataTable from '@/components/molecules/DataTable/DataTable';
import { DataColumn } from '@/components/molecules/DataTable/DataTable.hook';
import RangeDropdown from '@/components/atoms/RangeDropdown/RangeDropdown';
import StatusBadge from '@/components/atoms/StatusBadge/StatusBadge';
import RowActionMenu from '@/components/molecules/RowActionMenu/RowActionMenu';
import { AllTransaction } from '@/interfaces/financials';
import { formatCurrency, formatDate } from '@/utils/formatters';
import {
  ToolbarWrapper,
  SearchField,
  AmountText,
  CategoryChip,
  TransactionNoText,
  SearchContainer,
  StyledSearchIcon,
  SearchButton,
} from './AllTransactionsScreen.styles';
import { useAllTransactionsScreen } from './AllTransactionsScreen.hook';

const AllTransactionsScreen: React.FC<{ skip?: boolean }> = ({ skip = false }) => {
  const {
    filteredTransactions,
    totalElements,
    queryParams,
    handleDrillDown,
    handleRangeChange,
    handleFilterChange,
    handleSortChange,
    onPageChange,
    onRowsPerPageChange,
    statusOptions,
    payerOptions,
    transactionTypeOptions,
    categoryOptions,
    statusOptionsLoading,
    statusOptionsError,
    filterOptionsLoading,
    filterOptionsError,
    isFetching,
    globalFilters,
    searchTerm,
    setSearchTerm,
    onSearch,
  } = useAllTransactionsScreen({ skip });

  const columns = useMemo<DataColumn<AllTransaction>[]>(
    () => [
      {
        id: 'actions',
        label: 'ACTIONS',
        minWidth: 60,
        render: (r) => <RowActionMenu onView={() => handleDrillDown(r)} />,
      },
      {
        id: 'effectiveDate',
        label: 'EFFECTIVE DATE',
        minWidth: 120,
        align: 'center',
        accessor: (r) => r.effectiveDate ?? '',
        render: (r) => formatDate(r.effectiveDate),
      },
      {
        id: 'transactionNo',
        label: 'TRANSACTION NO',
        minWidth: 170,
        disableHiding: true,
        accessor: (r) => r.transactionNo ?? '-',
        render: (r) => (
          <TransactionNoText variant="body2">{r.transactionNo ?? '-'}</TransactionNoText>
        ),
      },
      {
        id: 'transactionType',
        label: 'CATEGORY',
        minWidth: 140,
        align: 'center',
        accessor: (r) => r.category ?? '',
        filterOptions: categoryOptions,
        isFilterLoading: filterOptionsLoading,
        filterError: filterOptionsError,
        render: (r) => (
          <CategoryChip
            label={(r.category ?? '').replace('_', ' ')}
            size="small"
            category={r.category ?? ''}
          />
        ),
      },
      {
        id: 'type',
        label: 'TYPE',
        minWidth: 100,
        accessor: (r) => r.type ?? '',
        filterOptions: transactionTypeOptions,
        isFilterLoading: filterOptionsLoading,
        filterError: filterOptionsError,
        render: (r) => r.type,
      },
      // { id: 'description', label: 'DESCRIPTION', minWidth: 240, accessor: (r) => r.description ?? '', render: (r) => r.description },
      {
        id: 'payer',
        label: 'PAYER NAME',
        minWidth: 180,
        accessor: (r) => r.sourceProvider ?? '',
        filterOptions: payerOptions,
        isFilterLoading: filterOptionsLoading,
        filterError: filterOptionsError,
        render: (r) => r.sourceProvider,
      },
      {
        id: 'amount',
        label: 'AMOUNT',
        minWidth: 120,
        align: 'center',
        accessor: (r) => r.amount,
        render: (r) => (
          <AmountText variant="body2" amount={r.amount}>
            {formatCurrency(r.amount)}
          </AmountText>
        ),
      },
      {
        id: 'status',
        label: 'STATUS',
        minWidth: 120,
        align: 'center',
        accessor: (r) => r.status ?? '',
        filterOptions: statusOptions,
        isFilterLoading: statusOptionsLoading,
        filterError: statusOptionsError,

        render: (r) => <StatusBadge status={r.status} />,
      },
    ],
    [
      statusOptions,
      payerOptions,
      transactionTypeOptions,
      categoryOptions,
      filterOptionsLoading,
      filterOptionsError,
      statusOptionsLoading,
      statusOptionsError,
      handleDrillDown,
    ],
  );

  return (
    <Box>
      {/* {isError && (
                <Alert severity="error" sx={{ mb: 3, borderRadius: '8px' }}>
                    Failed to load All Transactions details. Please try reloading or contact support.
                </Alert>
            )} */}

      <ToolbarWrapper>
        <SearchContainer>
          <SearchField
            size="small"
            placeholder="Search by Transaction #"
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

      <DataTable
        gridName="All Transactions"
        columns={columns}
        data={filteredTransactions || []}
        rowKey={(r) => r.id ?? ''}
        exportTitle="All Transactions"
        customToolbarContent={
          <RangeDropdown value={globalFilters.rangeLabel} onChange={handleRangeChange} />
        }
        dictionaryId="all-transaction"
        serverSide
        totalElements={totalElements}
        page={queryParams.page}
        rowsPerPage={queryParams.size}
        sortCol={queryParams.sortField}
        sortDir={queryParams.sortOrder}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        onSortChange={handleSortChange}
        onFilterChange={handleFilterChange}
        download={false}
        loading={isFetching}
      />
    </Box>
  );
};

export default AllTransactionsScreen;
