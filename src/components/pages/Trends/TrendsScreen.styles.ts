import { styled } from '@mui/material/styles';
import { Box, Typography, Card } from '@mui/material';
import { themeConfig } from '@/theme/themeConfig';

export const TrendsWrapper = styled(Box)(({ theme }) => ({
  padding: 0,
}));

export const SectionHeader = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(3),
}));

export const TitleText = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  color: themeConfig.colors.text.primary,
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

export const PieChartWrapper = styled(Box)(({ theme }) => ({
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
  backgroundColor: severity === 'error' ? themeConfig.colors.error + '10' : themeConfig.colors.accent + '10',
  borderLeft: `4px solid ${severity === 'error' ? themeConfig.colors.error : themeConfig.colors.accent}`,
  boxShadow: 'none',
}));
