import { SxProps, Theme } from '@mui/material';
import { themeConfig } from '@/theme';

export const pageContainerStyles: SxProps<Theme> = {
  maxWidth: 800,
  margin: '0 auto',
  py: 2,
};

export const headerBoxStyles: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  mb: 1,
};

export const tabsContainerStyles: SxProps<Theme> = {
  backgroundColor: themeConfig.colors.surfaceAlt,
  borderRadius: 2,
  p: 0.5,
  mb: 3,
};

export const tabsStyles: SxProps<Theme> = {
  minHeight: 'unset',
  '& .MuiTab-root': {
    py: 1,
    minHeight: 'unset',
    textTransform: 'none',
    fontWeight: 600,
    color: themeConfig.colors.text.secondary,
    borderRadius: 1.5,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 1,
    '&.Mui-selected': {
      color: themeConfig.colors.text.primary,
      backgroundColor: themeConfig.colors.surface,
      boxShadow: `0 1px 3px ${themeConfig.colors.overlay.black}`,
    }
  }
};

export const cardStyles: SxProps<Theme> = {
  p: 3,
  border: `1px solid ${themeConfig.colors.border}`,
  boxShadow: 'none',
};

export const textFieldStyles: SxProps<Theme> = {
  mb: 2,
  backgroundColor: themeConfig.colors.inputBackground,
};

export const actionsBoxStyles: SxProps<Theme> = {
  display: 'flex',
  justifyContent: 'flex-end',
};
