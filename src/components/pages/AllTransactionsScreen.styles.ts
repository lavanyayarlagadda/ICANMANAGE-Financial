import { styled } from '@mui/material/styles';
import { Typography } from '@mui/material';

export const AmountText = styled(Typography)<{ amount: number }>(({ theme, amount }) => ({
  fontFamily: 'monospace',
  fontWeight: 600,
  color: amount < 0 ? theme.palette.error.main : theme.palette.text.primary,
}));

export const BalanceText = styled(Typography)(({ theme }) => ({
  fontFamily: 'monospace',
}));

export const transactionTypeColors: Record<string, { bg: string; text: string }> = {
  PAYMENT: { bg: '#E3F2FD', text: '#1565C0' },
  RECOUPMENT: { bg: '#FFEBEE', text: '#C62828' },
  FORWARD_BALANCE: { bg: '#FFF3E0', text: '#E65100' },
  ADJUSTMENT: { bg: '#F3E5F5', text: '#7B1FA2' },
  PIP: { bg: '#E8F5E9', text: '#2E7D32' },
};
