import { themeConfig } from '@/theme';

export const dialogStyles: any = {
  borderRadius: 2,
  p: 1,
};

export const configureUserBoxStyles: any = {
  border: `1px solid ${themeConfig.colors.primaryLight}40`,
  borderRadius: 2,
  p: 2,
  mb: 3,
  backgroundColor: `${themeConfig.colors.primaryLight}10`,
};

export const accordionListStyles: any = {
  border: `1px solid ${themeConfig.colors.border}`,
  borderRadius: 2,
  overflow: 'hidden',
};

export const securitySettingsBoxStyles: any = {
  border: `1px solid ${themeConfig.colors.border}`,
  borderRadius: 2,
  p: 2,
};

export const searchFieldStyles: any = {
  width: { xs: '100%', sm: 250 },
  backgroundColor: '#FAFBFC',
  '& .MuiOutlinedInput-root': { borderRadius: 2 },
};

export const statusSelectStyles: any = {
  height: 32,
  fontSize: '0.8rem',
  backgroundColor: themeConfig.colors.surface,
  '& .MuiSelect-select': { display: 'flex', alignItems: 'center', pr: '28px !important' },
};
