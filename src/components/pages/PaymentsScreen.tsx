import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import DataTable, { DataColumn } from '@/components/molecules/DataTable';
import RangeDropdown from '@/components/atoms/RangeDropdown';
import StatusBadge from '@/components/atoms/StatusBadge';
import RowActionMenu from '@/components/molecules/RowActionMenu';
import { useAppSelector, useAppDispatch } from '@/store';
import { PaymentTransaction } from '@/types/financials';
import { formatCurrency } from '@/utils/formatters';
import { openViewDialog, openEditDialog, openConfirmDelete } from '@/store/slices/uiSlice';
import { setShowRemittanceDetail, setSelectedPaymentId } from '@/store/slices/financialsSlice';
import PrintIcon from '@mui/icons-material/Print';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

import { useSearchPaymentsQuery } from '@/store/api/financialsApi';

const PaymentsScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const { data, isLoading, isError } = useSearchPaymentsQuery({
    page: 1,
    size: 10,
    sort: 'amount',
    desc: true,
    status: null,
    fromDate: '2026-01-01',
    toDate: '2026-01-31'
  });

  const payments = data?.content ?? [];

  const handleDrillDown = (row: PaymentTransaction) => {
    dispatch(setSelectedPaymentId(row.id));
    dispatch(setShowRemittanceDetail(true));
  };

  const columns: DataColumn<PaymentTransaction>[] = [
    {
      id: 'actions',
      label: 'Actions',
      minWidth: 60,
      render: (r) => (
        <RowActionMenu
          onView={() => dispatch(openViewDialog(r as unknown as Record<string, unknown>))}
          onEdit={() => dispatch(openEditDialog(r as unknown as Record<string, unknown>))}
          onDelete={() => dispatch(openConfirmDelete({ id: r.id, type: 'payment' }))}
          extraActions={[
            { label: 'Remittance Detail', icon: <PrintIcon fontSize="small" />, onClick: () => handleDrillDown(r) },
            { label: 'Copy ID', icon: <ContentCopyIcon fontSize="small" />, onClick: () => navigator.clipboard.writeText(r.id) },
          ]}
        />
      ),
    },
    { id: 'effectiveDate', label: 'Effective Date', minWidth: 120, accessor: (r) => r.effectiveDate, render: (r) => r.effectiveDate },
    { id: 'type', label: 'Type', minWidth: 90, accessor: (r) => r.type, render: (r) => r.type },
    {
      id: 'description',
      label: 'Transaction Number',
      minWidth: 220,
      accessor: (r) => r.description,
      render: (r) => (
        <Typography
          variant="body2"
          sx={{ cursor: 'pointer', '&:hover': { color: 'primary.main', textDecoration: 'underline' } }}
          onClick={() => handleDrillDown(r)}
        >
          {r.description}
        </Typography>
      ),
    },
    { id: 'sourceProvider', label: 'Payer', minWidth: 180, accessor: (r) => r.sourceProvider, render: (r) => r.sourceProvider },
    { id: 'amount', label: 'Amount', minWidth: 110, align: 'right', accessor: (r) => r.amount, render: (r) => <Box sx={{ fontFamily: 'monospace' }}>{formatCurrency(r.amount)}</Box> },
    { id: 'openBalance', label: 'Open Balance', minWidth: 120, align: 'right', accessor: (r) => r.openBalance ?? 0, render: (r) => r.openBalance != null ? formatCurrency(r.openBalance) : 'N/A' },
    { id: 'status', label: 'Status', minWidth: 120, accessor: (r) => r.status, filterOptions: ['Reconciled', 'Partially Applied', 'Pending'], render: (r) => <StatusBadge status={r.status} /> },
  ];


  if (isLoading) return <Box sx={{ p: 4, textAlign: 'center' }}>Loading payments...</Box>;
  if (isError) return <Box sx={{ p: 4, color: 'error.main' }}>Error loading payments. Please ensure the backend is running at http://localhost:8281</Box>;

  return (
    <DataTable
      columns={columns}
      data={payments}
      rowKey={(r) => r.id}
      exportTitle="Payments"
      // selectable
      customToolbarContent={<RangeDropdown />}
      dictionaryId="all-transactions"
    />
  );
};

export default PaymentsScreen;
