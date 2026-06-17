import React, { useMemo } from 'react';
import { Typography } from '@mui/material';
import DataTable from '@/components/molecules/DataTable/DataTable';
import { DataColumn } from '@/components/molecules/DataTable/DataTable.hook';
import RowActionMenu from '@/components/molecules/RowActionMenu/RowActionMenu';
import { PayerPerformanceRecord } from '@/interfaces/financials';
import { formatCurrency } from '@/utils/formatters';
import {
  SectionHeader,
  TitleText,
  BoldTypography,
  BoldMonospaceTypography,
  SemiBoldTypography,
  StatusBadgeBox,
} from '../TrendsScreen.styles';

interface PayerPerformanceSectionProps {
  payerPerformanceRecords: PayerPerformanceRecord[];
  totalElementsPayer: number;
  handlePageChange: (newPage: number) => void;
  handleRowsPerPageChange: (newRowsPerPage: number) => void;
  handleDrillDown: (row: PayerPerformanceRecord) => Promise<void> | void;
  isFetching: boolean;
}

export const PayerPerformanceSection: React.FC<PayerPerformanceSectionProps> = ({
  payerPerformanceRecords,
  totalElementsPayer,
  handlePageChange,
  handleRowsPerPageChange,
  handleDrillDown,
  isFetching,
}) => {
  const payerColumns = useMemo<DataColumn<PayerPerformanceRecord>[]>(
    () => [
      {
        id: 'actions',
        label: 'Actions',
        minWidth: 60,
        render: (r) => <RowActionMenu onView={() => handleDrillDown(r)} />,
      },
      {
        id: 'transactionNo',
        label: 'TRANSACTION #',
        minWidth: 140,
        accessor: (row) => row.id,
        render: (row) => (
          <BoldMonospaceTypography variant="body2">{row.id}</BoldMonospaceTypography>
        ),
      },
      {
        id: 'payerName',
        label: 'PAYER',
        minWidth: 150,
        accessor: (row) => row.payerName,
        render: (row) => <SemiBoldTypography variant="body2">{row.payerName}</SemiBoldTypography>,
      },
      {
        id: 'volume',
        label: 'VOLUME',
        align: 'center',
        render: (row) => new Intl.NumberFormat('en-US').format(row.volume),
        accessor: (row) => row.volume,
      },
      {
        id: 'depositCount',
        label: 'DEPOSITS',
        align: 'center',
        render: (row) => new Intl.NumberFormat('en-US').format(row.depositCount),
        accessor: (row) => row.depositCount,
      },
      {
        id: 'matchRate',
        label: 'MATCH RATE',
        align: 'center',
        render: (row) => `${row.matchRate}%`,
        accessor: (row) => row.matchRate,
      },
      {
        id: 'denialRate',
        label: 'DENIAL RATE',
        align: 'center',
        render: (row) => `${row.denialRate}%`,
        accessor: (row) => row.denialRate,
      },
      {
        id: 'suspenseRate',
        label: 'SUSPENSE %',
        align: 'center',
        render: (row) => `${row.suspenseRate}%`,
        accessor: (row) => row.suspenseRate,
      },
      {
        id: 'avgDaysToSettle',
        label: 'SETTLE DAYS',
        align: 'center',
        render: (row) => row.avgDaysToSettle,
        accessor: (row) => row.avgDaysToSettle,
      },
      {
        id: 'totalVariance',
        label: 'VARIANCE',
        align: 'center',
        render: (row) => formatCurrency(row.totalVariance),
        accessor: (row) => row.totalVariance,
      },
      {
        id: 'status',
        label: 'STATUS',
        render: (row) => (
          <StatusBadgeBox status={row.status}>
            <BoldTypography variant="caption">{row.status}</BoldTypography>
          </StatusBadgeBox>
        ),
        accessor: (row) => row.status,
      },
    ],
    [handleDrillDown],
  );

  return (
    <>
      <SectionHeader>
        <TitleText variant="h6">Payer Performance</TitleText>
        <Typography variant="body2" color="text.secondary">
          Payer-level KPIs and settlement trends.
        </Typography>
      </SectionHeader>
      <DataTable
        columns={payerColumns}
        data={payerPerformanceRecords}
        rowKey={(r) => r.id}
        paginated={true}
        rowsPerPage={10}
        totalElements={totalElementsPayer}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        dictionaryId="payer-performance"
        download={false}
        loading={isFetching}
      />
    </>
  );
};
