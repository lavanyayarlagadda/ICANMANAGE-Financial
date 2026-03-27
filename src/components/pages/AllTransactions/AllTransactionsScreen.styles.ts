import { styled } from '@mui/material/styles';
import { Typography } from '@mui/material';
import { themeConfig } from '@/theme/themeConfig';

export const AmountText = styled(Typography)<{ amount: number }>(({ theme, amount }) => ({
  fontFamily: 'monospace',
  fontWeight: 600,
  color: amount < 0 ? theme.palette.error.main : theme.palette.text.primary,
}));

export const BalanceText = styled(Typography)(({ theme }) => ({
  fontFamily: 'monospace',
}));

export const transactionTypeColors: Record<string, { bg: string; text: string }> = {
  PAYMENT: { bg: themeConfig.colors.info + '18', text: themeConfig.colors.info },
  RECOUPMENT: { bg: themeConfig.colors.error + '18', text: themeConfig.colors.error },
  FORWARD_BALANCE: { bg: themeConfig.colors.accent + '18', text: themeConfig.colors.accent },
  ADJUSTMENT: { bg: themeConfig.colors.primaryDark + '18', text: themeConfig.colors.primaryDark },
  PIP: { bg: themeConfig.colors.success + '18', text: themeConfig.colors.success },
};
