import { themeConfig } from '@/theme/themeConfig';

export const monospaceStyles: any = {
  fontFamily: 'monospace',
};

export const amountStyles = (theme: any): any => ({
  fontFamily: 'monospace',
  fontWeight: 600,
  color: theme.palette.error.main,
});

export const reasonStyles: any = {
  fontSize: '0.8rem',
  color: themeConfig.colors.text.secondary,
};

export const boldStyles: any = {
  fontWeight: 600,
  color: themeConfig.colors.text.primary,
};
