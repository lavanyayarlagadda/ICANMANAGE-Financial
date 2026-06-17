import React, { useMemo } from 'react';
import { Box, Typography, IconButton, Grid } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { ForwardBalanceNotice, OffsetEvent } from '@/interfaces/financials';
import { TableQueryParams } from '@/interfaces/api';
import PipScreen from '../Pip/PipScreen';
import DataTable from '@/components/molecules/DataTable/DataTable';
import { DataColumn } from '@/components/molecules/DataTable/DataTable.hook';
import StatusBadge from '@/components/atoms/StatusBadge/StatusBadge';
import RangeDropdown from '@/components/atoms/RangeDropdown/RangeDropdown';
import Accordion from '@/components/atoms/Accordion/Accordion';
import SummaryCard from '@/components/atoms/SummaryCard/SummaryCard';
import MultiValueDisplay from '@/components/atoms/MultiValueDisplay/MultiValueDisplay';
import { useStatementsScreen, useForwardBalanceNoticesTable } from './StatementsScreen.hook';
import {
  OffsetWrapperBox,
  OffsetSummaryBox,
  OffsetTitleTypography,
  OffsetAmountTypography,
  OffsetChip,
  OffsetDetailsContainerBox,
  OffsetHeaderGridBox,
  OffsetRowGridBox,
  ClaimIdTypography,
  PatientNameTypography,
  DeductedAmountTypography,
  NoticeIdTypography,
  BoldTextTypography,
  ProviderNameWrapperBox,
  ProviderNameTypography,
  ErrorAmountTypography,
  ScreenHeaderBox,
  ScreenHeaderTitleTypography,
  SummaryGridContainer,
  LoadingWrapperBox,
  EmptyDetailsWrapperBox,
  DetailsWrapperBox,
} from './StatementsScreen.styles';
import SuspenseAccountsScreen from '../Suspense/SuspenseAccountsScreen';
import FbRecoupScreen from '../FbRecoup/FbRecoupScreen';

import { useTheme } from '@mui/material/styles';

const OffsetSection: React.FC<{ offset: OffsetEvent }> = ({ offset }) => (
  <OffsetWrapperBox>
    <Accordion
      defaultExpanded={false}
      summary={
        <OffsetSummaryBox>
          <OffsetTitleTypography variant="body2">
            Offset EFT: <MultiValueDisplay value={offset.eftNumber} displayCount={1} /> &nbsp;{' '}
            {formatDate(offset.date)}
          </OffsetTitleTypography>
          <OffsetAmountTypography variant="body2">
            {formatCurrency(offset.amount)}
          </OffsetAmountTypography>
          <OffsetChip label={`CODE: ${offset.code}`} size="small" />
        </OffsetSummaryBox>
      }
    >
      <OffsetDetailsContainerBox>
        <OffsetHeaderGridBox>
          <Typography fontSize={11} fontWeight={700} color="text.secondary">
            CLAIM ID (DEDUCTED FROM)
          </Typography>
          <Typography fontSize={11} fontWeight={700} color="text.secondary">
            PATIENT NAME
          </Typography>
          <Typography fontSize={11} fontWeight={700} color="text.secondary" textAlign="center">
            DEDUCTED AMOUNT
          </Typography>
        </OffsetHeaderGridBox>
        {offset.claims.map((claim, idx) => (
          <OffsetRowGridBox key={idx}>
            <ClaimIdTypography fontSize={13} color="primary">
              {claim.claimId}
            </ClaimIdTypography>
            <PatientNameTypography fontSize={13}>{claim.patientName}</PatientNameTypography>
            <DeductedAmountTypography fontSize={13} textAlign="center">
              {formatCurrency(claim.deductedAmount)}
            </DeductedAmountTypography>
          </OffsetRowGridBox>
        ))}
      </OffsetDetailsContainerBox>
    </Accordion>
  </OffsetWrapperBox>
);

