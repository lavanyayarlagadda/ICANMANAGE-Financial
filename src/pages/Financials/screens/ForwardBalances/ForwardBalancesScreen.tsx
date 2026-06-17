import React, { useMemo } from 'react';
import { Box, Typography, IconButton, Grid } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { ForwardBalanceNotice, OffsetEvent } from '@/interfaces/financials';
import DataTable from '@/components/molecules/DataTable/DataTable';
import { DataColumn } from '@/components/molecules/DataTable/DataTable.hook';
import StatusBadge from '@/components/atoms/StatusBadge/StatusBadge';
import RangeDropdown from '@/components/atoms/RangeDropdown/RangeDropdown';
import Accordion from '@/components/atoms/Accordion/Accordion';
import SummaryCard from '@/components/atoms/SummaryCard/SummaryCard';
import MultiValueDisplay from '@/components/atoms/MultiValueDisplay/MultiValueDisplay';
import {
  useForwardBalancesScreen,
  useForwardBalanceNoticesTable,
} from './ForwardBalancesScreen.hook';
import {
  OffsetChip,
  ErrorAmountText,
  OffsetWrapperBox,
  OffsetSummaryBox,
  OffsetTitleTypography,
  OffsetAmountTypography,
  OffsetDetailsContainerBox,
  OffsetHeaderGridBox,
  OffsetRowGridBox,
  ClaimIdTypography,
  PatientNameTypography,
  DeductedAmountTypography,
  NoticeIdTextTypography,
  BoldTextTypography,
  ProviderNameWrapperBox,
  ProviderNameTypography,
  ScreenHeaderBox,
  ScreenHeaderTitleText,
  SummaryGrid,
  LoadingWrapperBox,
  EmptyDetailsWrapperBox,
  DetailsWrapperBox,
  _ErrorAlert,
} from './ForwardBalancesScreen.styles';
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

const ForwardBalancesScreen: React.FC<{ skip?: boolean }> = ({ skip = false }) => {
  const theme = useTheme();
  const {
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
    // isError,
  } = useForwardBalancesScreen({ skip });

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
        render: (row) => (
          <NoticeIdTextTypography variant="body2">{row.noticeId}</NoticeIdTextTypography>
        ),
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
          <ErrorAmountText variant="body2">{formatCurrency(row.originalAmount)}</ErrorAmountText>
        ),
      },
      {
        id: 'remainingBalance',
        label: 'REMAINING BALANCE',
        align: 'center',
        accessor: (row) => row.remainingBalance,
        render: (row) => (
          <ErrorAmountText variant="body2">{formatCurrency(row.remainingBalance)}</ErrorAmountText>
        ),
      },
      {
        id: 'status',
        label: 'STATUS',
        align: 'center',
        accessor: (row) => row.status,
        render: (row) => <StatusBadge status={row.status} />,
      },
    ],
    [expandedRows, toggleRow, payerOptions],
  );

  return (
    <Box>
      <ScreenHeaderBox>
        <ScreenHeaderTitleText variant="h5">Forward Balance Notices</ScreenHeaderTitleText>
        <Typography variant="body2" color="text.secondary">
          Overpayment notices with offset events.
        </Typography>
      </ScreenHeaderBox>
      {/* 
            {isError && (
                <_ErrorAlert severity="error">
                    Failed to load Forward Balance Notices. Please try reloading or contact support.
                </_ErrorAlert>
            )} */}

      <SummaryGrid container spacing={2}>
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
      </SummaryGrid>

      <DataTable
        gridName="Forward Balances"
        columns={columns}
        data={forwardBalanceNotices}
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
        customToolbarContent={
          <RangeDropdown value={globalFilters.rangeLabel} onChange={handleRangeChange} />
        }
        dictionaryId="statements"
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

export default ForwardBalancesScreen;
