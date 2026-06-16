import React, { useMemo } from 'react';
import { Grid } from '@mui/material';
import DataTable from '@/components/molecules/DataTable/DataTable';
import { DataColumn } from '@/components/molecules/DataTable/DataTable.hook';
import RangeDropdown from '@/components/atoms/RangeDropdown/RangeDropdown';
import StatusBadge from '@/components/atoms/StatusBadge/StatusBadge';
import SummaryCard from '@/components/atoms/SummaryCard/SummaryCard';
import RowActionMenu from '@/components/molecules/RowActionMenu/RowActionMenu';
import { CollectionAccount } from '@/interfaces/financials';
import { formatCurrency, formatDate } from '@/utils/formatters';
import {
  ScreenWrapper,
  HeaderBox,
  HeaderTitle,
  AccountNumberText,
  MonospaceBox,
  CollectedAmountBox,
  BalanceText,
  AgingChip,
  PriorityChip,
  gridContainerStyles,
} from './CollectionsScreen.styles';
import { useCollectionsScreen } from './CollectionsScreen.hook';

const CollectionsScreen: React.FC<{ skip?: boolean }> = ({ skip = false }) => {
  const {
    collections,
    totalElements,
    queryParams,
    stats,
    handleView,
    handleEdit,
    handleDelete,
    handleRangeChange,
    handleSortChange,
    handlePageChange,
    handleRowsPerPageChange,
    globalFilters,
    isFetching,
    // isError,
  } = useCollectionsScreen({ skip });

  const columns = useMemo<DataColumn<CollectionAccount>[]>(
    () => [
      {
        id: 'actions',
        label: 'Actions',
        minWidth: 60,
        render: (r) => (
          <RowActionMenu
            onView={() => handleView(r)}
            onEdit={() => handleEdit(r)}
            onDelete={() => handleDelete(r.id)}
          />
        ),
      },
      {
        id: 'accountNumber',
        label: 'Account #',
        minWidth: 140,
        align: 'center',
        accessor: (r) => r.accountNumber,
        render: (r) => <AccountNumberText variant="body2">{r.accountNumber}</AccountNumberText>,
      },
      {
        id: 'patientName',
        label: 'Patient Name',
        minWidth: 160,
        accessor: (r) => r.patientName,
        render: (r) => r.patientName,
      },
      {
        id: 'payer',
        label: 'Payer',
        minWidth: 140,
        accessor: (r) => r.payer,
        render: (r) => r.payer,
      },
      // { id: 'description', label: 'Description', minWidth: 180, accessor: (r) => r.description ?? '-', render: (r) => r.description ?? '-' },
      {
        id: 'totalDue',
        label: 'Total Due',
        minWidth: 110,
        align: 'center',
        accessor: (r) => r.totalDue,
        render: (r) => <MonospaceBox>{formatCurrency(r.totalDue)}</MonospaceBox>,
      },
      {
        id: 'amountCollected',
        label: 'Collected',
        minWidth: 110,
        align: 'center',
        accessor: (r) => r.amountCollected,
        render: (r) => <CollectedAmountBox>{formatCurrency(r.amountCollected)}</CollectedAmountBox>,
      },
      {
        id: 'balance',
        label: 'Balance',
        minWidth: 110,
        align: 'center',
        accessor: (r) => r.balance,
        render: (r) => (
          <BalanceText variant="body2" balance={r.balance}>
            {formatCurrency(r.balance)}
          </BalanceText>
        ),
      },
      {
        id: 'lastActivityDate',
        label: 'Last Activity',
        minWidth: 110,
        align: 'center',
        accessor: (r) => r.lastActivityDate,
        render: (r) => formatDate(r.lastActivityDate),
      },
      {
        id: 'assignedTo',
        label: 'Assigned To',
        minWidth: 110,
        accessor: (r) => r.assignedTo,
        render: (r) => r.assignedTo,
      },
      {
        id: 'aging',
        label: 'Aging',
        minWidth: 100,
        accessor: (r) => r.aging,
        filterOptions: ['0-30', '31-60', '61-90', '91-120', '120+', 'N/A'],
        render: (r) =>
          r.aging !== 'N/A' ? <AgingChip label={r.aging} size="small" variant="outlined" /> : '–',
      },
      {
        id: 'priority',
        label: 'Priority',
        minWidth: 90,
        accessor: (r) => r.priority,
        filterOptions: ['High', 'Medium', 'Low'],
        render: (r) => <PriorityChip label={r.priority} size="small" priority={r.priority} />,
      },
      {
        id: 'status',
        label: 'Status',
        minWidth: 120,
        accessor: (r) => r.status,
        filterOptions: ['Open', 'In Progress', 'Closed', 'Settled'],
        render: (r) => <StatusBadge status={r.status} />,
      },
    ],
    [handleView, handleEdit, handleDelete],
  );

  return (
    <ScreenWrapper>
      <HeaderBox>
        <HeaderTitle variant="h5">Collections</HeaderTitle>
        <HeaderTitle variant="body2" color="text.secondary">
          Manage collection accounts, track balances, and monitor recovery efforts.
        </HeaderTitle>
      </HeaderBox>

      {/* {isError && (
                <Alert severity="error" sx={{ mb: 3, borderRadius: '8px' }}>
                    Failed to load Collections details. Please try reloading or contact support.
                </Alert>
            )} */}

      <Grid container spacing={2} sx={gridContainerStyles}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <SummaryCard
            title="Total Due"
            value={formatCurrency(stats.totalDue)}
            variant="highlight"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <SummaryCard title="Total Collected" value={formatCurrency(stats.totalCollected)} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <SummaryCard
            title="Outstanding Balance"
            value={formatCurrency(stats.totalBalance)}
            variant="negative"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <SummaryCard title="Open Accounts" value={String(stats.openAccounts)} />
        </Grid>
      </Grid>

      <DataTable
        gridName="Collections"
        columns={columns}
        data={collections || []}
        rowKey={(r) => r.id}
        exportTitle="Collections"
        selectable
        customToolbarContent={
          <RangeDropdown value={globalFilters.rangeLabel} onChange={handleRangeChange} />
        }
        dictionaryId="collections"
        serverSide
        totalElements={totalElements}
        page={queryParams.page}
        rowsPerPage={queryParams.size}
        sortCol={queryParams.sortField}
        sortDir={queryParams.sortOrder}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        onSortChange={handleSortChange}
        download={false}
        loading={isFetching}
      />
    </ScreenWrapper>
  );
};

export default CollectionsScreen;
