import { themeConfig } from '@/theme/themeConfig';

export const offsetChipStyles: any = {
  height: 20,
  fontSize: '10px',
  fontWeight: 700,
  bgcolor: themeConfig.colors.accent + '18',
  color: themeConfig.colors.accentDark,
  border: `1px solid ${themeConfig.colors.accent + '33'}`
};

export const offsetGridStyles: any = {
  display: "grid",
  gridTemplateColumns: "1.2fr 2fr 1fr",
  minWidth: 500,
  px: 2,
  py: 1,
};

export const noticeIdStyles: any = {
  fontWeight: 700,
  color: themeConfig.colors.primaryDark
};

export const boldStyles: any = {
  fontWeight: 700,
};

export const errorAmountStyles: any = {
  fontWeight: 700,
  color: 'error.main'
};
