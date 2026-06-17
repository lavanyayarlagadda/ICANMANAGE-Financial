import React, { useMemo } from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { BankDepositItem } from '@/interfaces/financials';
import { DataColumn } from '@/components/molecules/DataTable/DataTable.hook';
import { themeConfig } from '@/theme/themeConfig';
import { ReconStatus, SystemStatus } from '@/constants/statuses';

import { DynamicColumn } from '@/interfaces/api/common';
import MultiValueDisplay from '@/components/atoms/MultiValueDisplay/MultiValueDisplay';
import {
  MonospaceText,
  PrimaryText,
  BoldText,
  VarianceText,
  StatusChip,
  CheckCircleIcon,
  ErrorIcon,
  ReconciledChip,
  StatusBox,
  Variance1Chip,
  Variance2Chip,
} from './BankDepositsScreen.styles';

interface UseBankDepositColumnsProps {
  expandedRows: Set<string>;
  toggleRow: (id: string) => void;
  dynamicColumns: DynamicColumn[];
  isHeadersSuccess: boolean;
  payerOptions: { label: string; value: string }[];
  statusOptions: string[];
}

export const useBankDepositColumns = ({
  expandedRows,
  toggleRow,
  dynamicColumns,
  isHeadersSuccess,
  payerOptions,
  statusOptions,
}: UseBankDepositColumnsProps) => {
  const columns = useMemo<DataColumn<BankDepositItem>[]>(() => {
    // Base columns that are always present or have complex custom rendering
    const baseColumns: Record<string, DataColumn<BankDepositItem>> = {
      expand: {
        id: 'expand',
        label: '',
        render: (row) => (
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              toggleRow(row.transactionNo);
            }}
          >
            {expandedRows.has(row.transactionNo) ? (
              <KeyboardArrowUpIcon fontSize="small" />
            ) : (
              <KeyboardArrowDownIcon fontSize="small" />
            )}
          </IconButton>
        ),
      },
      transactionNo: {
        id: 'transactionNo',
        label: 'TRANSACTION NO',
        align: 'center',
        accessor: (row) => row.transactionNo,
        render: (row) => <MonospaceText variant="body2">{row.transactionNo}</MonospaceText>,
      },
      baiReceivedDate: {
        id: 'baiReceivedDate',
        label: 'DEPOSIT DATE',
        align: 'center',
        accessor: (row) => row.baiReceivedDate,
        render: (row) => <Typography variant="body2">{formatDate(row.baiReceivedDate)}</Typography>,
      },
      reference: {
        id: 'reference',
        label: 'REF / DATE',
        align: 'center',
        accessor: (row) => row.accountNo,
        render: (row) => (
          <Box>
            <PrimaryText variant="body2">{row.accountNo}</PrimaryText>
            <Typography variant="caption" color="text.secondary">
              {formatDate(row.baiReceivedDate)}
            </Typography>
          </Box>
        ),
      },
      payerName: {
        id: 'payerName',
        label: 'PAYER NAME',
        align: 'center',
        accessor: (row) => row.payerName,
        filterOptions: payerOptions,
        render: (row) => <Typography variant="body2">{row.payerName}</Typography>,
      },
      baiAmount: {
        id: 'baiAmount',
        label: 'BANK AMT',
        align: 'center',
        accessor: (row) => row.baiAmount,
        render: (row) => <BoldText variant="body2">{formatCurrency(row.baiAmount)}</BoldText>,
      },
      remitAmount: {
        id: 'remitAmount',
        label: 'REMITTANCE',
        align: 'center',
        accessor: (row) => row.remitAmount,
        render: (row) => <BoldText variant="body2">{formatCurrency(row.remitAmount)}</BoldText>,
      },
      variance: {
        id: 'variance',
        label: 'VARIANCE',
        align: 'center',
        accessor: (row) => row.varianceAmount,
        disableSort: true,
        render: (row) => (
          <VarianceText variant="body2" amount={row.varianceAmount}>
            {formatCurrency(row.varianceAmount)}
          </VarianceText>
        ),
      },
      status: {
        id: 'status',
        label: 'STATUS',
        align: 'center',
        accessor: (row) => row.status,
        filterOptions: statusOptions,
        render: (row) => {
          const isZeroTransaction = row.transactionNo === 'No Transaction#';

          if (isZeroTransaction) {
            const status = row.status;
            if (!status) return '-';
            const isMatched = status === ReconStatus.MATCHED || status === ReconStatus.RECONCILED;
            const statusColors = isMatched
              ? themeConfig.status[ReconStatus.MATCHED]
              : themeConfig.status[SystemStatus.CRITICAL];
            return (
              <StatusChip
                label={status}
                bg={statusColors.bg}
                textColor={statusColors.text}
                icon={isMatched ? <CheckCircleIcon /> : <ErrorIcon />}
              />
            );
          } else if (row.status === 'Reconciled') {
            return <ReconciledChip label={row.status} icon={<CheckCircleIcon />} />;
          }
          if (!row.variance1Status && !row.variance2Status) return '-';
          return (
            <StatusBox>
              {row.variance1Status && <Variance1Chip label={row.variance1Status} />}
              {row.variance2Status && <Variance2Chip label={row.variance2Status} />}
            </StatusBox>
          );
        },
      },
    };

    if (!isHeadersSuccess || !dynamicColumns || dynamicColumns.length === 0) {
      return [baseColumns.expand];
    }

    const mappedColumns: DataColumn<BankDepositItem>[] = dynamicColumns.map((dc) => {
      const mappedId = dc.displayName
        .toLowerCase()
        .replace(/[^a-z0-9]+(.)/g, (_: string, chr: string) => chr.toUpperCase())
        .replace(/^(.)/, (_: string, chr: string) => chr.toLowerCase());

      const lowerName = dc.displayName.toLowerCase();

      const base = Object.values(baseColumns).find((c) => {
        const cid = c.id.toLowerCase();
        if (lowerName.includes('status')) return cid === 'status';
        if (lowerName.includes('payer') || lowerName.includes('payor')) return cid === 'payername';

        // Prioritize date-specific columns to avoid "deposit" catching "deposit date"
        if (lowerName.includes('date')) {
          if (lowerName.includes('deposit')) return cid === 'baireceiveddate';
          if (lowerName.includes('ref')) return cid === 'reference';
          return cid === 'baireceiveddate'; // Default for other dates to avoid amount mapping
        }

        if (
          lowerName.includes('bank') ||
          lowerName.includes('amount') ||
          lowerName.includes('deposit')
        )
          return cid === 'baiamount';
        if (lowerName.includes('remittance')) return cid === 'remitamount';
        if (lowerName.includes('variance')) return cid === 'variance';
        if (
          lowerName.includes('trans') ||
          (lowerName.includes('check') && !lowerName.includes('pay'))
        )
          return cid === 'transactionno';
        if (lowerName.includes('ref')) return cid === 'reference';
        return false;
      });

      const actualField = base ? base.id : mappedId;

      if (base) {
        return {
          ...base,
          label: dc.displayName.toUpperCase(),
          accessor: (row: BankDepositItem) => {
            const val = (row as unknown as Record<string, unknown>)[actualField];
            if (typeof val === 'string' || typeof val === 'number' || val === null) return val;
            return base.accessor ? (base.accessor(row) as string | number | null) : null;
          },
          render: (row: BankDepositItem) => {
            const val = (row as unknown as Record<string, unknown>)[actualField];
            if (
              typeof val === 'number' &&
              (actualField.toLowerCase().includes('amt') ||
                actualField.toLowerCase().includes('amount') ||
                actualField.toLowerCase().includes('variance') ||
                actualField.toLowerCase().includes('remit') ||
                actualField.toLowerCase().includes('deposit'))
            ) {
              return <BoldText variant="body2">{formatCurrency(val)}</BoldText>;
            }
            return base.render ? (
              base.render(row)
            ) : (
              <Typography variant="body2">
                {val !== null && val !== undefined ? String(val) : '-'}
              </Typography>
            );
          },
          filterOptions:
            actualField === 'payerName'
              ? payerOptions
              : actualField === 'status'
                ? statusOptions
                : base.filterOptions,
        };
      }

      return {
        id: mappedId,
        label: dc.displayName.toUpperCase(),
        align: 'center',
        accessor: (row: BankDepositItem) => {
          const val = (row as unknown as Record<string, unknown>)[mappedId];
          return typeof val === 'string' || typeof val === 'number' || val === null ? val : null;
        },
        render: (row: BankDepositItem) => {
          const val = (row as unknown as Record<string, unknown>)[mappedId];

          if (mappedId.toLowerCase().includes('adjustmentcode')) {
            return (
              <MultiValueDisplay
                value={val !== null && val !== undefined ? String(val) : '-'}
                hideSearch={true}
              />
            );
          }

          if (
            typeof val === 'number' &&
            (mappedId.toLowerCase().includes('amt') ||
              mappedId.toLowerCase().includes('amount') ||
              mappedId.toLowerCase().includes('variance'))
          ) {
            return <BoldText variant="body2">{formatCurrency(val)}</BoldText>;
          }
          if (mappedId.toLowerCase().includes('date') && val) {
            return <Typography variant="body2">{formatDate(String(val))}</Typography>;
          }
          return (
            <Typography variant="body2">
              {val !== null && val !== undefined ? String(val) : '-'}
            </Typography>
          );
        },
      };
    });

    if (!mappedColumns.find((c) => c.id === 'expand')) {
      mappedColumns.unshift(baseColumns.expand);
    }

    return mappedColumns;
  }, [expandedRows, toggleRow, dynamicColumns, isHeadersSuccess, payerOptions, statusOptions]);

  return { columns };
};
