import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  IconButton,
  Divider,
  Grid,
  TextField,
  MenuItem,
  Button
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { themeConfig } from '@/theme/themeConfig';
import { FilterState, ReconciliationStatus } from '../ReconciliationScreen.hook';

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
  onSearch
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          background: 'white',
          color: 'black',

          borderRadius: 2
        }
      }}
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>Advanced Filters</Typography>
        <IconButton onClick={onClose} sx={{ color: 'white' }}><CloseIcon /></IconButton>
      </DialogTitle>
      <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />
      <DialogContent sx={{ py: 3 }}>
        <Grid container spacing={3}>
          {/* Row 1 */}
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography variant="caption" sx={{ fontWeight: 700, mb: 0.5, display: 'block' }}>
              {view === 'reconciled' ? 'Reconciled From Date' : 'From Date'}
            </Typography>
            <TextField
              type="date"
              fullWidth
              size="small"
              value={searchFilters.fromDate}
              onChange={(e) => setSearchFilters({ ...searchFilters, fromDate: e.target.value })}
              sx={{ backgroundColor: 'white', borderRadius: 1 }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography variant="caption" sx={{ fontWeight: 700, mb: 0.5, display: 'block' }}>
              {view === 'reconciled' ? 'Reconciled To Date' : 'To Date'}
            </Typography>
            <TextField
              type="date"
              fullWidth
              size="small"
              value={searchFilters.toDate}
              onChange={(e) => setSearchFilters({ ...searchFilters, toDate: e.target.value })}
              sx={{ backgroundColor: 'white', borderRadius: 1 }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography variant="caption" sx={{ fontWeight: 700, mb: 0.5, display: 'block' }}>Payor</Typography>
            <TextField
              select
              fullWidth
              size="small"
              value={searchFilters.payor || 'All'}
              onChange={(e) => setSearchFilters({ ...searchFilters, payor: e.target.value })}
              sx={{ backgroundColor: 'white', borderRadius: 1 }}
            >
              <MenuItem value="All">All Payors Selected</MenuItem>
              <MenuItem value="Aetna">Aetna</MenuItem>
            </TextField>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography variant="caption" sx={{ fontWeight: 700, mb: 0.5, display: 'block' }}>State</Typography>
            <TextField
              select
              fullWidth
              size="small"
              defaultValue="All"
              sx={{ backgroundColor: 'white', borderRadius: 1 }}
            >
              <MenuItem value="All">Select State</MenuItem>
              <MenuItem value="AZ">Arizona</MenuItem>
            </TextField>
          </Grid>

          {/* Row 2 */}
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography variant="caption" sx={{ fontWeight: 700, mb: 0.5, display: 'block' }}>Transaction NO.</Typography>
            <TextField
              placeholder="Transaction NO."
              fullWidth
              size="small"
              value={searchFilters.transactionNo}
              onChange={(e) => setSearchFilters({ ...searchFilters, transactionNo: e.target.value })}
              sx={{ backgroundColor: 'white', borderRadius: 1 }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography variant="caption" sx={{ fontWeight: 700, mb: 0.5, display: 'block' }}>Transaction Type</Typography>
            <TextField select fullWidth size="small" defaultValue="All" sx={{ backgroundColor: 'white', borderRadius: 1 }}>
              <MenuItem value="All">Select Transaction Type</MenuItem>
            </TextField>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography variant="caption" sx={{ fontWeight: 700, mb: 0.5, display: 'block' }}>Account</Typography>
            <TextField select fullWidth size="small" defaultValue="All" sx={{ backgroundColor: 'white', borderRadius: 1 }}>
              <MenuItem value="All">Select Account</MenuItem>
            </TextField>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography variant="caption" sx={{ fontWeight: 700, mb: 0.5, display: 'block' }}>Batch Owner</Typography>
            <TextField
              select
              fullWidth
              size="small"
              defaultValue="All"
              sx={{ backgroundColor: 'white', borderRadius: 1 }}
            >
              <MenuItem value="All">Select Batch Owner</MenuItem>
            </TextField>
          </Grid>

          {/* Status (Hide for Reconciled) */}
          {view !== 'reconciled' && (
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Typography variant="caption" sx={{ fontWeight: 700, mb: 0.5, display: 'block' }}>Status</Typography>
              <TextField
                select
                fullWidth
                size="small"
                value={searchFilters.status || 'All'}
                onChange={(e) => setSearchFilters({ ...searchFilters, status: e.target.value })}
                sx={{ backgroundColor: 'white', borderRadius: 1 }}
              >
                <MenuItem value="All">Select Status</MenuItem>
              </TextField>
            </Grid>
          )}
        </Grid>
      </DialogContent>
      <DialogActions sx={{ p: 3, gap: 1 }}>
        <Button
          variant="contained"
          onClick={() => {
            onSearch(searchFilters.transactionNo);
            onClose();
          }}
          sx={{ textTransform: 'lowercase', px: 4, py: 1 }}
        >
          Search
        </Button>
        <Button
          variant="contained"
          onClick={() => setSearchFilters({ payor: 'All', status: 'All', fromDate: '2025-06-01', toDate: '2025-06-30', transactionNo: '' })}
          sx={{ textTransform: 'lowercase', px: 4, py: 1, backgroundColor: themeConfig.colors.primary }}
        >
          clear
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AdvancedSearchDialog;
