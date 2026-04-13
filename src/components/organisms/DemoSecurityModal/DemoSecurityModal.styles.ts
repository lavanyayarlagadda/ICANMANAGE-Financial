import { SxProps, Theme, alpha } from '@mui/material';
import { themeConfig } from '@/theme/themeConfig';

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
  backgroundColor: themeConfig.colors.surfaceSubtle,
  '& .MuiOutlinedInput-root': { borderRadius: 2 },
};

export const statusSelectStyles: SxProps<Theme> = {
  height: 32,
  fontSize: '0.8rem',
  backgroundColor: themeConfig.colors.surface,
  '& .MuiSelect-select': { display: 'flex', alignItems: 'center', pr: '28px !important' },
};
export const treeItemStyles = (level: number, isLevel0: boolean, isLevel1: boolean): SxProps<Theme> => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  p: { xs: 1.2, sm: 1.5 },
  pl: { xs: 2 + level * 2, sm: isLevel0 ? 4 : (isLevel1 ? 7 : 10) },
  borderBottom: `1px solid ${themeConfig.colors.border}`,
  backgroundColor: isLevel0 ? 'transparent' : (isLevel1 ? alpha(themeConfig.colors.primary, 0.03) : alpha(themeConfig.colors.primary, 0.01)),
  transition: 'background-color 0.2s',
  '&:hover': {
    backgroundColor: alpha(themeConfig.colors.primary, 0.05)
  }
});

export const treeTextStyles = (isLevel0: boolean, isLevel1: boolean): SxProps<Theme> => ({
  color: isLevel0 ? themeConfig.colors.primary : (isLevel1 ? 'text.primary' : 'text.secondary'),
  fontSize: isLevel0 ? '0.9rem' : (isLevel1 ? '0.825rem' : '0.775rem'),
  fontWeight: isLevel0 ? 700 : (isLevel1 ? 600 : 500),
  wordBreak: 'break-word',
  letterSpacing: isLevel0 ? '0.01em' : 'normal'
});

export const treeBulletStyles: SxProps<Theme> = {
  width: 6,
  height: 6,
  borderRadius: '50%',
  backgroundColor: themeConfig.colors.slate[300],
  flexShrink: 0
};
