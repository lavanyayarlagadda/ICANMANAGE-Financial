import { SxProps, Theme } from '@mui/material';
import { themeConfig } from '@/theme/themeConfig';

export const adjustmentTypeColors: Record<string, string> = {
  'WRITE-OFF': themeConfig.colors.error,
  'CREDIT': themeConfig.colors.info,
  'INTEREST': themeConfig.colors.accentDark,
  'CONTRACTUAL': themeConfig.colors.primaryDark,
  'REFUND': themeConfig.colors.charts.teal,
  'TRANSFER': themeConfig.colors.accent,
  'RECLASSIFICATION': themeConfig.colors.slate[700],
  'CHARITY': themeConfig.colors.success,
};

export const adjustmentChipStyles = (type: string): SxProps<Theme> => ({
  backgroundColor: `${adjustmentTypeColors[type] || themeConfig.colors.slate[500]}18`,
  color: adjustmentTypeColors[type] || themeConfig.colors.slate[500],
  fontWeight: 600,
  fontSize: '0.7rem',
});

export const amountStyles = (amount: number, theme: Theme): SxProps<Theme> => ({
  fontFamily: 'monospace',
  fontWeight: 600,
  color: amount < 0 ? theme.palette.error.main : amount > 0 ? theme.palette.success.main : theme.palette.text.primary,
});
