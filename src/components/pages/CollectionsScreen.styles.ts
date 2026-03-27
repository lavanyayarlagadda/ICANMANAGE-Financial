import { styled } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';

export const ScreenWrapper = styled(Box)(({ theme }) => ({
  // padding handled by parent or layout usually, but we can add specific padding here if needed
}));

export const HeaderBox = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(3),
}));

export const AccountNumberText = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
}));

export const MonospaceBox = styled(Box)(({ theme }) => ({
  fontFamily: 'monospace',
}));

export const BalanceText = styled(Typography)<{ balance: number }>(({ theme, balance }) => ({
  fontFamily: 'monospace',
  fontWeight: 600,
  color: balance > 0 ? theme.palette.error.main : theme.palette.success.main,
}));

export const priorityColors: Record<string, { bg: string; text: string }> = {
  High: { bg: '#FFEBEE', text: '#C62828' },
  Medium: { bg: '#FFF3E0', text: '#E65100' },
  Low: { bg: '#E8F5E9', text: '#2E7D32' },
};
