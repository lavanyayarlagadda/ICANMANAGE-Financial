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

import { subMonths, format } from 'date-fns';
import { useSearchPaymentsQuery } from '@/store/api/financialsApi';
import { CircularProgress } from '@mui/material';

const PaymentsScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const theme = useTheme();

  // Default to 6 months ago for better dynamic initial state
  const defaultTo = new Date();
  const defaultFrom = subMonths(defaultTo, 6);

  // API Payload State
  const [page, setPage] = React.useState(0);
  const [size, setSize] = React.useState(10);
  const [sortField, setSortField] = React.useState('');
  const [sortOrder, setSortOrder] = React.useState<'asc' | 'desc'>('desc');
  const [status, setStatus] = React.useState<string | null>(null);
  const [fromDate, setFromDate] = React.useState(format(defaultFrom, 'yyyy-MM-dd'));
  const [toDate, setToDate] = React.useState(format(defaultTo, 'yyyy-MM-dd'));
  const [searchQuery, setSearchQuery] = React.useState('');

  const { data, isLoading, isError, isFetching, refetch } = useSearchPaymentsQuery({
    page: page + 1, // API is 1-indexed
    size: size,
    sort: sortField,
    desc: sortOrder === 'desc',
    status: status === 'All' ? null : status,
    fromDate,
    toDate
  });

  const payments = data?.content ?? [];
  const totalElements = data?.totalElements ?? 0;

  const handleDrillDown = (row: PaymentTransaction) => {
    dispatch(setSelectedPaymentId(row.id));
    dispatch(setShowRemittanceDetail(true));
  };

  const handleRangeChange = (range: string) => {
    // Range format: "yyyy-MM-dd to yyyy-MM-dd"
    if (range.includes(' to ')) {
      const [from, to] = range.split(' to ');
      setFromDate(from);
      setToDate(to);
      setPage(0);
    }
  };

  const handleFilterChange = (filters: Record<string, string>) => {
    if (filters.status !== undefined) {
      setStatus(filters.status || null);
      setPage(0);
    }
  };

  const handleSortChange = (colId: string, direction: 'asc' | 'desc') => {
    setSortField(colId);
    setSortOrder(direction);
    setPage(0);
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
    { id: 'status', label: 'Status', minWidth: 120, accessor: (r) => r.status, filterOptions: ['All', 'Reconciled', 'Partially Applied', 'Pending'], render: (r) => <StatusBadge status={r.status} /> },
  ];


  if (isLoading) return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 4, height: '60vh' }}><CircularProgress /></Box>;
  if (isError) return <Box sx={{ p: 4, color: 'error.main' }}>Error loading payments. Please ensure the backend is running at http://localhost:8281</Box>;

  return (
    <Box sx={{ position: 'relative' }}>
      {isFetching && (
        <Box sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 10,
          backgroundColor: 'rgba(255,255,255,0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <CircularProgress size={40} thickness={4} />
        </Box>
      )}
      <DataTable
        columns={columns}
        data={payments}
        rowKey={(r) => r.id}
        exportTitle="Payments"
        // selectable
        customToolbarContent={<RangeDropdown onChange={handleRangeChange} />}
        dictionaryId="all-transactions"
        serverSide
        totalElements={totalElements}
        page={page}
        rowsPerPage={size}
        sortCol={sortField}
        sortDir={sortOrder}
        onPageChange={setPage}
        onRowsPerPageChange={setSize}
        onSortChange={handleSortChange}
        onFilterChange={handleFilterChange}
        onSearchChange={setSearchQuery}
      />
    </Box>
  );
};

export default PaymentsScreen;
