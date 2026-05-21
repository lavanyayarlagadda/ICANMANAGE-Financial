import { styled } from '@mui/material/styles';
import { Typography, TextField } from '@mui/material';
import { themeConfig } from '@/theme/themeConfig';

export const AmountText = styled(Typography)<{ amount: number }>(({ theme, amount }) => ({
  fontFamily: 'monospace',
  fontWeight: 600,
  color: amount < 0 ? theme.palette.error.main : theme.palette.text.primary,
}));

export const BalanceText = styled(Typography)(() => ({
  fontFamily: 'monospace',
}));

export const transactionTypeColors: Record<string, { bg: string; text: string }> = {
  PAYMENT: { bg: themeConfig.colors.info + '18', text: themeConfig.colors.info },
  RECOUPMENT: { bg: themeConfig.colors.error + '18', text: themeConfig.colors.error },
  FORWARD_BALANCE: { bg: themeConfig.colors.accent + '18', text: themeConfig.colors.accent },
  ADJUSTMENT: { bg: themeConfig.colors.primaryDark + '18', text: themeConfig.colors.primaryDark },
  PIP: { bg: themeConfig.colors.success + '18', text: themeConfig.colors.success },
};

export const ToolbarWrapper = styled('div')(({ theme }) => ({
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
    fontSize: '13px'
  }
}));
