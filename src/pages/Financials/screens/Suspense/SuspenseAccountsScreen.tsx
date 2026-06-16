import React from 'react';
import {
  Box,
  Typography,
  Grid,
  ToggleButton,
  ToggleButtonGroup,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  InputAdornment,
  Button as MuiButton,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import SettingsIcon from '@mui/icons-material/Settings';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SummaryCard from '@/components/atoms/SummaryCard/SummaryCard';
import Button from '@/components/atoms/Button/Button';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { useSuspenseAccountsScreen } from './SuspenseAccountsScreen.hook';
import {
  accountChipStyles,
  toggleButtonGroupStyles,
  ToolbarWrapper,
  SearchField,
  modalTitleStyles,
  modalContentStyles,
  modalInnerWrapperStyles,
  modalHeaderGridStyles,
  modalHeaderTextStyles,
  modalHeaderCenterTextStyles,
  modalHeaderRightTextStyles,
  modalListContainerStyles,
  modalRowGridStyles,
  modalRowKeyStyles,
  modalRowLabelStyles,
  modalRowCenterStyles,
  modalRowChipStyles,
  modalRowActionsStyles,
  disabledIconBtnStyles,
  smallIconStyles,
  modalSectionTitleStyles,
  modalActionsStyles,
  modalCancelBtnStyles,
  itemCountStyles,
  amountTextStyles,
  emptyAmountStyles,
  normalTextStyles,
  screenWrapperStyles,
  searchWrapperStyles,
  searchIconStyles,
  searchButtonStyles,
  screenHeaderStyles,
  screenHeaderTitleStyles,
  screenHeaderRightStyles,
  summaryGridStyles,
} from './SuspenseAccountsScreen.styles';
import { SUSPENSE_ACCOUNTS, BY_PAYER_DATA, BY_MONTH_DATA } from './SuspenseAccounts.constants';
import { DataColumn } from '@/components/molecules/DataTable/DataTable.hook';
import DataTable from '@/components/molecules/DataTable/DataTable';

const ManageAccountsModal = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={modalTitleStyles}>Manage Suspense Accounts</DialogTitle>
      <DialogContent sx={modalContentStyles}>
        <Box sx={modalInnerWrapperStyles}>
          <Box sx={modalHeaderGridStyles}>
            <Typography variant="caption" sx={modalHeaderTextStyles}>
              KEY
            </Typography>
            <Typography variant="caption" sx={modalHeaderTextStyles}>
              LABEL
            </Typography>
            <Typography variant="caption" sx={modalHeaderCenterTextStyles}>
              COLOR
            </Typography>
            <Typography variant="caption" sx={modalHeaderRightTextStyles}>
              ACTIONS
            </Typography>
          </Box>
          <Box sx={modalListContainerStyles}>
            {SUSPENSE_ACCOUNTS.map((acc) => (
              <Box key={acc.key} sx={modalRowGridStyles}>
                <Typography variant="body2" sx={modalRowKeyStyles}>
                  {acc.key.toUpperCase()}
                </Typography>
                <Typography variant="body2" sx={modalRowLabelStyles}>
                  {acc.label}
                </Typography>
                <Box sx={modalRowCenterStyles}>
                  <Chip
                    label={acc.key.split('_')[0].toUpperCase()}
                    size="small"
                    sx={modalRowChipStyles(acc.color, acc.textColor)}
                  />
                </Box>
                <Box sx={modalRowActionsStyles}>
                  <IconButton size="small" sx={disabledIconBtnStyles}>
                    <EditIcon sx={smallIconStyles} />
                  </IconButton>
                  <IconButton size="small" sx={disabledIconBtnStyles}>
                    <DeleteIcon sx={smallIconStyles} />
                  </IconButton>
                </Box>
              </Box>
            ))}
          </Box>
          <Typography variant="body2" sx={modalSectionTitleStyles}>
            Add New Account
          </Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 6 }}>
              <TextField fullWidth label="ACCOUNT KEY" size="small" />
            </Grid>
            <Grid size={{ xs: 6 }}>
              <TextField fullWidth label="DISPLAY LABEL" size="small" />
            </Grid>
            <Grid size={{ xs: 6 }}>
              <FormControl fullWidth size="small">
                <InputLabel shrink>COLOR</InputLabel>
                <Select label="COLOR" defaultValue="blue">
                  <MenuItem value="blue">Blue</MenuItem>
                  <MenuItem value="purple">Purple</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 6 }}>
              <TextField fullWidth label="DESCRIPTION" size="small" />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions sx={modalActionsStyles}>
        <Button onClick={onClose} sx={modalCancelBtnStyles}>
          Cancel
        </Button>
        <Button variant="contained" onClick={onClose}>
          Save Account
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const SuspenseAccountsScreen: React.FC<{ skip?: boolean }> = ({ skip = false }) => {
  const {
    viewType,
    manageDialogOpen,
    handleViewChange,
    toggleManageDialog,
    suspenseAccounts,
    summary,
    periods,
    totalElements,
    queryParams,
    onPageChange,
    onRowsPerPageChange,
    handleSortChange,
    searchTerm,
    setSearchTerm,
    onSearch,
    isFetching,
  } = useSuspenseAccountsScreen({ skip });

  interface AccountRow {
    id: string;
    accountType: string;
    items: number;
    balances: Record<string, number | null>;
    totalBalance: number;
  }

  interface PayerRow {
    payer: string;
    items: number;
    medicare: number | null;
    remittance: number | null;
    patient: number | null;
    cross: number | null;
    tax: number | null;
    total: number;
  }

  interface MonthRow {
    month: string;
    medicare: number | null;
    remittance: number | null;
    patient: number | null;
    cross: number | null;
    tax: number | null;
    total: number;
  }

  type SuspenseRow = AccountRow | PayerRow | MonthRow;

  const renderTable = (data: SuspenseRow[], type: 'account' | 'payer' | 'month') => {
    const headers =
      type === 'account'
        ? ['ACCOUNT TYPE', 'ITEMS', ...periods, 'TOTAL BALANCE']
        : type === 'payer'
          ? ['FACILITY / PAYER', 'ITEMS', 'MEDICARE', 'REMIT', 'PATIENT', 'CROSS', 'TAX', 'TOTAL']
          : ['MONTH', 'MEDICARE', 'REMIT', 'PATIENT', 'CROSS', 'TAX', 'TOTAL'];

    const tableColumns: DataColumn<SuspenseRow>[] = headers.map((label, index) => {
      let id: string;
      if (type === 'account') {
        if (index === 0) id = 'accountType';
        else if (index === 1) id = 'items';
        else if (index === headers.length - 1) id = 'totalBalance';
        else id = periods[index - 2];
      } else {
        const row = data[0] as unknown as Record<string, unknown>;
        const dataKeys = Object.keys(row || {});
        id = dataKeys[index] || `col_${index}`;
      }

      return {
        id: id,
        label: type === 'month' || /^\d{4}-\d{2}$/.test(label) ? formatDate(label) : label,
        align: 'center',
        accessor: (row) => {
          const r = row as unknown as Record<string, unknown>;
          if ('balances' in r && r.balances && typeof r.balances === 'object') {
            const balances = r.balances as Record<string, number | null>;
            if (balances[id] !== undefined) return balances[id] as string | number | null;
          }
          return r[id] as string | number | null;
        },
        render: (row) => {
          const r = row as unknown as Record<string, unknown>;
          let val: unknown;
          if ('balances' in r && r.balances && typeof r.balances === 'object') {
            const balances = r.balances as Record<string, number | null>;
            val = balances[id] !== undefined ? balances[id] : r[id];
          } else {
            val = r[id];
          }

          if (id === 'accountType' || id === 'account' || id === 'payer' || id === 'month') {
            const accountInfo = SUSPENSE_ACCOUNTS.find((s) => s.label === val);
            if (accountInfo) {
              return <Chip label={String(val)} size="small" sx={accountChipStyles(accountInfo)} />;
            }
          }
          if (id === 'items') {
            return <Typography sx={itemCountStyles}>{String(val)}</Typography>;
          }
          if (typeof val === 'number') {
            return (
              <Typography sx={amountTextStyles(id === 'totalBalance' || id === 'total')}>
                {formatCurrency(val)}
              </Typography>
            );
          }
          if (val === null || val === undefined) {
            return <Typography sx={emptyAmountStyles}>-</Typography>;
          }
          return (
            <Typography sx={normalTextStyles}>
              {/^\d{4}-\d{2}$/.test(String(val)) || /^\d{4}-\d{2}-\d{2}$/.test(String(val))
                ? formatDate(String(val))
                : String(val)}
            </Typography>
          );
        },
      };
    });

    return (
      <Box>
        <DataTable
          columns={tableColumns}
          data={data}
          rowKey={(r) => {
            const row = r as unknown as Record<string, unknown>;
            return String(row.id || row.account || row.payer || row.month || '');
          }}
          paginated={true}
          searchable={false}
          download={false}
          dictionaryId="suspense-accounts"
          dense={true}
          serverSide
          page={queryParams.page}
          rowsPerPage={queryParams.size}
          totalElements={totalElements}
          onPageChange={onPageChange}
          onRowsPerPageChange={onRowsPerPageChange}
          onSortChange={handleSortChange}
          loading={isFetching}
        />
      </Box>
    );
  };

  return (
    <Box sx={screenWrapperStyles}>
      <ToolbarWrapper>
        <Box sx={searchWrapperStyles}>
          <SearchField
            size="small"
            placeholder="Search by Transaction #"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && onSearch(searchTerm)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={searchIconStyles} />
                </InputAdornment>
              ),
            }}
          />
          <MuiButton
            variant="contained"
            size="small"
            onClick={() => onSearch(searchTerm)}
            sx={searchButtonStyles}
          >
            Search
          </MuiButton>
        </Box>
      </ToolbarWrapper>

      <Box sx={screenHeaderStyles}>
        <Box>
          <Typography variant="h6" sx={screenHeaderTitleStyles}>
            Suspense Accounts
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Monitor funds held in suspense.
          </Typography>
        </Box>
        <Box sx={screenHeaderRightStyles}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<SettingsIcon sx={smallIconStyles} />}
            onClick={() => toggleManageDialog(true)}
          >
            Manage Accounts
          </Button>
          <ToggleButtonGroup
            value={viewType}
            exclusive
            onChange={handleViewChange}
            size="small"
            sx={toggleButtonGroupStyles}
          >
            <ToggleButton value="account">By Account</ToggleButton>
            <ToggleButton value="payer">By Payer</ToggleButton>
            <ToggleButton value="month">By Month</ToggleButton>
          </ToggleButtonGroup>
        </Box>
      </Box>

      <Grid container spacing={2} sx={summaryGridStyles}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <SummaryCard
            title="TOTAL OPEN SUSPENSE"
            value={formatCurrency(summary?.totalOpenSuspense ?? 0)}
            backgroundColor="background.paper"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <SummaryCard
            title="OLDEST ITEM AGE"
            value={`${summary?.oldestItemAgeDays ?? 0} days`}
            variant="default"
            backgroundColor="background.paper"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <SummaryCard
            title="AVG DAYS IN SUSPENSE"
            value={`${summary?.avgDaysInSuspense ?? 0} days`}
            backgroundColor="background.paper"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <SummaryCard
            title="AT RISK (>30 DAYS)"
            value={String(summary?.atRiskCount ?? 0)}
            variant="default"
            backgroundColor="background.paper"
          />
        </Grid>
      </Grid>

      {viewType === 'account' && renderTable(suspenseAccounts, 'account')}
      {viewType === 'payer' && renderTable(BY_PAYER_DATA, 'payer')}
      {viewType === 'month' && renderTable(BY_MONTH_DATA, 'month')}

      <ManageAccountsModal open={manageDialogOpen} onClose={() => toggleManageDialog(false)} />
    </Box>
  );
};

export default SuspenseAccountsScreen;