const ForwardBalanceNoticesTable = ({
  data,
  totalElements,
  queryParams,
  onPageChange,
  onRowsPerPageChange,
  onSortChange,
  onRangeChange,
  rangeLabel,
  onFilterChange,
  payerOptions,
  loading,
}: {
  data: ForwardBalanceNotice[];
  totalElements: number;
  queryParams: TableQueryParams;
  onPageChange: (p: number) => void;
  onRowsPerPageChange: (s: number) => void;
  onSortChange: (colId: string, dir: 'asc' | 'desc') => void;
  onRangeChange: (range: string) => void;
  rangeLabel: string;
  onFilterChange: (filters: Record<string, string>) => void;
  payerOptions: { label: string; value: string }[];
  loading?: boolean;
}) => {
  const { expandedRows, toggleRow, noticeDetails, loadingDetails } =
    useForwardBalanceNoticesTable();

  const columns = useMemo<DataColumn<ForwardBalanceNotice>[]>(
    () => [
      {
        id: 'expand',
        label: '',
        align: 'center',
        render: (row) => (
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              toggleRow(row.id, row.noticeId, row.offsets);
            }}
          >
            {expandedRows.has(row.id) ? (
              <KeyboardArrowUpIcon fontSize="small" />
            ) : (
              <KeyboardArrowDownIcon fontSize="small" />
            )}
          </IconButton>
        ),
      },
      {
        id: 'noticeId',
        label: 'NOTICE ID',
        align: 'center',
        accessor: (row) => row.noticeId,
        render: (row) => <NoticeIdTypography variant="body2">{row.noticeId}</NoticeIdTypography>,
      },
      {
        id: 'notificationDate',
        label: 'NOTIFICATION DATE',
        align: 'center',
        accessor: (row) => row.notificationDate,
        render: (row) => (
          <BoldTextTypography variant="body2">
            {formatDate(row.notificationDate)}
          </BoldTextTypography>
        ),
      },
      {
        id: 'provider',
        label: 'PAYER / NPI',
        align: 'center',
        accessor: (row) => `${row.providerName} ${row.npi}`,
        filterOptions: payerOptions,
        render: (row) => (
          <ProviderNameWrapperBox>
            <ProviderNameTypography variant="body2">{row.providerName}</ProviderNameTypography>
            <Typography variant="caption" color="text.secondary">
              NPI: {row.npi}
            </Typography>
          </ProviderNameWrapperBox>
        ),
      },
      {
        id: 'originalAmount',
        label: 'ORIGINAL AMOUNT',
        align: 'center',
        accessor: (row) => row.originalAmount,
        render: (row) => (
          <ErrorAmountTypography variant="body2">
            {formatCurrency(row.originalAmount)}
          </ErrorAmountTypography>
        ),
      },
      {
        id: 'remainingBalance',
        label: 'REMAINING BALANCE',
        align: 'center',
        accessor: (row) => row.remainingBalance,
        render: (row) => (
          <ErrorAmountTypography variant="body2">
            {formatCurrency(row.remainingBalance)}
          </ErrorAmountTypography>
        ),
      },
      {
        id: 'status',
        label: 'STATUS',
        align: 'center',
        accessor: (row) => row.status,
        // filterOptions: statusOptions,
        render: (row) => <StatusBadge status={row.status} />,
      },
    ],
    [expandedRows, toggleRow, payerOptions],
  );

  return (
    <Box>
      <DataTable
        columns={columns}
        data={data}
        rowKey={(row) => row.id}
        expandedRows={expandedRows}
        expandedContent={(row) => {
          if (loadingDetails.has(row.id)) {
            return (
              <LoadingWrapperBox>
                <Typography variant="body2" color="text.secondary">
                  Loading offset details...
                </Typography>
              </LoadingWrapperBox>
            );
          }

          const dynamicOffsets = noticeDetails[row.id]?.offsets || row.offsets;
          if (!dynamicOffsets || dynamicOffsets.length === 0) {
            return (
              <EmptyDetailsWrapperBox>
                <Typography variant="body2" color="text.secondary">
                  No offset details found.
                </Typography>
              </EmptyDetailsWrapperBox>
            );
          }

          return (
            <DetailsWrapperBox>
              {dynamicOffsets.map((offset: OffsetEvent, idx: number) => (
                <OffsetSection key={idx} offset={offset} />
              ))}
            </DetailsWrapperBox>
          );
        }}
        exportTitle="Forward Balance Notices"
        customToolbarContent={<RangeDropdown value={rangeLabel} onChange={onRangeChange} />}
        dictionaryId="statements"
        serverSide
        totalElements={totalElements}
        page={queryParams.page}
        rowsPerPage={queryParams.size}
        sortCol={queryParams.sortField}
        sortDir={queryParams.sortOrder}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        onSortChange={onSortChange}
        onFilterChange={onFilterChange}
        download={false}
        loading={loading}
      />
    </Box>
  );
};

