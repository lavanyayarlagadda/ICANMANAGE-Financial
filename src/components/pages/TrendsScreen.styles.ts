import { styled } from '@mui/material/styles';
import { Box, BoxProps, Typography, Card, CardProps } from '@mui/material';

export const ScreenHeaderContainer = styled(Box)<BoxProps>(({ theme }) => ({
  marginBottom: theme.spacing(3),
}));

export const ChartCardContainer = styled(Box)<BoxProps>(({ theme }) => ({
  padding: theme.spacing(3),
  backgroundColor: theme.palette.background.paper,
  borderRadius: 16,
  marginBottom: theme.spacing(3),
  border: `1px solid ${theme.palette.divider}`,
}));

export const SummaryCardRichContainer = styled(Card)<CardProps>(({ theme }) => ({
  height: '100%',
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  boxShadow: 'none',
}));

export const RiskCardContainer = styled(Card, {
  shouldForwardProp: (prop) => prop !== 'severity',
})<CardProps & { severity?: 'error' | 'warning' }>(({ theme, severity }) => ({
  height: '100%',
  backgroundColor: severity === 'error' ? '#FEF2F2' : '#FFFBEB',
  borderLeft: `4px solid ${severity === 'error' ? theme.palette.error.main : theme.palette.warning.main}`,
  boxShadow: 'none',
}));

export const PieChartCard = styled(Card)<CardProps>(({ theme }) => ({
  height: '100%',
  border: `1px solid ${theme.palette.divider}`,
  boxShadow: 'none',
}));

export const ChartWrapper = styled(Box)<BoxProps>({
  display: 'flex',
  alignItems: 'center',
  height: 260,
});
