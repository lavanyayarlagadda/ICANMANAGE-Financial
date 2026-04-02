import { SxProps, Theme } from '@mui/material';
import { themeConfig } from '@/theme/themeConfig';

export const cardStyles: SxProps<Theme> = {
  height: '100%',
  transition: 'box-shadow 0.2s ease',
  '&:hover': {
    boxShadow: themeConfig.shadows.cardHover,
  },
};

export const cardContentStyles: SxProps<Theme> = {
  p: { xs: 2, md: 3 },
  '&:last-child': { pb: { xs: 2, md: 3 } },
};

export const labelStyles: SxProps<Theme> = {
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  fontWeight: 600,
};

export const valueStyles: SxProps<Theme> = {
  fontWeight: 700,
  mb: 0.5,
};
