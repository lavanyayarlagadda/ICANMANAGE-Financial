import { styled, Box, Typography, TextField, Button } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { DayStripContainer } from '../ReconciliationScreen.styles';
import SearchIcon from '@mui/icons-material/Search';

export const MainWrapper = styled(Box)(() => ({
  width: '100%',
}));

export const ToggleContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'flex-end',
  marginBottom: theme.spacing(2),
}));

export const FilterLabel = styled(Typography)(({ theme }) => ({
  fontWeight: 800,
  display: 'block',
  marginBottom: theme.spacing(0.5),
  color: theme.palette.text.secondary,
  fontSize: '11px',
  textTransform: 'uppercase',
}));

export const FilterTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    backgroundColor: theme.palette.grey[50],
  },
}));

export const SearchButtonContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
}));

export const SearchButton = styled(Button)(({ theme }) => ({
  height: '40px',
  textTransform: 'none',
  fontWeight: 700,
  borderRadius: '8px',
  paddingLeft: theme.spacing(4),
  paddingRight: theme.spacing(4),
}));

export const AdvancedActionsContainer = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(3),
  paddingTop: theme.spacing(2),
  borderTop: `1px solid ${theme.palette.divider}`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
}));

export const AdvancedSearchLink = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '6.4px',
  cursor: 'pointer',
  color: theme.palette.primary.main,
  fontWeight: 700,
  fontSize: '13px',
  '&:hover': {
    opacity: 0.8,
    textDecoration: 'underline',
  },
}));

export const ApplyDayFiltersButton = styled(Button)(({ theme }) => ({
  textTransform: 'none',
  fontWeight: 700,
  paddingLeft: theme.spacing(3),
  paddingRight: theme.spacing(3),
  borderRadius: '6px',
}));

export const DayCardLabel = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'active',
})<{ active?: boolean }>(({ active }) => ({
  fontWeight: 800,
  fontSize: '10px',
  textTransform: 'uppercase',
  opacity: active ? 1 : 0.6,
}));

export const DayCardValue = styled(Typography)(() => ({
  fontWeight: 900,
  fontSize: '18px',
  marginTop: '-1.6px',
  marginBottom: '-1.6px',
}));

export const StyledDatePicker = styled(DatePicker)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    backgroundColor: theme.palette.grey[50],
  },
})) as unknown as typeof DatePicker;

export const StyledDayStripContainer = styled(DayStripContainer)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  paddingLeft: theme.spacing(1),
  paddingRight: theme.spacing(1),
}));

export const StyledSearchIcon = styled(SearchIcon)(() => ({
  fontSize: 16,
}));
