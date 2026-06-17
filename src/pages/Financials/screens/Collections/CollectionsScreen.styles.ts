import { styled } from '@mui/material/styles';
import { Box, Typography, Chip } from '@mui/material';
import { themeConfig } from '@/theme/themeConfig';

export const ScreenWrapper = styled(Box)(() => ({
  // padding handled by parent or layout usually, but we can add specific padding here if needed
}));

export const HeaderBox = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(3),
}));

export const HeaderTitle = styled(Typography)(() => ({
  fontWeight: 700,
}));

export const AccountNumberText = styled(Typography)(() => ({
  fontWeight: 600,
}));

export const MonospaceBox = styled(Box)(() => ({
  fontFamily: 'monospace',
}));

export const CollectedAmountBox = styled(Box)(({ theme }) => ({
  fontFamily: 'monospace',
  color: theme.palette.success.main,
}));

export const BalanceText = styled(Typography)<{ balance: number }>(({ theme, balance }) => ({
  fontFamily: 'monospace',
  fontWeight: 600,
  color: balance > 0 ? theme.palette.error.main : theme.palette.success.main,
}));

export const priorityColors: Record<string, { bg: string; text: string }> = {
  High: { bg: themeConfig.colors.error + '18', text: themeConfig.colors.error },
  Medium: { bg: themeConfig.colors.accent + '18', text: themeConfig.colors.accent },
  Low: { bg: themeConfig.colors.success + '18', text: themeConfig.colors.success },
};

export const AgingChip = styled(Chip)(() => ({
  fontSize: '0.7rem',
}));

export const PriorityChip = styled(Chip)<{ priority: string }>(({ priority }) => {
  const colors = priorityColors[priority] || { bg: 'transparent', text: 'inherit' };
  return {
    backgroundColor: colors.bg,
    color: colors.text,
    fontWeight: 600,
    fontSize: '0.7rem',
  };
});

import { Grid, Alert } from '@mui/material';

export const SummaryGrid = styled(Grid)(({ theme }) => ({
  marginBottom: theme.spacing(3),
}));

export const _ErrorAlert = styled(Alert)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  borderRadius: '8px',
}));
