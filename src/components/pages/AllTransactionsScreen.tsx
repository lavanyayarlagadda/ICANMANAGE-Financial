import React, { useMemo } from 'react';
import DataTable, { DataColumn } from '@/components/molecules/DataTable';
import RangeDropdown from '@/components/atoms/RangeDropdown';
import StatusBadge from '@/components/atoms/StatusBadge';
import RowActionMenu from '@/components/molecules/RowActionMenu';
import { useAppSelector, useAppDispatch } from '@/store';
import { AllTransaction } from '@/types/financials';
import { formatCurrency } from '@/utils/formatters';
import { openViewDialog, openEditDialog, openConfirmDelete } from '@/store/slices/uiSlice';
import { CategoryChip, AmountText, BalanceText } from './TransactionScreens.styles';

const TRANSACTION_TYPE_COLORS: Record<string, { bg: string; text: string }> = {
  PAYMENT: { bg: '#E3F2FD', text: '#1565C0' },
  RECOUPMENT: { bg: '#FFEBEE', text: '#C62828' },
  FORWARD_BALANCE: { bg: '#FFF3E0', text: '#E65100' },
  ADJUSTMENT: { bg: '#F3E5F5', text: '#7B1FA2' },
  PIP: { bg: '#E8F5E9', text: '#2E7D32' },
};

const AllTransactionsScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const allTransactions = useAppSelector((s) => s.financials.allTransactions);

  const columns: DataColumn<AllTransaction>[] = useMemo(() => [
    {
      id: 'actions',
      label: 'Actions',
      minWidth: 60,
      render: (r) => (
        <RowActionMenu
          onView={() => dispatch(openViewDialog(r as unknown as Record<string, unknown>))}
          onEdit={() => dispatch(openEditDialog(r as unknown as Record<string, unknown>))}
          onDelete={() => dispatch(openConfirmDelete({ id: r.id, type: 'transaction' }))}
        />
      ),
    },
    { id: 'effectiveDate', label: 'Effective Date', minWidth: 120, accessor: (r) => r.effectiveDate, render: (r) => r.effectiveDate },
    {
      id: 'transactionType',
      label: 'Category',
      minWidth: 140,
      accessor: (r) => r.transactionType,
      filterOptions: ['PAYMENT', 'RECOUPMENT', 'FORWARD_BALANCE', 'ADJUSTMENT', 'PIP'],
      render: (r) => (
        <CategoryChip
          label={r.transactionType.replace('_', ' ')}
          size="small"
          customColors={TRANSACTION_TYPE_COLORS[r.transactionType]}
        />
      ),
    },
    { id: 'type', label: 'Type', minWidth: 100, accessor: (r) => r.type, render: (r) => r.type },
    { id: 'description', label: 'Description', minWidth: 240, accessor: (r) => r.description, render: (r) => r.description },
    { id: 'sourceProvider', label: 'Source / Provider', minWidth: 180, accessor: (r) => r.sourceProvider, render: (r) => r.sourceProvider },
    {
      id: 'amount',
      label: 'Amount',
      minWidth: 120,
      align: 'right',
      accessor: (r) => r.amount,
      render: (r) => (
        <AmountText variant="body2" isNegative={r.amount < 0}>
          {formatCurrency(r.amount)}
        </AmountText>
      ),
    },
    {
      id: 'openBalance',
      label: 'Open Balance',
      minWidth: 120,
      align: 'right',
      accessor: (r) => r.openBalance ?? 0,
      render: (r) => r.openBalance != null ? (
        <BalanceText variant="body2">{formatCurrency(r.openBalance)}</BalanceText>
      ) : '–',
    },
    { id: 'status', label: 'Status', minWidth: 120, accessor: (r) => r.status, filterOptions: ['Reconciled', 'Open', 'Pending', 'Partially Applied', 'Disputed'], render: (r) => <StatusBadge status={r.status} /> },
  ], [dispatch]);

  return (
    <DataTable
      columns={columns}
      data={allTransactions}
      rowKey={(r) => r.id}
      exportTitle="All Transactions"
      customToolbarContent={<RangeDropdown />}
      dictionaryId="all-transactions"
    />
  );
};

export default AllTransactionsScreen;
