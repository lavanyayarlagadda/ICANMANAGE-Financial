import React from 'react';
import {
  Box,
  Typography,
  Grid,
  TextField,
  MenuItem,
  Button,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { format, isToday, parseISO } from 'date-fns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { themeConfig } from '@/theme/themeConfig';
import {
  FilterContainer,
  ToggleWrapper,
  ToggleButton,
  DayStripContainer,
  DayCard
} from '../ReconciliationScreen.styles';
import { FilterState, ReconciliationStatus } from '../ReconciliationScreen.hook';

interface ReconciliationFiltersProps {
  view: ReconciliationStatus;
  dateMode: 'range' | 'day';
  setDateMode: (mode: 'range' | 'day') => void;
  searchFilters: FilterState;
  setSearchFilters: (filters: FilterState) => void;
  applyFilters: () => void;
  setAdvancedSearchOpen: (open: boolean) => void;
  daysInView: Date[];
}

const ReconciliationFilters: React.FC<ReconciliationFiltersProps> = ({
  view,
  dateMode,
  setDateMode,
  searchFilters,
  setSearchFilters,
  applyFilters,
  setAdvancedSearchOpen,
  daysInView
}) => {
  if (view === 'my-queue') return null;

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <FilterContainer elevation={0} sx={{ p: 2, mb: 3 }}>
        <Box sx={{ width: '100%' }}>
          {/* Row 0: Toggle at Top */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
            <ToggleWrapper>
              <ToggleButton active={dateMode === 'range'} onClick={() => setDateMode('range')}>DateRange</ToggleButton>
              <ToggleButton active={dateMode === 'day'} onClick={() => setDateMode('day')}>DayWise</ToggleButton>
            </ToggleWrapper>
          </Box>

          {/* Row 1: Primary Selection & Search */}
          <Grid container spacing={2} alignItems="flex-end">
            <Grid size={{ xs: 12, md: 2 }}>
              <Typography variant="caption" sx={{ fontWeight: 800, display: 'block', mb: 0.5, color: themeConfig.colors.slate[500], fontSize: '11px', textTransform: 'uppercase' }}>
                {view === 'reconciled' ? 'Reconciled From Date' : 'From Date'}
              </Typography>
              <DatePicker
                value={searchFilters.fromDate ? parseISO(searchFilters.fromDate) : null}
                onChange={(newValue) => setSearchFilters({ ...searchFilters, fromDate: newValue ? format(newValue, 'yyyy-MM-dd') : '' })}
                slotProps={{ 
                  textField: { 
                    size: 'small', 
                    fullWidth: true,
                    sx: { '& .MuiOutlinedInput-root': { backgroundColor: themeConfig.colors.slate[50] } }
                  } 
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 2 }}>
              <Typography variant="caption" sx={{ fontWeight: 800, display: 'block', mb: 0.5, color: themeConfig.colors.slate[500], fontSize: '11px', textTransform: 'uppercase' }}>
                {view === 'reconciled' ? 'Reconciled To Date' : 'To Date'}
              </Typography>
              <DatePicker
                value={searchFilters.toDate ? parseISO(searchFilters.toDate) : null}
                onChange={(newValue) => setSearchFilters({ ...searchFilters, toDate: newValue ? format(newValue, 'yyyy-MM-dd') : '' })}
                slotProps={{ 
                  textField: { 
                    size: 'small', 
                    fullWidth: true,
                    sx: { '& .MuiOutlinedInput-root': { backgroundColor: themeConfig.colors.slate[50] } }
                  } 
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 2 }}>
              <Typography variant="caption" sx={{ fontWeight: 800, display: 'block', mb: 0.5, color: themeConfig.colors.slate[500], fontSize: '11px', textTransform: 'uppercase' }}>Payor</Typography>
              <TextField
                size="small"
                select
                fullWidth
                value={searchFilters.payor}
                onChange={(e) => setSearchFilters({ ...searchFilters, payor: e.target.value })}
                sx={{ '& .MuiOutlinedInput-root': { backgroundColor: themeConfig.colors.slate[50] } }}
              >
                <MenuItem value="All">All Payors Selected</MenuItem>
                <MenuItem value="UnitedHealthcare">UnitedHealthcare</MenuItem>
                <MenuItem value="Aetna">Aetna</MenuItem>
              </TextField>
            </Grid>
            {view !== 'reconciled' && (
              <Grid size={{ xs: 12, md: 2 }}>
                <Typography variant="caption" sx={{ fontWeight: 800, display: 'block', mb: 0.5, color: themeConfig.colors.slate[500], fontSize: '11px', textTransform: 'uppercase' }}>Status</Typography>
                <TextField
                  size="small"
                  select
                  fullWidth
                  value={searchFilters.status}
                  onChange={(e) => setSearchFilters({ ...searchFilters, status: e.target.value })}
                  sx={{ '& .MuiOutlinedInput-root': { backgroundColor: themeConfig.colors.slate[50] } }}
                >
                  <MenuItem value="All">All Status Selected</MenuItem>
                  <MenuItem value="Done">Done</MenuItem>
                  <MenuItem value="Pending">Pending</MenuItem>
                </TextField>
              </Grid>
            )}
            <Grid size={{ xs: 12, md: 4 }} sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="contained"
                startIcon={<SearchIcon fontSize="small" />}
                onClick={applyFilters}
                sx={{ height: '40px', textTransform: 'none', fontWeight: 700, borderRadius: '8px', px: 4 }}
              >
                Search
              </Button>
            </Grid>
          </Grid>

          {/* Row 2: Advanced Actions */}
          <Box sx={{ mt: 3, pt: 2, borderTop: `1px solid ${themeConfig.colors.slate[100]}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.8,
                cursor: 'pointer',
                color: themeConfig.colors.primary,
                fontWeight: 700,
                fontSize: '13px',
                '&:hover': { opacity: 0.8, textDecoration: 'underline' }
              }}
              onClick={() => setAdvancedSearchOpen(true)}
            >
              <SearchIcon sx={{ fontSize: 16 }} />
              Advanced Search
            </Box>

            {dateMode === 'day' && (
              <Button
                variant="outlined"
                size="small"
                startIcon={<SearchIcon fontSize="small" />}
                onClick={applyFilters}
                sx={{ textTransform: 'none', fontWeight: 700, px: 3, borderRadius: '6px' }}
              >
                Apply Day Filters
              </Button>
            )}
          </Box>
        </Box>
      </FilterContainer>

      {/* Day Wise Strip */}
      {dateMode === 'day' && (
        <DayStripContainer sx={{ mb: 4, px: 1 }}>
          {daysInView.map((day) => {
            const dateStr = format(day, 'yyyy-MM-dd');
            const isActive = searchFilters.fromDate === dateStr;
            return (
              <DayCard
                key={dateStr}
                active={isActive}
                today={isToday(day)}
                onClick={() => {
                  setSearchFilters({ ...searchFilters, fromDate: dateStr, toDate: dateStr });
                  applyFilters();
                }}
              >
                <Typography variant="caption" sx={{ fontWeight: 800, fontSize: '10px', textTransform: 'uppercase', opacity: isActive ? 1 : 0.6 }}>
                  {format(day, 'EEE')}
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 900, fontSize: '18px', my: -0.2 }}>
                  {format(day, 'd')}
                </Typography>
              </DayCard>
            );
          })}
        </DayStripContainer>
      )}
    </LocalizationProvider>
  );
};

export default ReconciliationFilters;
