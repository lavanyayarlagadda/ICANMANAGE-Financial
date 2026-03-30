import { SxProps, Theme } from '@mui/material';
import { themeConfig } from '@/theme/themeConfig';

export const offsetChipStyles: SxProps<Theme> = {
  height: 20,
  fontSize: '10px',
  fontWeight: 700,
  bgcolor: themeConfig.colors.accent + '18',
  color: themeConfig.colors.accentDark,
  border: `1px solid ${themeConfig.colors.accent + '33'}`
};

export const offsetGridStyles: SxProps<Theme> = {
  display: "grid",
  gridTemplateColumns: "1.2fr 2fr 1fr",
  minWidth: 500,
  px: 2,
  py: 1,
};

export const noticeIdStyles: SxProps<Theme> = {
  fontWeight: 700,
  color: themeConfig.colors.primaryDark
};

export const boldStyles: SxProps<Theme> = {
  fontWeight: 700,
};

export const errorAmountStyles: SxProps<Theme> = {
  fontWeight: 700,
  color: 'error.main'
};
