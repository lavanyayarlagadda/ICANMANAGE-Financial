import { styled } from '@mui/material/styles';
import { Box, Typography, Card } from '@mui/material';

export const TrendsWrapper = styled(Box)(() => ({
  padding: 0,
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  height: '100%',
  minHeight: 0,
}));

export const SectionHeader = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(3),
}));

export const TitleText = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  color: theme.palette.text.primary,
}));

export const ChartContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.spacing(1),
  marginBottom: theme.spacing(3),
  border: `1px solid ${theme.palette.divider}`,
}));

export const LegendWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: theme.spacing(2),
}));

export const PieChartWrapper = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  height: 260,
}));

export const RichCard = styled(Card)(({ theme }) => ({
  height: '100%',
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  boxShadow: 'none',
}));

export const RiskCardStyled = styled(Card)<{ severity: 'error' | 'warning' }>(({ theme, severity }) => ({
  height: '100%',
  backgroundColor: theme.palette.background.default,
  borderLeft: `4px solid ${severity === 'error' ? theme.palette.error.main : theme.palette.warning.main}`,
  boxShadow: 'none',
}));
