import { styled } from '@mui/material/styles';
import { Box, Typography, Card } from '@mui/material';

export const TrendsWrapper = styled(Box)(({ theme }) => ({
  padding: 0,
}));

export const SectionHeader = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(3),
}));

export const TitleText = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  color: 'rgb(10, 22, 40)',
}));

export const ChartContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  backgroundColor: '#fff',
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

export const PieChartWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  height: 260,
}));

export const RichCard = styled(Card)(({ theme }) => ({
  height: '100%',
  backgroundColor: '#fff',
  border: `1px solid ${theme.palette.divider}`,
  boxShadow: 'none',
}));

export const RiskCardStyled = styled(Card)<{ severity: 'error' | 'warning' }>(({ theme, severity }) => ({
  height: '100%',
  backgroundColor: severity === 'error' ? '#FEF2F2' : '#FFFBEB',
  borderLeft: `4px solid ${severity === 'error' ? '#DC2626' : '#D97706'}`,
  boxShadow: 'none',
}));
