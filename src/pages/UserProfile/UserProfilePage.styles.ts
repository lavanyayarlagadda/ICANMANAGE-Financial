import { themeConfig } from '@/theme';

export const pageContainerStyles: any = {
  maxWidth: 800,
  margin: '0 auto',
  py: 2,
};

export const headerBoxStyles: any = {
  display: 'flex',
  alignItems: 'center',
  mb: 1,
};

export const tabsContainerStyles: any = {
  backgroundColor: themeConfig.colors.surfaceAlt,
  borderRadius: 2,
  p: 0.5,
  mb: 3,
};

export const tabsStyles: any = {
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
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    }
  }
};

export const cardStyles: any = {
  p: 3,
  border: `1px solid ${themeConfig.colors.border}`,
  boxShadow: 'none',
};

export const textFieldStyles: any = {
  mb: 2,
  backgroundColor: '#FAFBFC',
};

export const actionsBoxStyles: any = {
  display: 'flex',
  justifyContent: 'flex-end',
};
