import React, { useMemo } from 'react';
import { Box, Typography, InputAdornment } from '@mui/material';
import DataTable from '@/components/molecules/DataTable/DataTable';
import { DataColumn } from '@/components/molecules/DataTable/DataTable.hook';
import RangeDropdown from '@/components/atoms/RangeDropdown/RangeDropdown';
import StatusBadge from '@/components/atoms/StatusBadge/StatusBadge';
import RowActionMenu from '@/components/molecules/RowActionMenu/RowActionMenu';
import { RecoupmentRecord } from '@/interfaces/financials';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { useRecoupmentsScreen } from './RecoupmentsScreen.hook';
import {
  MonospaceBox,
  AmountText,
  BoldText,
  ToolbarWrapper,
  SearchField,
  PageContainer,
  SearchWrapper,
  StyledSearchIcon,
  SearchButton,
} from './RecoupmentsScreen.styles';

const RecoupmentsScreen: React.FC<{ skip?: boolean }> = ({ skip = false }) => {
  const {
    recoupments,
    totalElements,
    queryParams,
    payerOptions,
    handleDrillDown,
    handleRangeChange,
    handleFilterChange,
    handleSortChange,
    onPageChange,
    onRowsPerPageChange,
    searchTerm,
    setSearchTerm,
    onSearch,
    payerOptionsLoading,
    payerOptionsError,
    globalFilters,
    isFetching,
  } = useRecoupmentsScreen({ skip });

  const columns = useMemo<DataColumn<RecoupmentRecord>[]>(
    () => [
      {
        id: 'actions',
        label: 'ACTIONS',
        minWidth: 60,
        render: (r) => <RowActionMenu onView={() => handleDrillDown(r)} />,
        align: 'center',
      },
      {
        id: 'recoupmentId',
        label: 'RECOUPMENT ID',
        minWidth: 140,
        accessor: (r) => r.recoupmentId,
        render: (r) => <BoldText variant="body2">{r.recoupmentId}</BoldText>,
      },
      {
        id: 'transactionNo',
        label: 'TRANSACTION NO',
        minWidth: 160,
        accessor: (r) => r.transactionNo ?? '-',
        render: (r) => r.transactionNo ?? '-',
      },
      {
        id: 'payer',
        label: 'PAYER',
        minWidth: 140,
        accessor: (r) => r.payer,
        filterOptions: payerOptions,
        isFilterLoading: payerOptionsLoading,
        filterError: payerOptionsError,
        render: (r) => r.payer,
      },
      {
        id: 'claim',
        label: 'CLAIM / PATIENT',
        minWidth: 180,
        accessor: (r) => r.claimPatient,
        render: (r) => (
          <Box>
            <Typography variant="caption" color="text.secondary">
              {r.claimPatient}
            </Typography>
          </Box>
        ),
      },
      {
        id: 'originalPaymentAmount',
        label: 'ORIG. PAYMENT',
        minWidth: 120,
        accessor: (r) => r.originalPaymentAmount,
        render: (r) => <MonospaceBox>{formatCurrency(r.originalPaymentAmount)}</MonospaceBox>,
      },
      {
        id: 'recoupmentAmount',
        label: 'RECOUPMENT AMT',
        minWidth: 130,
        accessor: (r) => r.recoupmentAmount,
        render: (r) => (
          <AmountText variant="body2">{formatCurrency(r.recoupmentAmount)}</AmountText>
        ),
      },
      {
        id: 'recoupmentDate',
        label: 'DATE',
        minWidth: 110,
        accessor: (r) => r.recoupmentDate,
        render: (r) => formatDate(r.recoupmentDate),
      },
      {
        id: 'status',
        label: 'STATUS',
        minWidth: 120,
        accessor: (r) => r.status,
        render: (r) => <StatusBadge status={r.status} />,
      },
    ],
    [handleDrillDown, payerOptions, payerOptionsLoading, payerOptionsError],
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
        gridName="Recoupments"
        columns={columns}
        data={recoupments || []}
        rowKey={(r) => r.id}
        exportTitle="Recoupments"
        customToolbarContent={
          <RangeDropdown value={globalFilters.rangeLabel} onChange={handleRangeChange} />
        }
        dictionaryId="recoupments"
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

export default RecoupmentsScreen;
