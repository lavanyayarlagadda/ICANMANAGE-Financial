import React, { useMemo } from 'react';
import { InputAdornment } from '@mui/material';
import DataTable from '@/components/molecules/DataTable/DataTable';
import { DataColumn } from '@/components/molecules/DataTable/DataTable.hook';
import RangeDropdown from '@/components/atoms/RangeDropdown/RangeDropdown';
import StatusBadge from '@/components/atoms/StatusBadge/StatusBadge';
import RowActionMenu from '@/components/molecules/RowActionMenu/RowActionMenu';
import { OtherAdjustmentRecord } from '@/interfaces/financials';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { useOtherAdjustmentsScreen } from './OtherAdjustmentsScreen.hook';
import {
  AdjustmentChip,
  AmountText,
  ToolbarWrapper,
  SearchField,
  AdjustmentIdText,
  PageContainer,
  SearchWrapper,
  StyledSearchIcon,
  SearchButton,
} from './OtherAdjustmentsScreen.styles';

const OtherAdjustmentsScreen: React.FC<{ skip?: boolean }> = ({ skip = false }) => {
  const {
    adjustments,
    totalElements,
    queryParams,
    payerOptions,
    // typeOptions,
    handleDrillDown,
    handleRangeChange,
    handleFilterChange,
    handleSortChange,
    onPageChange,
    onRowsPerPageChange,
    searchTerm,
    setSearchTerm,
    onSearch,
    globalFilters,
    isFetching,
    // isError,
  } = useOtherAdjustmentsScreen({ skip });

  const columns = useMemo<DataColumn<OtherAdjustmentRecord>[]>(
    () => [
      {
        id: 'actions',
        label: 'ACTIONS',
        minWidth: 60,
        render: (r) => <RowActionMenu onView={() => handleDrillDown(r)} />,
      },
      {
        id: 'adjustmentId',
        label: 'Adjustment ID',
        minWidth: 160,
        accessor: (r) => r.adjustmentId,
        render: (r) => <AdjustmentIdText variant="body2">{r.adjustmentId}</AdjustmentIdText>,
      },
      {
        id: 'transactionNo',
        label: 'TRANSACTION NO',
        minWidth: 160,
        accessor: (r) => r.transactionNo ?? '-',
        render: (r) => r.transactionNo ?? '-',
      },
      {
        id: 'effectiveDate',
        label: 'EFFECTIVE DATE',
        minWidth: 120,
        accessor: (r) => r.effectiveDate,
        render: (r) => formatDate(r.effectiveDate),
      },
      {
        id: 'type',
        label: 'TYPE',
        minWidth: 140,
        accessor: (r) => r.type,
        // filterOptions: ['WRITE-OFF', 'CREDIT', 'INTEREST', 'CONTRACTUAL', 'REFUND', 'TRANSFER', 'RECLASSIFICATION', 'CHARITY'],
        render: (r) => <AdjustmentChip label={r.type} size="small" adjType={r.type} />,
      },
      {
        id: 'payer',
        label: 'PAYER',
        minWidth: 160,
        accessor: (r) => r.sourceProvider,
        filterOptions: payerOptions,
        render: (r) => r.sourceProvider,
      },
      {
        id: 'amount',
        label: 'AMOUNT',
        minWidth: 120,
        accessor: (r) => r.amount,
        render: (r) => (
          <AmountText variant="body2" amount={r.amount}>
            {formatCurrency(r.amount)}
          </AmountText>
        ),
      },
      {
        id: 'referenceId',
        label: 'REFERENCE ID',
        minWidth: 110,
        accessor: (r) => r.referenceId,
        render: (r) => r.referenceId,
      },
      {
        id: 'status',
        label: 'STATUS',
        minWidth: 120,
        accessor: (r) => r.status,
        render: (r) => <StatusBadge status={r.status} />,
      },
    ],
    [handleDrillDown, payerOptions],
  );

  return (
    <PageContainer>
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
        gridName="Other Adjustments"
        columns={columns}
        data={adjustments || []}
        rowKey={(r) => r.id}
        exportTitle="Other Adjustments"
        customToolbarContent={
          <RangeDropdown value={globalFilters.rangeLabel} onChange={handleRangeChange} />
        }
        dictionaryId="other-adjustments"
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
    </PageContainer>
  );
};

export default OtherAdjustmentsScreen;
