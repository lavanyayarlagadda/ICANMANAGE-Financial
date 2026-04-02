import React from 'react';
import {
  Box,
  Typography,
  Grid,
  TextField,
  MenuItem,
  Button,
  IconButton
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { format, isToday } from 'date-fns';
import {
  FilterContainer,
  ToggleWrapper,
  ToggleButton,
  DayStripContainer,
  DayCard
} from '../ReconciliationScreen.styles';

interface ReconciliationFiltersProps {
  view: string;
  dateMode: 'range' | 'day';
  setDateMode: (mode: 'range' | 'day') => void;
  searchFilters: any;
  setSearchFilters: (filters: any) => void;
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
    <>
      <FilterContainer elevation={0} sx={{ p: 2, mb: 3 }}>
        <Box sx={{ width: '100%' }}>
          {/* Row 0: Toggle at Top */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
            <ToggleWrapper>
              <ToggleButton active={dateMode === 'range'} onClick={() => setDateMode('range')}>DateRange</ToggleButton>
              <ToggleButton active={dateMode === 'day'} onClick={() => setDateMode('day')}>DayWise</ToggleButton>
            </ToggleWrapper>
          </Box>

          {/* Row 1: Primary Selection */}
          <Grid container spacing={3} alignItems="flex-end">
            <Grid size={{ xs: 12, md: 2.4 }}>
              <Typography variant="caption" sx={{ fontWeight: 800, display: 'block', mb: 0.5, color: '#64748b', fontSize: '11px', textTransform: 'uppercase' }}>
                {view === 'reconciled' ? 'Reconciled From Date' : (dateMode === 'range' ? 'From Date' : 'Date')}
              </Typography>
              <TextField
                size="small"
                type="date"
                fullWidth
                value={searchFilters.fromDate}
                onChange={(e) => setSearchFilters({ ...searchFilters, fromDate: e.target.value })}
                sx={{ '& .MuiOutlinedInput-root': { backgroundColor: '#f8fafc' } }}
              />
            </Grid>
            {dateMode === 'range' && (
              <Grid size={{ xs: 12, md: 2.4 }}>
                <Typography variant="caption" sx={{ fontWeight: 800, display: 'block', mb: 0.5, color: '#64748b', fontSize: '11px', textTransform: 'uppercase' }}>
                  {view === 'reconciled' ? 'Reconciled To Date' : 'To Date'}
                </Typography>
                <TextField
                  size="small"
                  type="date"
                  fullWidth
                  value={searchFilters.toDate}
                  onChange={(e) => setSearchFilters({ ...searchFilters, toDate: e.target.value })}
                  sx={{ '& .MuiOutlinedInput-root': { backgroundColor: '#f8fafc' } }}
                />
              </Grid>
            )}
            <Grid size={{ xs: 12, md: 2.4 }}>
              <Typography variant="caption" sx={{ fontWeight: 800, display: 'block', mb: 0.5, color: '#64748b', fontSize: '11px', textTransform: 'uppercase' }}>Payor</Typography>
              <TextField
                size="small"
                select
                fullWidth
                value={searchFilters.payor}
                onChange={(e) => setSearchFilters({ ...searchFilters, payor: e.target.value })}
                sx={{ '& .MuiOutlinedInput-root': { backgroundColor: '#f8fafc' } }}
              >
                <MenuItem value="All">All Payors Selected</MenuItem>
                <MenuItem value="UnitedHealthcare">UnitedHealthcare</MenuItem>
                <MenuItem value="Aetna">Aetna</MenuItem>
              </TextField>
            </Grid>
            {view !== 'reconciled' && (
              <Grid size={{ xs: 12, md: 2.4 }}>
                <Typography variant="caption" sx={{ fontWeight: 800, display: 'block', mb: 0.5, color: '#64748b', fontSize: '11px', textTransform: 'uppercase' }}>Status</Typography>
                <TextField
                  size="small"
                  select
                  fullWidth
                  value={searchFilters.status}
                  onChange={(e) => setSearchFilters({ ...searchFilters, status: e.target.value })}
                  sx={{ '& .MuiOutlinedInput-root': { backgroundColor: '#f8fafc' } }}
                >
                  <MenuItem value="All">All Status Selected</MenuItem>
                  <MenuItem value="Done">Done</MenuItem>
                  <MenuItem value="Pending">Pending</MenuItem>
                </TextField>
              </Grid>
            )}
            <Grid size={{ xs: 12, md: (dateMode === 'range' ? 2.4 : 4.8) }} sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="contained"
                fullWidth
                startIcon={<SearchIcon fontSize="small" />}
                onClick={applyFilters}
                sx={{ height: '40px', textTransform: 'none', fontWeight: 700, borderRadius: '8px' }}
              >
                Search
              </Button>
            </Grid>
          </Grid>

          {/* Row 2: Advanced Actions */}
          <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.8,
                cursor: 'pointer',
                color: 'primary.main',
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
    </>
  );
};

export default ReconciliationFilters;
