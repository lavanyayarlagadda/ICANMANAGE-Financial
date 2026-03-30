import { SxProps, Theme } from '@mui/material';
import { themeConfig } from '@/theme';

export const dialogStyles: SxProps<Theme> = {
  borderRadius: 2,
  p: 1,
};

export const configureUserBoxStyles: SxProps<Theme> = {
  border: `1px solid ${themeConfig.colors.primaryLight}40`,
  borderRadius: 2,
  p: 2,
  mb: 3,
  backgroundColor: `${themeConfig.colors.primaryLight}10`,
};

export const accordionListStyles: SxProps<Theme> = {
  border: `1px solid ${themeConfig.colors.border}`,
  borderRadius: 2,
  overflow: 'hidden',
};

export const securitySettingsBoxStyles: SxProps<Theme> = {
  border: `1px solid ${themeConfig.colors.border}`,
  borderRadius: 2,
  p: 2,
};

export const searchFieldStyles: SxProps<Theme> = {
  width: { xs: '100%', sm: 250 },
  backgroundColor: '#FAFBFC',
  '& .MuiOutlinedInput-root': { borderRadius: 2 },
};

export const statusSelectStyles: SxProps<Theme> = {
  height: 32,
  fontSize: '0.8rem',
  backgroundColor: themeConfig.colors.surface,
  '& .MuiSelect-select': { display: 'flex', alignItems: 'center', pr: '28px !important' },
};
