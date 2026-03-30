import { SxProps, Theme } from '@mui/material';

export const containerStyles: SxProps<Theme> = {
  mb: 1,
};

export const mainTabsRowStyles = (theme: Theme, isTablet: boolean): SxProps<Theme> => ({
  px: 2,
  py: 1.5,
  display: 'flex',
  flexDirection: isTablet ? 'column' : 'row',
  alignItems: isTablet ? 'flex-start' : 'center',
  backgroundColor: '#fff',
  borderBottom: `1px solid ${theme.palette.divider}`,
  gap: isTablet ? 1.5 : 0,
});

export const mainTitleStyles: SxProps<Theme> = {
  fontWeight: 700,
  fontSize: '20px',
  color: 'rgb(10, 22, 40)',
};

export const tabletSelectStyles = (theme: Theme): SxProps<Theme> => ({
  backgroundColor: 'rgba(240, 244, 248, 0.8)',
  borderRadius: '8px',
  fontWeight: 600,
  fontSize: '14px',
  '& .MuiOutlinedInput-notchedOutline': { borderColor: theme.palette.divider },
});

export const mainTabItemStyles = (isActive: boolean): SxProps<Theme> => ({
  px: 2,
  py: 1,
  borderRadius: '6px',
  cursor: 'pointer',
  backgroundColor: isActive ? 'rgba(107, 153, 196, 0.6)' : 'rgba(240, 244, 248, 0.8)',
  color: isActive ? '#fff' : 'rgb(100, 116, 139)',
  fontWeight: isActive ? 600 : 500,
  fontSize: '13px',
  whiteSpace: 'nowrap',
  transition: 'all 0.2s',
  '&:hover': {
    backgroundColor: isActive ? 'rgba(107, 153, 196, 0.7)' : 'rgba(226, 232, 240, 1)',
  },
});

export const subTabsRowStyles = (isMobile: boolean): SxProps<Theme> => ({
  px: 2,
  py: 1.5,
  display: 'flex',
  flexDirection: isMobile ? 'column' : 'row',
  justifyContent: isMobile ? 'flex-start' : 'space-between',
  alignItems: isMobile ? 'stretch' : 'center',
  backgroundColor: '#fcfcfc',
  gap: 2,
});

export const subTabItemStyles = (isActive: boolean): SxProps<Theme> => ({
  px: 1.5,
  py: 0.5,
  borderRadius: '16px',
  cursor: 'pointer',
  backgroundColor: isActive ? 'rgba(107, 153, 196, 0.7)' : 'transparent',
  color: isActive ? '#fff' : 'rgb(100, 116, 139)',
  fontWeight: 500,
  fontSize: '13px',
  whiteSpace: 'nowrap',
  transition: 'all 0.2s',
  '&:hover': {
    backgroundColor: isActive ? 'rgba(107, 153, 196, 0.8)' : 'rgba(241, 245, 249, 1)',
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
  color: 'rgb(71, 85, 105)',
  borderColor: '#e2e8f0',
  borderRadius: '6px',
  textTransform: 'none',
  px: 2,
  py: 0.7,
  fontSize: '13px',
  fontWeight: 500,
  backgroundColor: '#fff',
  flex: isMobile ? 1 : 'unset',
  minWidth: isMobile ? 'calc(50% - 12px)' : 'unset',
  '&:hover': { borderColor: '#cbd5e1', bgcolor: '#f8fafc' },
});

export const reloadButtonStyles = (isMobile: boolean): SxProps<Theme> => ({
  color: '#000',
  borderColor: '#000',
  borderWidth: 1.5,
  borderRadius: '6px',
  textTransform: 'none',
  px: 2,
  py: 0.7,
  fontSize: '13px',
  fontWeight: 700,
  flex: isMobile ? 1 : 'unset',
  minWidth: isMobile ? 'calc(50% - 12px)' : 'unset',
  '&:hover': { borderWidth: 1.5, bgcolor: 'rgba(0,0,0,0.04)' },
});

export const exportButtonStyles = (isMobile: boolean): SxProps<Theme> => ({
  bgcolor: '#d97706',
  color: '#fff',
  borderRadius: '6px',
  textTransform: 'none',
  px: 3,
  py: 0.7,
  fontSize: '13px',
  fontWeight: 600,
  width: isMobile ? '100%' : 'unset',
  '&:hover': { bgcolor: '#b45309' },
});
