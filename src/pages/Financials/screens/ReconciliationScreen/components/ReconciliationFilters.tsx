import React from 'react';
import { MenuItem } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { format, isToday, parseISO } from 'date-fns';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Grid } from '@mui/material';
import {
  FilterContainer,
  ToggleWrapper,
  ToggleButton,
  DayCard,
} from '../ReconciliationScreen.styles';
import { FilterState, ReconciliationStatus } from '../ReconciliationScreen.hook';
import * as styles from './ReconciliationFilters.styles';

interface ReconciliationFiltersProps {
  view: ReconciliationStatus;
  dateMode: 'range' | 'day';
  setDateMode: (mode: 'range' | 'day') => void;
  searchFilters: FilterState;
  setSearchFilters: (filters: FilterState) => void;
  applyFilters: () => void;
  setAdvancedSearchOpen: (open: boolean) => void;
  daysInView: Date[];
  activeAge: string | null;
  setActiveAge: (age: string | null) => void;
  ageRanges: string[];
}

const ReconciliationFilters: React.FC<ReconciliationFiltersProps> = ({
  view,
  dateMode,
  setDateMode,
  searchFilters,
  setSearchFilters,
  applyFilters,
  setAdvancedSearchOpen,
  daysInView,
  activeAge,
  setActiveAge,
  ageRanges,
}) => {
  if (view === 'my-queue') return null;

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <FilterContainer elevation={0}>
        <styles.MainWrapper>
          {/* Row 0: Toggle at Top - Hide for reconciled */}
          {view !== 'reconciled' && (
            <styles.ToggleContainer>
              <ToggleWrapper>
                <ToggleButton active={dateMode === 'range'} onClick={() => setDateMode('range')}>
                  DateRange
                </ToggleButton>
                <ToggleButton active={dateMode === 'day'} onClick={() => setDateMode('day')}>
                  DayWise
                </ToggleButton>
              </ToggleWrapper>
            </styles.ToggleContainer>
          )}

          {/* Row 1: Primary Selection & Search */}
          <Grid container spacing={2} alignItems="flex-end">
            {view === 'reconciled' ? (
              <Grid size={{ xs: 12, md: 3 }}>
                <styles.FilterLabel variant="caption">Aging Filter</styles.FilterLabel>
                <styles.FilterTextField
                  size="small"
                  select
                  fullWidth
                  value={activeAge || 'All'}
                  onChange={(e) => setActiveAge(e.target.value === 'All' ? null : e.target.value)}
                >
                  <MenuItem value="All">All Aging Selected</MenuItem>
                  {ageRanges.map((age) => (
                    <MenuItem key={age} value={age}>
                      {age}
                    </MenuItem>
                  ))}
                </styles.FilterTextField>
              </Grid>
            ) : (
              <>
                <Grid size={{ xs: 12, md: 2 }}>
                  <styles.FilterLabel variant="caption">From Date</styles.FilterLabel>
                  <styles.StyledDatePicker
                    value={searchFilters.fromDate ? parseISO(searchFilters.fromDate) : null}
                    onChange={(newValue) =>
                      setSearchFilters({
                        ...searchFilters,
                        fromDate: newValue ? format(newValue, 'yyyy-MM-dd') : '',
                      })
                    }
                    slotProps={{
                      textField: {
                        size: 'small',
                        fullWidth: true,
                      },
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 2 }}>
                  <styles.FilterLabel variant="caption">To Date</styles.FilterLabel>
                  <styles.StyledDatePicker
                    value={searchFilters.toDate ? parseISO(searchFilters.toDate) : null}
                    onChange={(newValue) =>
                      setSearchFilters({
                        ...searchFilters,
                        toDate: newValue ? format(newValue, 'yyyy-MM-dd') : '',
                      })
                    }
                    slotProps={{
                      textField: {
                        size: 'small',
                        fullWidth: true,
                      },
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 2 }}>
                  <styles.FilterLabel variant="caption">Payor</styles.FilterLabel>
                  <styles.FilterTextField
                    size="small"
                    select
                    fullWidth
                    value={searchFilters.payor}
                    onChange={(e) => setSearchFilters({ ...searchFilters, payor: e.target.value })}
                  >
                    <MenuItem value="All">All Payors Selected</MenuItem>
                    <MenuItem value="UnitedHealthcare">UnitedHealthcare</MenuItem>
                    <MenuItem value="Aetna">Aetna</MenuItem>
                  </styles.FilterTextField>
                </Grid>
                <Grid size={{ xs: 12, md: 2 }}>
                  <styles.FilterLabel variant="caption">Status</styles.FilterLabel>
                  <styles.FilterTextField
                    size="small"
                    select
                    fullWidth
                    value={searchFilters.status}
                    onChange={(e) => setSearchFilters({ ...searchFilters, status: e.target.value })}
                  >
                    <MenuItem value="All">All Status Selected</MenuItem>
                    <MenuItem value="Done">Done</MenuItem>
                    <MenuItem value="Pending">Pending</MenuItem>
                  </styles.FilterTextField>
                </Grid>
              </>
            )}
            <Grid size={{ xs: 12, md: view === 'reconciled' ? 2 : 4 }}>
              <styles.SearchButtonContainer>
                <styles.SearchButton
                  variant="contained"
                  startIcon={<SearchIcon fontSize="small" />}
                  onClick={applyFilters}
                >
                  Search
                </styles.SearchButton>
              </styles.SearchButtonContainer>
            </Grid>
          </Grid>

          {/* Row 2: Advanced Actions - Hide for reconciled */}
          {view !== 'reconciled' && (
            <styles.AdvancedActionsContainer>
              <styles.AdvancedSearchLink onClick={() => setAdvancedSearchOpen(true)}>
                <styles.StyledSearchIcon />
                Advanced Search
              </styles.AdvancedSearchLink>

              {dateMode === 'day' && (
                <styles.ApplyDayFiltersButton
                  variant="outlined"
                  size="small"
                  startIcon={<SearchIcon fontSize="small" />}
                  onClick={applyFilters}
                >
                  Apply Day Filters
                </styles.ApplyDayFiltersButton>
              )}
            </styles.AdvancedActionsContainer>
          )}
        </styles.MainWrapper>
      </FilterContainer>

      {/* Day Wise Strip */}
      {dateMode === 'day' && (
        <styles.StyledDayStripContainer>
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
                <styles.DayCardLabel variant="caption" active={isActive}>
                  {format(day, 'EEE')}
                </styles.DayCardLabel>
                <styles.DayCardValue variant="body1">{format(day, 'd')}</styles.DayCardValue>
              </DayCard>
            );
          })}
        </styles.StyledDayStripContainer>
      )}
    </LocalizationProvider>
  );
};

export default ReconciliationFilters;
