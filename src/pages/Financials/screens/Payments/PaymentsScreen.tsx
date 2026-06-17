import React, { useMemo } from 'react';
import { Typography, InputAdornment } from '@mui/material';
import DataTable from '@/components/molecules/DataTable/DataTable';
import { DataColumn } from '@/components/molecules/DataTable/DataTable.hook';
import RangeDropdown from '@/components/atoms/RangeDropdown/RangeDropdown';
import StatusBadge from '@/components/atoms/StatusBadge/StatusBadge';
import RowActionMenu from '@/components/molecules/RowActionMenu/RowActionMenu';
import { PaymentTransaction } from '@/interfaces/financials';
import { formatCurrency, formatDate } from '@/utils/formatters';
import {
  ScreenWrapper,
  ToolbarWrapper,
  SearchField,
  MonospaceBox,
  SearchWrapper,
  StyledSearchIcon,
  SearchButton,
  _ErrorAlert,
} from './PaymentsScreen.styles';
import { usePaymentsScreen } from './PaymentsScreen.hook';

const PaymentsScreen: React.FC<{ skip?: boolean }> = ({ skip = false }) => {
  const {
    payments,
    totalElements,
    queryParams,
    globalFilters,
    handleDrillDown,
    handleRangeChange,
    handleFilterChange,
    handleSortChange,
    onPageChange,
    onRowsPerPageChange,
    statusOptions,
    statusOptionsLoading,
    statusOptionsError,
    payerOptions,
    searchTerm,
    setSearchTerm,
    onSearch,
    isFetching,
    // isError,
  } = usePaymentsScreen({ skip });

  const columns = useMemo<DataColumn<PaymentTransaction>[]>(
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
        accessor: (r) => r.effectiveDate ?? '',
        render: (r) => formatDate(r.effectiveDate),
      },
      {
        id: 'type',
        label: 'TYPE',
        minWidth: 90,
        accessor: (r) => r.type ?? '',
        render: (r) => r.type,
      },
      // { id: 'description', label: 'DESCRIPTION', minWidth: 200, accessor: (r) => r.description ?? '-', render: (r) => r.description ?? '-' },
      {
        id: 'transactionNo',
        label: 'TRANSACTION NO',
        minWidth: 220,
        align: 'center',
        accessor: (r) => r.transactionNo ?? '',
        render: (r) => <Typography variant="body2">{r.transactionNo}</Typography>,
      },
      {
        id: 'payer',
        label: 'PAYER',
        minWidth: 180,
        accessor: (r) => r.payer ?? '',
        filterOptions: payerOptions,
        render: (r) => r.payer,
      },
      {
        id: 'amount',
        label: 'AMOUNT',
        minWidth: 110,
        align: 'center',
        accessor: (r) => r.amount ?? null,
        render: (r) => <MonospaceBox>{formatCurrency(r.amount)}</MonospaceBox>,
      },
      {
        id: 'status',
        label: 'STATUS',
        minWidth: 120,
        accessor: (r) => r.status ?? '',
        filterOptions: statusOptions,
        isFilterLoading: statusOptionsLoading,
        filterError: statusOptionsError,
        render: (r) => <StatusBadge status={r.status} />,
      },
    ],
    [handleDrillDown, statusOptions, statusOptionsLoading, statusOptionsError, payerOptions],
  );

  return (
    <ScreenWrapper>
      {/* {isError && (
        <_ErrorAlert severity="error">
          Failed to load Payments transaction details. Please try reloading or contact support.
        </_ErrorAlert>
      )} */}
      <ToolbarWrapper>
        <SearchWrapper>
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
        </SearchWrapper>
      </ToolbarWrapper>
      <DataTable
        gridName="Payments"
        columns={columns}
        data={payments || []}
        rowKey={(r) => r.id ?? ''}
        exportTitle="Payments"
        customToolbarContent={
          <RangeDropdown value={globalFilters.rangeLabel} onChange={handleRangeChange} />
        }
        dictionaryId="payments"
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
    </ScreenWrapper>
  );
};

export default PaymentsScreen;