const StatementsScreen: React.FC<{ skip?: boolean }> = ({ skip = false }) => {
  const theme = useTheme();
  const {
    finalActiveSubTab,
    forwardBalanceNotices,
    totalElements,
    queryParams,
    handleRangeChange,
    handleSortChange,
    onPageChange,
    onRowsPerPageChange,
    handleFilterChange,
    payerOptions,
    stats,
    globalFilters,
    isFetching,
  } = useStatementsScreen({ skip });

  return (
    <Box>
      {(finalActiveSubTab === 0 || finalActiveSubTab === 1) && (
        <ScreenHeaderBox>
          <ScreenHeaderTitleTypography variant="h5">
            {finalActiveSubTab === 0 ? 'PIP Statements' : 'Forward Balance Notices'}
          </ScreenHeaderTitleTypography>
          <Typography variant="body2" color="text.secondary">
            {finalActiveSubTab === 0
              ? 'Periodic Interim Payment (PIP) records.'
              : 'Overpayment notices with offset events.'}
          </Typography>
        </ScreenHeaderBox>
      )}

      {finalActiveSubTab === 1 && (
        <SummaryGridContainer container spacing={2}>
          <Grid size={{ xs: 12, md: 4 }}>
            <SummaryCard
              title="TOTAL ORIGINAL AMOUNT"
              value={formatCurrency(stats?.totalOriginalAmount)}
              backgroundColor={theme.palette.background.paper}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <SummaryCard
              title="TOTAL REMAINING BALANCE"
              value={formatCurrency(stats?.totalRemainingBalance)}
              variant="negative"
              backgroundColor={theme.palette.background.paper}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <SummaryCard
              title="ACTION REQUIRED"
              value={String(stats?.actionRequired)}
              backgroundColor={theme.palette.background.paper}
            />
          </Grid>
        </SummaryGridContainer>
      )}

      {finalActiveSubTab === 0 ? (
        <PipScreen skip={finalActiveSubTab !== 0} />
      ) : finalActiveSubTab === 1 ? (
        <ForwardBalanceNoticesTable
          data={forwardBalanceNotices}
          totalElements={totalElements}
          queryParams={queryParams}
          onPageChange={onPageChange}
          onRowsPerPageChange={onRowsPerPageChange}
          onSortChange={handleSortChange}
          onRangeChange={handleRangeChange}
          rangeLabel={globalFilters.rangeLabel}
          onFilterChange={handleFilterChange}
          payerOptions={payerOptions}
          loading={isFetching}
        />
      ) : finalActiveSubTab === 2 ? (
        <SuspenseAccountsScreen skip={finalActiveSubTab !== 2} />
      ) : (
        <FbRecoupScreen skip={finalActiveSubTab !== 3} />
      )}
    </Box>
  );
};

export default StatementsScreen;
