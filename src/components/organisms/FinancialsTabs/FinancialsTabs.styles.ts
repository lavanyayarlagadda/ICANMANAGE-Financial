import { SxProps, Theme } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { themeConfig } from '@/theme/themeConfig';

export const containerStyles: SxProps<Theme> = {
  mb: 1,
};

export const mainTabsRowStyles = (theme: Theme, isTablet: boolean): SxProps<Theme> => ({
  px: 2,
  py: 1.5,
  display: 'flex',
  flexDirection: isTablet ? 'column' : 'row',
  alignItems: isTablet ? 'flex-start' : 'center',
  backgroundColor: themeConfig.colors.tabs.mainBg,
  borderBottom: `1px solid ${theme.palette.divider}`,
  gap: isTablet ? 1.5 : 0,
});

export const mainTitleStyles: SxProps<Theme> = {
  fontWeight: 700,
  fontSize: '20px',
  color: themeConfig.colors.tabs.textTitle,
};

export const tabletSelectStyles = (theme: Theme): SxProps<Theme> => ({
  backgroundColor: themeConfig.colors.tabs.inactiveBg,
  borderRadius: '8px',
  fontWeight: 600,
  fontSize: '14px',
  '& .MuiOutlinedInput-notchedOutline': { borderColor: theme.palette.divider },
});

export const mainTabItemStyles = (isActive: boolean, isDisabled?: boolean): SxProps<Theme> => ({
  px: 2,
  py: 1,
  borderRadius: '6px',
  cursor: isDisabled ? 'not-allowed' : 'pointer',
  backgroundColor: isDisabled 
    ? themeConfig.colors.slate[50] 
    : (isActive ? themeConfig.colors.tabs.activeBg : themeConfig.colors.tabs.inactiveBg),
  color: isDisabled 
    ? themeConfig.colors.slate[300] 
    : (isActive ? themeConfig.colors.tabs.textActive : themeConfig.colors.tabs.textInactive),
  fontWeight: isActive ? 600 : 500,
  fontSize: '13px',
  whiteSpace: 'nowrap',
  transition: 'all 0.2s',
  opacity: isDisabled ? 0.6 : 1,
  '&:hover': {
    backgroundColor: isDisabled 
      ? themeConfig.colors.slate[50] 
      : (isActive ? themeConfig.colors.tabs.activeBgHover : themeConfig.colors.tabs.inactiveBgHover),
  },
});

export const subTabsRowStyles = (isMobile: boolean): SxProps<Theme> => ({
  px: 2,
  py: 1.5,
  display: 'flex',
  flexDirection: isMobile ? 'column' : 'row',
  justifyContent: isMobile ? 'flex-start' : 'space-between',
  alignItems: isMobile ? 'stretch' : 'center',
  backgroundColor: themeConfig.colors.tabs.subBg,
  gap: 2,
});

export const subTabItemStyles = (isActive: boolean, isDisabled?: boolean): SxProps<Theme> => ({
  px: 1.5,
  py: 0.5,
  borderRadius: '16px',
  cursor: isDisabled ? 'not-allowed' : 'pointer',
  backgroundColor: isDisabled 
    ? alpha(themeConfig.colors.slate[100], 0.5) 
    : (isActive ? themeConfig.colors.tabs.activeBgHover : 'transparent'),
  color: isDisabled 
    ? themeConfig.colors.slate[300] 
    : (isActive ? themeConfig.colors.tabs.textActive : themeConfig.colors.tabs.textInactive),
  fontWeight: 500,
  fontSize: '13px',
  whiteSpace: 'nowrap',
  transition: 'all 0.2s',
  border: isDisabled ? `1px dashed ${themeConfig.colors.slate[200]}` : 'none',
  '&:hover': {
    backgroundColor: isDisabled 
      ? alpha(themeConfig.colors.slate[100], 0.5) 
      : (isActive ? alpha(themeConfig.colors.primary, 0.8) : themeConfig.colors.tabs.subBg),
  },
});

export const actionsGroupStyles = (isMobile: boolean): SxProps<Theme> => ({
  display: 'flex',
  gap: 1.5,
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: isMobile ? 'flex-start' : 'flex-end',
});

export const printButtonStyles = (isMobile: boolean): SxProps<Theme> => ({
  color: themeConfig.colors.slate[600],
  borderColor: themeConfig.colors.slate[200],
  borderRadius: '6px',
  textTransform: 'none',
  px: 2,
  py: 0.7,
  fontSize: '13px',
  fontWeight: 500,
  backgroundColor: themeConfig.colors.surface,
  flex: isMobile ? 1 : 'unset',
  minWidth: isMobile ? 'calc(50% - 12px)' : 'unset',
  '&:hover': { borderColor: themeConfig.colors.slate[300], bgcolor: themeConfig.colors.slate[50] },
});

export const reloadButtonStyles = (isMobile: boolean): SxProps<Theme> => ({
  color: themeConfig.colors.text.primary,
  borderColor: themeConfig.colors.text.primary,
  borderWidth: 1.5,
  borderRadius: '6px',
  textTransform: 'none',
  px: 2,
  py: 0.7,
  fontSize: '13px',
  fontWeight: 700,
  flex: isMobile ? 1 : 'unset',
  minWidth: isMobile ? 'calc(50% - 12px)' : 'unset',
  '&:hover': { borderWidth: 1.5, bgcolor: alpha(themeConfig.colors.text.primary, 0.04) },
});

export const exportButtonStyles = (isMobile: boolean): SxProps<Theme> => ({
  bgcolor: themeConfig.colors.amber,
  color: themeConfig.colors.surface,
  borderRadius: '6px',
  textTransform: 'none',
  px: 3,
  py: 0.7,
  fontSize: '13px',
  fontWeight: 600,
  width: isMobile ? '100%' : 'unset',
  '&:hover': { bgcolor: themeConfig.colors.amberDark },
});
