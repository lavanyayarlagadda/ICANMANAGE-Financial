import { SxProps, Theme } from '@mui/material';
import { themeConfig } from '@/theme/themeConfig';

export const menuPaperProps: SxProps<Theme> = {
  minWidth: 160,
  boxShadow: themeConfig.shadows.cardHover,
};

export const errorMenuItemStyles: SxProps<Theme> = {
  color: 'error.main',
};
