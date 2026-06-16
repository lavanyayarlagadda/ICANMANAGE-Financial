import React, { useMemo, useCallback } from 'react';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import Accordion from '@/components/atoms/Accordion/Accordion';
import StatusBadge from '@/components/atoms/StatusBadge/StatusBadge';
import { PipRecord, NpiAllocation } from '@/interfaces/financials';
import DataTable from '@/components/molecules/DataTable/DataTable';
import { DataColumn } from '@/components/molecules/DataTable/DataTable.hook';
import RangeDropdown from '@/components/atoms/RangeDropdown/RangeDropdown';
import { IconButton, Chip, Grid, Button, CircularProgress, Box } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import MultiValueDisplay from '@/components/atoms/MultiValueDisplay/MultiValueDisplay';
import { formatCurrency, formatPercent, formatDate } from '@/utils/formatters';
import SummaryCard from '@/components/atoms/SummaryCard/SummaryCard';
import {
  ScreenWrapper,
  NpiSectionWrapper,
  NpiHeaderRow,
  NpiDataRow,
  SearchField,
  NpiSectionContainer,
  SummaryRowBox,
  PayerNameText,
  PaymentDetailsBox,
  NpiHeaderColText,
  ClaimIdText,
  NpiDataText,
  AppliedBalanceText,
  CenteredLoadingBox,
  NoDetailsText,
  FilterActionsWrapper,
  chipContainerStyles,
  filterButtonStyles,
  gridContainerStyles,
} from './PipScreen.styles';
import type { PipSearchFilters } from './PipScreen.hook';
import { usePipScreen } from './PipScreen.hook';

interface NpiProps {
  allocation: NpiAllocation;
}

export const NpiSection: React.FC<NpiProps> = ({ allocation }) => (
  <NpiSectionContainer>
    <Accordion
      defaultExpanded={false}
      summary={
        <SummaryRowBox>
          <PayerNameText>{allocation.npiPayerName}</PayerNameText>
          <PaymentDetailsBox>
            <NpiHeaderColText>{formatCurrency(Number(allocation.totalPayment))}</NpiHeaderColText>
            <IconButton sx={chipContainerStyles} disableRipple style={{ padding: 0 }}>
              <Chip
                label={`${formatPercent(Number(allocation.allocatedPercent ?? 0), 2)} Allocated`}
                size="small"
                variant="outlined"
                color="primary"
              />
            </IconButton>
          </PaymentDetailsBox>
        </SummaryRowBox>
      }
    >
      <NpiSectionWrapper>
        <NpiHeaderRow>
          <NpiHeaderColText>CLAIM ID</NpiHeaderColText>
          <NpiHeaderColText>PATIENT NAME</NpiHeaderColText>
          <NpiHeaderColText>ALLOWED AMT</NpiHeaderColText>
          <NpiHeaderColText>APPLIED TO PIP BALANCE</NpiHeaderColText>
        </NpiHeaderRow>
        {allocation.claims.map((claim) => (
          <NpiDataRow key={claim.claimId}>
            <ClaimIdText>{claim.claimId}</ClaimIdText>
            <NpiDataText>{claim.patientName}</NpiDataText>
            <NpiDataText>{formatCurrency(Number(claim.allowedAmt))}</NpiDataText>
            <AppliedBalanceText>
              {formatCurrency(Number(claim.appliedToPipBalance))}
            </AppliedBalanceText>
          </NpiDataRow>
        ))}
      </NpiSectionWrapper>
    </Accordion>
  </NpiSectionContainer>
);

