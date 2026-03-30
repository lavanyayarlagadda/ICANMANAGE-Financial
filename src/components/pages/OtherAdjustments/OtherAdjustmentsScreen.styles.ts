import { SxProps, Theme } from '@mui/material';
import { themeConfig } from '@/theme/themeConfig';

export const adjustmentTypeColors: Record<string, string> = {
  'WRITE-OFF': themeConfig.colors.error,
  'CREDIT': themeConfig.colors.info,
  'INTEREST': themeConfig.colors.accentDark,
  'CONTRACTUAL': themeConfig.colors.primaryDark,
  'REFUND': '#00838F', // Specialized color maintained for branding if needed
  'TRANSFER': themeConfig.colors.accent,
  'RECLASSIFICATION': '#37474F',
  'CHARITY': themeConfig.colors.success,
};

export const adjustmentChipStyles = (type: string): SxProps<Theme> => ({
  backgroundColor: `${adjustmentTypeColors[type] || '#616161'}18`,
  color: adjustmentTypeColors[type] || '#616161',
  fontWeight: 600,
  fontSize: '0.7rem',
});

export const amountStyles = (amount: number, theme: Theme): SxProps<Theme> => ({
  fontFamily: 'monospace',
  fontWeight: 600,
  color: amount < 0 ? theme.palette.error.main : amount > 0 ? theme.palette.success.main : theme.palette.text.primary,
});
