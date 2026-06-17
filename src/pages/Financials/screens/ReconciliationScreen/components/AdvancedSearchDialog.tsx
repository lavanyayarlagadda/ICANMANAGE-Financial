import React from 'react';
import { Dialog, Divider, Grid, MenuItem, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { FilterState, ReconciliationStatus } from '../ReconciliationScreen.hook';
import { GlassDialog } from '../ReconciliationScreen.styles';
import * as styles from './AdvancedSearchDialog.styles';

interface AdvancedSearchDialogProps {
  open: boolean;
  onClose: () => void;
  view: ReconciliationStatus;
  searchFilters: FilterState;
  setSearchFilters: (filters: FilterState) => void;
  onSearch: (txNo: string) => void;
}

const AdvancedSearchDialog: React.FC<AdvancedSearchDialogProps> = ({
  open,
  onClose,
  view,
  searchFilters,
  setSearchFilters,
  onSearch,
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth PaperComponent={GlassDialog}>
      <styles.StyledDialogTitle>
        <styles.TitleText variant="subtitle1">Advanced Filters</styles.TitleText>
        <IconButton onClick={onClose} color="secondary">
          <CloseIcon />
        </IconButton>
      </styles.StyledDialogTitle>
      <Divider />
      <styles.StyledDialogContent>
        <Grid container spacing={3}>
          {/* Row 1 */}
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <styles.LabelText variant="caption">
              {view === 'reconciled' ? 'Reconciled From Date' : 'From Date'}
            </styles.LabelText>
            <styles.SearchTextField
              type="date"
              fullWidth
              size="small"
              value={searchFilters.fromDate}
              onChange={(e) => setSearchFilters({ ...searchFilters, fromDate: e.target.value })}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <styles.LabelText variant="caption">
              {view === 'reconciled' ? 'Reconciled To Date' : 'To Date'}
            </styles.LabelText>
            <styles.SearchTextField
              type="date"
              fullWidth
              size="small"
              value={searchFilters.toDate}
              onChange={(e) => setSearchFilters({ ...searchFilters, toDate: e.target.value })}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <styles.LabelText variant="caption">Payor</styles.LabelText>
            <styles.SearchTextField
              select
              fullWidth
              size="small"
              value={searchFilters.payor || 'All'}
              onChange={(e) => setSearchFilters({ ...searchFilters, payor: e.target.value })}
            >
              <MenuItem value="All">All Payors Selected</MenuItem>
              <MenuItem value="Aetna">Aetna</MenuItem>
            </styles.SearchTextField>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <styles.LabelText variant="caption">State</styles.LabelText>
            <styles.SearchTextField select fullWidth size="small" defaultValue="All">
              <MenuItem value="All">Select State</MenuItem>
              <MenuItem value="AZ">Arizona</MenuItem>
            </styles.SearchTextField>
          </Grid>

          {/* Row 2 */}
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <styles.LabelText variant="caption">TRANSACTION NO.</styles.LabelText>
            <styles.SearchTextField
              placeholder="TRANSACTION NO."
              fullWidth
              size="small"
              value={searchFilters.transactionNo}
              onChange={(e) =>
                setSearchFilters({ ...searchFilters, transactionNo: e.target.value })
              }
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <styles.LabelText variant="caption">Transaction Type</styles.LabelText>
            <styles.SearchTextField select fullWidth size="small" defaultValue="All">
              <MenuItem value="All">Select Transaction Type</MenuItem>
            </styles.SearchTextField>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <styles.LabelText variant="caption">Account</styles.LabelText>
            <styles.SearchTextField select fullWidth size="small" defaultValue="All">
              <MenuItem value="All">Select Account</MenuItem>
            </styles.SearchTextField>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <styles.LabelText variant="caption">Batch Owner</styles.LabelText>
            <styles.SearchTextField select fullWidth size="small" defaultValue="All">
              <MenuItem value="All">Select Batch Owner</MenuItem>
            </styles.SearchTextField>
          </Grid>

          {/* Status (Hide for Reconciled) */}
          {view !== 'reconciled' && (
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <styles.LabelText variant="caption">Status</styles.LabelText>
              <styles.SearchTextField
                select
                fullWidth
                size="small"
                value={searchFilters.status || 'All'}
                onChange={(e) => setSearchFilters({ ...searchFilters, status: e.target.value })}
              >
                <MenuItem value="All">Select Status</MenuItem>
              </styles.SearchTextField>
            </Grid>
          )}
        </Grid>
      </styles.StyledDialogContent>
      <styles.StyledDialogActions>
        <styles.SearchButton
          variant="contained"
          onClick={() => {
            onSearch(searchFilters.transactionNo);
            onClose();
          }}
        >
          Search
        </styles.SearchButton>
        <styles.ClearButton
          variant="contained"
          onClick={() =>
            setSearchFilters({
              payor: 'All',
              status: 'All',
              fromDate: '2025-06-01',
              toDate: '2025-06-30',
              transactionNo: '',
            })
          }
        >
          clear
        </styles.ClearButton>
      </styles.StyledDialogActions>
    </Dialog>
  );
};

export default AdvancedSearchDialog;
