import { styled } from '@mui/material/styles';
import { Typography, TypographyProps, Box, BoxProps } from '@mui/material';

export const ScreenTitle = styled(Typography)<TypographyProps>(({ theme }) => ({
  fontWeight: 700,
  color: 'rgb(10, 22, 40)',
}));

export const PageHeader = styled(Box)<BoxProps>(({ theme }) => ({
  marginBottom: theme.spacing(3),
}));

export const SummaryGridContainer = styled(Box)<BoxProps>(({ theme }) => ({
  marginBottom: theme.spacing(4),
}));

export const PatientNameText = styled(Typography)<TypographyProps>(({ theme }) => ({
  color: theme.palette.primary.main,
  fontWeight: 500,
  cursor: 'pointer',
}));

export const VarianceValue = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'isPositive',
})<TypographyProps & { isPositive?: boolean }>(({ theme, isPositive }) => ({
  fontWeight: 700,
  color: isPositive ? theme.palette.error.main : theme.palette.text.primary,
}));