const PipScreen: React.FC<{ skip?: boolean }> = ({ skip = false }) => {
  const {
    pipRecords,
    totalElements,
    pipSummary,
    queryParams,
    expandedRows,
    loadingDetailsPtans,
    toggleRow,
    handleRangeChange,
    handleFilterChange,
    handleSortChange,
    handlePageChange,
    handleRowsPerPageChange,
    searchFilters,
    appliedSearchFilters,
    handleSearchFilterChange,
    handleApplySearch,
    handleClearSearch,
    // statusOptions,
    globalFilters,
    isFetching,
  } = usePipScreen({ skip });

  const getRowId = useCallback((row: PipRecord) => row.id || row.ptan, []);

  const columns = useMemo<DataColumn<PipRecord>[]>(
    () => [
      {
        id: 'expand',
        label: '',
        align: 'center',
        render: (row) => (
          <IconButton
            size="small"
            onClick={(e) => toggleRow(row, e)}
            disabled={loadingDetailsPtans.has(row.ptan)}
          >
            {loadingDetailsPtans.has(row.ptan) ? (
              <CircularProgress size={16} />
            ) : expandedRows.has(getRowId(row)) ? (
              <KeyboardArrowDownIcon fontSize="small" />
            ) : (
              <KeyboardArrowRightIcon fontSize="small" />
            )}
          </IconButton>
        ),
      },
      {
        id: 'ptan',
        label: 'PTAN',
        align: 'center',
        accessor: (row) => row.ptan,
        render: (row) => row.ptan,
      },
      {
        id: 'paymentDate',
        label: 'PAYMENT DATE',
        align: 'center',
        accessor: (row) => row.paymentDate,
        render: (row) => formatDate(row.paymentDate),
      },
      {
        id: 'checkEftNumber',
        label: 'CHECK/EFT NUMBER',
        align: 'center',
        accessor: (row) => row.checkEftNumber,
        render: (row) => <MultiValueDisplay value={row.checkEftNumber} />,
      },
      {
        id: 'paymentAmount',
        label: 'PAYMENT AMOUNT',
        align: 'center',
        accessor: (row) => row.paymentAmount,
        render: (row) => formatCurrency(Number(row.paymentAmount)),
      },
      {
        id: 'payer',
        label: 'PAYER',
        align: 'center',
        accessor: (row) => row.payer ?? '-',
        disableSort: true,
        render: (row) => <MultiValueDisplay value={row.payer ?? '-'} />,
      },
      {
        id: 'suspenseBalance',
        label: 'SUSPENSE BALANCE',
        align: 'center',
        accessor: (row) => row.suspenseBalance,
        render: (row) => formatCurrency(Number(row.suspenseBalance)),
      },
      {
        id: 'status',
        label: 'STATUS',
        align: 'center',
        accessor: (row) => row.status,
        render: (row) => <StatusBadge status={row.status} />,
      },
    ],
    [expandedRows, loadingDetailsPtans, toggleRow, getRowId],
  );

  const pipFilterPanel = useMemo(
    () => (
      <>
        {[
          { key: 'ptanNo' as keyof PipSearchFilters, label: 'PTAN' },
          { key: 'checkEftNo' as keyof PipSearchFilters, label: 'Check/EFT #' },
          { key: 'npiPayerName' as keyof PipSearchFilters, label: 'NPI' },
          { key: 'claimId' as keyof PipSearchFilters, label: 'Claim ID' },
          { key: 'patientName' as keyof PipSearchFilters, label: 'Patient Name' },
        ].map(({ key, label }) => (
          <SearchField
            key={key}
            size="small"
            label={label}
            value={searchFilters[key]}
            onChange={(e) => handleSearchFilterChange(key, e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleApplySearch()}
          />
        ))}
        <FilterActionsWrapper>
          <Button
            variant="contained"
            size="small"
            startIcon={<SearchIcon sx={{ fontSize: 18 }} />}
            onClick={handleApplySearch}
            disabled={!Object.values(searchFilters).some((v) => v?.trim())}
            sx={filterButtonStyles}
          >
            Search
          </Button>
          <Button
            variant="outlined"
            size="small"
            onClick={handleClearSearch}
            sx={filterButtonStyles}
          >
            Clear
          </Button>
        </FilterActionsWrapper>
      </>
    ),
    [searchFilters, handleSearchFilterChange, handleApplySearch, handleClearSearch],
  );

  const renderExpandedContent = useCallback(
    (row: PipRecord) => {
      if (loadingDetailsPtans.has(row.ptan)) {
        return (
          <CenteredLoadingBox>
            <CircularProgress size={24} />
          </CenteredLoadingBox>
        );
      }
      if (!row.npiDetails?.length) {
        return (
          <NoDetailsText variant="body2" color="text.secondary">
            No NPI details found for this PTAN.
          </NoDetailsText>
        );
      }
      return (
        <Box>
          {row.npiDetails.map((allocation) => (
            <NpiSection key={allocation.npiPayerName} allocation={allocation} />
          ))}
        </Box>
      );
    },
    [loadingDetailsPtans],
  );

  return (
    <ScreenWrapper>
      {/* {isError && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: '8px' }}>
          Failed to load PIP details. Please try reloading or contact support.
        </Alert>
      )} */}
      <Grid container spacing={2} sx={gridContainerStyles}>
        <Grid size={{ xs: 12, md: 4 }}>
          <SummaryCard
            title="TOTAL PAID AMOUNT"
            value={formatCurrency(pipSummary?.totalPaidAmount)}
            backgroundColor="background.paper"
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <SummaryCard
            title="TOTAL SUSPENSE BALANCE"
            value={formatCurrency(pipSummary?.totalSuspenseBalance)}
            backgroundColor="background.paper"
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <SummaryCard
            title="ACTION REQUIRED"
            value={pipSummary?.actionRequired?.toString() ?? '-'}
            variant="default"
            backgroundColor="background.paper"
          />
        </Grid>
      </Grid>
      <DataTable
        gridName="PIP"
        columns={columns}
        data={pipRecords || []}
        rowKey={getRowId}
        expandedRows={expandedRows}
        expandedContent={renderExpandedContent}
        exportTitle="PIP Records"
        dictionaryId="statements"
        serverSide
        totalElements={totalElements}
        page={queryParams.page}
        rowsPerPage={queryParams.size}
        sortCol={queryParams.sortField}
        sortDir={queryParams.sortOrder}
        download={false}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        onSortChange={handleSortChange}
        onFilterChange={handleFilterChange}
        loading={isFetching}
        customToolbarContent={
          <RangeDropdown value={globalFilters.rangeLabel} onChange={handleRangeChange} />
        }
        customFilterContent={pipFilterPanel}
        additionalFilterCount={Object.values(appliedSearchFilters).filter((v) => v?.trim()).length}
      />
    </ScreenWrapper>
  );
};

export default PipScreen;
