import { SxProps, Theme } from '@mui/material';
import { themeConfig } from '@/theme/themeConfig';

export const monospaceStyles: SxProps<Theme> = {
  fontFamily: 'monospace',
};

export const amountStyles = (theme: Theme): SxProps<Theme> => ({
  fontFamily: 'monospace',
  fontWeight: 600,
  color: theme.palette.error.main,
});

export const reasonStyles: SxProps<Theme> = {
  fontSize: '0.8rem',
  color: themeConfig.colors.text.secondary,
};

export const boldStyles: SxProps<Theme> = {
  fontWeight: 600,
  color: themeConfig.colors.text.primary,
};
