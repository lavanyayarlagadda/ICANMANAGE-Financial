import React, { useMemo } from 'react';
import { Box, Typography, IconButton, Chip, Grid } from '@mui/material';
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
  offsetChipStyles,
  errorAmountStyles,
  offsetWrapperStyles,
  offsetSummaryStyles,
  offsetTitleStyles,
  offsetAmountStyles,
  offsetDetailsContainerStyles,
  offsetHeaderGridStyles,
  offsetRowGridStyles,
  claimIdStyles,
  patientNameStyles,
  deductedAmountStyles,
  noticeIdTextStyles,
  boldTextStyles,
  providerNameWrapperStyles,
  providerNameStyles,
  screenHeaderStyles,
  screenHeaderTitleStyles,
  summaryGridStyles,
  loadingWrapperStyles,
  emptyDetailsWrapperStyles,
  detailsWrapperStyles,
} from './StatementsScreen.styles';
import SuspenseAccountsScreen from '../Suspense/SuspenseAccountsScreen';
import FbRecoupScreen from '../FbRecoup/FbRecoupScreen';

import { useTheme } from '@mui/material/styles';

const OffsetSection: React.FC<{ offset: OffsetEvent }> = ({ offset }) => (
  <Box sx={offsetWrapperStyles}>
    <Accordion
      defaultExpanded={false}
      summary={
        <Box sx={offsetSummaryStyles}>
          <Typography variant="body2" sx={offsetTitleStyles}>
            Offset EFT: <MultiValueDisplay value={offset.eftNumber} displayCount={1} /> &nbsp;{' '}
            {formatDate(offset.date)}
          </Typography>
          <Typography variant="body2" sx={offsetAmountStyles}>
            {formatCurrency(offset.amount)}
          </Typography>
          <Chip label={`CODE: ${offset.code}`} size="small" sx={offsetChipStyles} />
        </Box>
      }
    >
      <Box sx={offsetDetailsContainerStyles}>
        <Box sx={offsetHeaderGridStyles}>
          <Typography fontSize={11} fontWeight={700} color="text.secondary">
            CLAIM ID (DEDUCTED FROM)
          </Typography>
          <Typography fontSize={11} fontWeight={700} color="text.secondary">
            PATIENT NAME
          </Typography>
          <Typography fontSize={11} fontWeight={700} color="text.secondary" textAlign="center">
            DEDUCTED AMOUNT
          </Typography>
        </Box>
        {offset.claims.map((claim, idx) => (
          <Box key={idx} sx={offsetRowGridStyles}>
            <Typography fontSize={13} color="primary" sx={claimIdStyles}>
              {claim.claimId}
            </Typography>
            <Typography fontSize={13} sx={patientNameStyles}>
              {claim.patientName}
            </Typography>
            <Typography
              fontSize={13}
              textAlign="center"
              color="error.main"
              sx={deductedAmountStyles}
            >
              {formatCurrency(claim.deductedAmount)}
            </Typography>
          </Box>
        ))}
      </Box>
    </Accordion>
  </Box>
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
        render: (row) => (
          <Typography variant="body2" sx={noticeIdTextStyles}>
            {row.noticeId}
          </Typography>
        ),
      },
      {
        id: 'notificationDate',
        label: 'NOTIFICATION DATE',
        align: 'center',
        accessor: (row) => row.notificationDate,
        render: (row) => (
          <Typography variant="body2" sx={boldTextStyles}>
            {formatDate(row.notificationDate)}
          </Typography>
        ),
      },
      {
        id: 'provider',
        label: 'PAYER / NPI',
        align: 'center',
        accessor: (row) => `${row.providerName} ${row.npi}`,
        filterOptions: payerOptions,
        render: (row) => (
          <Box sx={providerNameWrapperStyles}>
            <Typography variant="body2" sx={providerNameStyles}>
              {row.providerName}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              NPI: {row.npi}
            </Typography>
          </Box>
        ),
      },
      {
        id: 'originalAmount',
        label: 'ORIGINAL AMOUNT',
        align: 'center',
        accessor: (row) => row.originalAmount,
        render: (row) => (
          <Typography variant="body2" sx={errorAmountStyles}>
            {formatCurrency(row.originalAmount)}
          </Typography>
        ),
      },
      {
        id: 'remainingBalance',
        label: 'REMAINING BALANCE',
        align: 'center',
        accessor: (row) => row.remainingBalance,
        render: (row) => (
          <Typography variant="body2" sx={errorAmountStyles}>
            {formatCurrency(row.remainingBalance)}
          </Typography>
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
              <Box sx={loadingWrapperStyles}>
                <Typography variant="body2" color="text.secondary">
                  Loading offset details...
                </Typography>
              </Box>
            );
          }

          const dynamicOffsets = noticeDetails[row.id]?.offsets || row.offsets;
          if (!dynamicOffsets || dynamicOffsets.length === 0) {
            return (
              <Box sx={emptyDetailsWrapperStyles}>
                <Typography variant="body2" color="text.secondary">
                  No offset details found.
                </Typography>
              </Box>
            );
          }

          return (
            <Box sx={detailsWrapperStyles}>
              {dynamicOffsets.map((offset: OffsetEvent, idx: number) => (
                <OffsetSection key={idx} offset={offset} />
              ))}
            </Box>
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
        <Box sx={screenHeaderStyles}>
          <Typography variant="h5" sx={screenHeaderTitleStyles}>
            {finalActiveSubTab === 0 ? 'PIP Statements' : 'Forward Balance Notices'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {finalActiveSubTab === 0
              ? 'Periodic Interim Payment (PIP) records.'
              : 'Overpayment notices with offset events.'}
          </Typography>
        </Box>
      )}

      {finalActiveSubTab === 1 && (
        <Grid container spacing={2} sx={summaryGridStyles}>
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
        </Grid>
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
