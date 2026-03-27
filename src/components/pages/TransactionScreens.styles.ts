import { styled } from '@mui/material/styles';
import { Typography, Chip } from '@mui/material';

export const CategoryChip = styled(Chip, {
  shouldForwardProp: (prop) => prop !== 'customColors',
})<{ customColors?: { bg: string; text: string } }>(({ customColors }) => ({
  backgroundColor: customColors?.bg || '#F5F5F5',
  color: customColors?.text || '#616161',
  fontWeight: 600,
  fontSize: '0.7rem',
}));

export const AmountText = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'isNegative',
})<{ isNegative?: boolean }>(({ theme, isNegative }) => ({
  fontFamily: 'monospace',
  fontWeight: 600,
  color: isNegative ? theme.palette.error.main : theme.palette.text.primary,
}));

export const BalanceText = styled(Typography)({
  fontFamily: 'monospace',
});
