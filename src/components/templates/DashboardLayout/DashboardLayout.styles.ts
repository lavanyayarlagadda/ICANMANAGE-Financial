import { styled } from '@mui/material/styles';
import { Box, SxProps, Theme } from '@mui/material';
import { themeConfig } from '@/theme/themeConfig';

export const DRAWER_WIDTH = 240;
export const DRAWER_COLLAPSED_WIDTH = 64;

export const PageWrapper = styled(Box)(({ theme }) => ({
  height: '100vh',
  width: '100vw',
  overflow: 'hidden',
  backgroundColor: theme.palette.background.default,
  position: 'relative'
}));

export const MainContentWrapper = styled(Box)(() => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  display: 'flex',
  flexDirection: 'column',
  overflowY: 'auto',
  overflowX: 'hidden',
  zIndex: 1,
}));

export const ContentArea = styled(Box)<{ component?: React.ElementType }>(({ theme }) => ({
  flex: 1,
  padding: theme.spacing(3),
  overflowY: 'auto',
  overflowX: 'hidden',
  minWidth: 0,
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
  }
}));

export const GlobalOverlay = styled(Box)(({ theme }) => ({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: themeConfig.colors.overlay.white,
  backdropFilter: 'blur(4px)',
  zIndex: 99999,
  cursor: 'wait',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing(2)
}));

export const NavItemStyles = (sidebarCollapsed: boolean, theme: Theme): SxProps<Theme> => ({
  mx: sidebarCollapsed ? 0.5 : 1,
  borderRadius: 1,
  mb: 0.5,
  justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
  px: sidebarCollapsed ? 1 : 2,
  '&.Mui-selected': {
    backgroundColor: `${theme.palette.primary.main}12`,
    color: theme.palette.primary.main,
    '& .MuiListItemIcon-root': { color: theme.palette.primary.main },
  },
});
