import React from 'react';
import {
  Box,
  Typography,
  Grid,
  ToggleButton,
  Dialog,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  Button as MuiButton,
} from '@mui/material';
import SummaryCard from '@/components/atoms/SummaryCard/SummaryCard';
import Button from '@/components/atoms/Button/Button';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { useSuspenseAccountsScreen } from './SuspenseAccountsScreen.hook';
import {
  ToolbarWrapper,
  SearchField,
  ModalTitle,
  ModalContent,
  ModalInnerWrapper,
  ModalHeaderGrid,
  ModalHeaderText,
  ModalHeaderCenterText,
  ModalHeaderRightText,
  ModalListContainer,
  ModalRowGrid,
  ModalRowKeyText,
  ModalRowLabelText,
  ModalRowCenterBox,
  ModalRowChip,
  ModalRowActionsBox,
  DisabledIconButton,
  SmallEditIcon,
  SmallDeleteIcon,
  SmallSettingsIcon,
  ModalSectionTitleText,
  ModalActions,
  ModalCancelButton,
  AccountChip,
  ItemCountText,
  AmountText,
  EmptyAmountText,
  NormalText,
  ScreenWrapperBox,
  SearchWrapper,
  StyledSearchIcon,
  SearchButton,
  ScreenHeaderBox,
  ScreenHeaderTitleText,
  ScreenHeaderRightBox,
  SummaryGrid,
  StyledToggleButtonGroup,
} from './SuspenseAccountsScreen.styles';
import { SUSPENSE_ACCOUNTS, BY_PAYER_DATA, BY_MONTH_DATA } from './SuspenseAccounts.constants';
import { DataColumn } from '@/components/molecules/DataTable/DataTable.hook';
import DataTable from '@/components/molecules/DataTable/DataTable';

const ManageAccountsModal = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <ModalTitle>Manage Suspense Accounts</ModalTitle>
      <ModalContent>
        <ModalInnerWrapper>
          <ModalHeaderGrid>
            <ModalHeaderText variant="caption">KEY</ModalHeaderText>
            <ModalHeaderText variant="caption">LABEL</ModalHeaderText>
            <ModalHeaderCenterText variant="caption">COLOR</ModalHeaderCenterText>
            <ModalHeaderRightText variant="caption">ACTIONS</ModalHeaderRightText>
          </ModalHeaderGrid>
          <ModalListContainer>
            {SUSPENSE_ACCOUNTS.map((acc) => (
              <ModalRowGrid key={acc.key}>
                <ModalRowKeyText variant="body2">{acc.key.toUpperCase()}</ModalRowKeyText>
                <ModalRowLabelText variant="body2">{acc.label}</ModalRowLabelText>
                <ModalRowCenterBox>
                  <ModalRowChip
                    label={acc.key.split('_')[0].toUpperCase()}
                    size="small"
                    bg={acc.color}
                    textColor={acc.textColor}
                  />
                </ModalRowCenterBox>
                <ModalRowActionsBox>
                  <DisabledIconButton size="small">
                    <SmallEditIcon />
                  </DisabledIconButton>
                  <DisabledIconButton size="small">
                    <SmallDeleteIcon />
                  </DisabledIconButton>
                </ModalRowActionsBox>
              </ModalRowGrid>
            ))}
          </ModalListContainer>
          <ModalSectionTitleText variant="body2">Add New Account</ModalSectionTitleText>
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
        </ModalInnerWrapper>
      </ModalContent>
      <ModalActions>
        <ModalCancelButton onClick={onClose}>Cancel</ModalCancelButton>
        <MuiButton variant="contained" onClick={onClose}>
          Save Account
        </MuiButton>
      </ModalActions>
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
              return (
                <AccountChip
                  label={String(val)}
                  size="small"
                  bg={accountInfo.color}
                  textColor={accountInfo.textColor}
                />
              );
            }
          }
          if (id === 'items') {
            return <ItemCountText>{String(val)}</ItemCountText>;
          }
          if (typeof val === 'number') {
            return (
              <AmountText isTotal={id === 'totalBalance' || id === 'total'}>
                {formatCurrency(val)}
              </AmountText>
            );
          }
          if (val === null || val === undefined) {
            return <EmptyAmountText>-</EmptyAmountText>;
          }
          return (
            <NormalText>
              {/^\d{4}-\d{2}$/.test(String(val)) || /^\d{4}-\d{2}-\d{2}$/.test(String(val))
                ? formatDate(String(val))
                : String(val)}
            </NormalText>
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
    <ScreenWrapperBox>
      <ToolbarWrapper>
        <SearchWrapper>
          <SearchField
            size="small"
            placeholder="Search by Transaction #"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && onSearch(searchTerm)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <StyledSearchIcon />
                </InputAdornment>
              ),
            }}
          />
          <SearchButton variant="contained" size="small" onClick={() => onSearch(searchTerm)}>
            Search
          </SearchButton>
        </SearchWrapper>
      </ToolbarWrapper>

      <ScreenHeaderBox>
        <Box>
          <ScreenHeaderTitleText variant="h6">Suspense Accounts</ScreenHeaderTitleText>
          <Typography variant="body2" color="text.secondary">
            Monitor funds held in suspense.
          </Typography>
        </Box>
        <ScreenHeaderRightBox>
          <Button
            variant="outlined"
            size="small"
            startIcon={<SmallSettingsIcon />}
            onClick={() => toggleManageDialog(true)}
          >
            Manage Accounts
          </Button>
          <StyledToggleButtonGroup
            value={viewType}
            exclusive
            onChange={handleViewChange}
            size="small"
          >
            <ToggleButton value="account">By Account</ToggleButton>
            <ToggleButton value="payer">By Payer</ToggleButton>
            <ToggleButton value="month">By Month</ToggleButton>
          </StyledToggleButtonGroup>
        </ScreenHeaderRightBox>
      </ScreenHeaderBox>

      <SummaryGrid container spacing={2}>
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
      </SummaryGrid>

      {viewType === 'account' && renderTable(suspenseAccounts, 'account')}
      {viewType === 'payer' && renderTable(BY_PAYER_DATA, 'payer')}
      {viewType === 'month' && renderTable(BY_MONTH_DATA, 'month')}

      <ManageAccountsModal open={manageDialogOpen} onClose={() => toggleManageDialog(false)} />
    </ScreenWrapperBox>
  );
};

export default SuspenseAccountsScreen;
