import { SxProps, Theme } from '@mui/material';
import { themeConfig } from '@/theme/themeConfig';

export const cardStyles: SxProps<Theme> = {
  mb: 3,
  boxShadow: themeConfig.shadows.card,
  borderRadius: 2,
};

export const cardContentStyles: SxProps<Theme> = {
  p: { xs: 2, md: 3 },
};

export const labelContainerStyles: SxProps<Theme> = {
  mb: 1.5,
};

export const labelStyles: SxProps<Theme> = {
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '0.03em',
};

export const valueStyles: SxProps<Theme> = {
  typography: 'body2',
  fontWeight: 500,
};

export const sectionTitleStyles: SxProps<Theme> = {
  fontWeight: 600,
  mb: 2,
};

export const footerContainerStyles: SxProps<Theme> = {
  mt: 2,
  pt: 2,
  borderTop: `1px solid ${themeConfig.colors.border}`,
};
