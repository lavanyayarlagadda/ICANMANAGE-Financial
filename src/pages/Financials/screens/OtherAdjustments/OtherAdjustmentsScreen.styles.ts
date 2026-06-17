import { Box, TextField } from '@mui/material';
import { styled } from '@mui/material/styles';
import { themeConfig } from '@/theme/themeConfig';

export const adjustmentTypeColors: Record<string, string> = {
  'WRITE-OFF': themeConfig.colors.error,
  CREDIT: themeConfig.colors.info,
  INTEREST: themeConfig.colors.accentDark,
  CONTRACTUAL: themeConfig.colors.primaryDark,
  REFUND: themeConfig.colors.charts.teal,
  TRANSFER: themeConfig.colors.accent,
  RECLASSIFICATION: themeConfig.colors.slate[700],
  CHARITY: themeConfig.colors.success,
};

import { Chip, Typography, Alert, Button } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

export const AdjustmentChip = styled(Chip, {
  shouldForwardProp: (prop) => prop !== 'adjType',
})<{ adjType: string }>(({ adjType }) => {
  const color = adjustmentTypeColors[adjType] || themeConfig.colors.slate[500];
  return {
    backgroundColor: `${color}18`,
    color: color,
    fontWeight: 600,
    fontSize: '0.7rem',
  };
});

export const AmountText = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'amount',
})<{ amount: number }>(({ theme, amount }) => ({
  fontFamily: 'monospace',
  fontWeight: 600,
  color:
    amount < 0
      ? theme.palette.error.main
      : amount > 0
        ? theme.palette.success.main
        : theme.palette.text.primary,
}));

export const ToolbarWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'stretch',
  backgroundColor: theme.palette.background.default,
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.spacing(1),
  padding: theme.spacing(1.5),
  gap: theme.spacing(2),
  marginBottom: theme.spacing(3),
  [theme.breakpoints.up('md')]: {
    flexDirection: 'row',
    alignItems: 'center',
  },
}));

export const SearchField = styled(TextField)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  flex: '1 1 auto',
  [theme.breakpoints.up('md')]: {
    flex: '0 0 320px',
  },
  '& .MuiOutlinedInput-root': {
    height: 36,
    fontSize: '13px',
  },
}));

export const AdjustmentIdText = styled(Typography)(() => ({
  fontWeight: 600,
}));

export const PageContainer = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  height: '100%',
  minHeight: 0,
}));

export const SearchWrapper = styled(Box)(() => ({
  display: 'flex',
  gap: '8px',
  alignItems: 'center',
}));

export const StyledSearchIcon = styled(SearchIcon)(({ theme }) => ({
  fontSize: 18,
  color: theme.palette.primary.main,
}));

export const SearchButton = styled(Button)(() => ({
  height: '36px',
  borderRadius: '8px',
  textTransform: 'none',
  fontWeight: 600,
  paddingLeft: '16px',
  paddingRight: '16px',
}));

export const _ErrorAlert = styled(Alert)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  borderRadius: '8px',
}));
