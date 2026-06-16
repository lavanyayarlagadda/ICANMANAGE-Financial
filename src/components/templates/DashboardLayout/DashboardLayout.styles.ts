import { styled } from '@mui/material/styles';
import { Box, Drawer, ListItemButton, ListItemIcon, Toolbar, Typography } from '@mui/material';
import { themeConfig } from '@/theme/themeConfig';

export const DRAWER_WIDTH = 240;
export const DRAWER_COLLAPSED_WIDTH = 64;

export const PageWrapper = styled(Box)(({ theme }) => ({
  height: '100vh',
  width: '100vw',
  overflow: 'hidden',
  backgroundColor: theme.palette.background.default,
  position: 'relative',
}));

export const MainContentWrapper = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'drawerWidth',
})<{ drawerWidth: number }>(({ drawerWidth }) => ({
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
  paddingLeft: `${drawerWidth}px`,
}));

export const ContentArea = styled(Box)<{ component?: React.ElementType }>(({ theme }) => ({
  flex: 1,
  padding: theme.spacing(3),
  overflowY: 'auto',
  overflowX: 'hidden',
  minWidth: 0,
  paddingBottom: theme.spacing(8),
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
  },
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
  gap: theme.spacing(2),
}));

export const DrawerContentWrapper = styled(Box)(({ theme }) => ({
  paddingTop: theme.spacing(1),
  display: 'flex',
  flexDirection: 'column',
  pointerEvents: 'none',
}));

export const StyledListItemButton = styled(ListItemButton, {
  shouldForwardProp: (prop) => prop !== 'sidebarCollapsed',
})<{ sidebarCollapsed: boolean }>(({ theme, sidebarCollapsed }) => ({
  margin: theme.spacing(0, sidebarCollapsed ? 0.5 : 1),
  borderRadius: theme.shape.borderRadius,
  marginBottom: theme.spacing(0.5),
  justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
  padding: theme.spacing(0, sidebarCollapsed ? 1 : 2),
  pointerEvents: 'auto',
  '&.Mui-selected': {
    backgroundColor: `${theme.palette.primary.main}12`,
    color: theme.palette.primary.main,
    '& .MuiListItemIcon-root': { color: theme.palette.primary.main },
  },
  '&.Mui-disabled': {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
}));

export const StyledListItemIcon = styled(ListItemIcon, {
  shouldForwardProp: (prop) => prop !== 'sidebarCollapsed',
})<{ sidebarCollapsed: boolean }>(({ sidebarCollapsed }) => ({
  minWidth: sidebarCollapsed ? 0 : 36,
  justifyContent: 'center',
}));

export const ErrorIconTypography = styled(Typography)({
  marginBottom: '16px',
});

export const ErrorTitleTypography = styled(Typography)({
  fontWeight: 600,
});

export const ErrorDescTypography = styled(Typography)({
  opacity: 0.8,
  marginTop: '8px',
  maxWidth: 400,
  textAlign: 'center',
});

export const LoadingTitleTypography = styled(Typography)({
  fontWeight: 600,
  marginTop: '16px',
});

export const LoadingDescTypography = styled(Typography)({
  opacity: 0.8,
  marginTop: '8px',
  maxWidth: 450,
  textAlign: 'center',
});

export const LoadingWaitTypography = styled(Typography)({
  opacity: 0.8,
  marginTop: '8px',
});

export const PermanentDrawer = styled(Drawer, {
  shouldForwardProp: (prop) => prop !== 'drawerWidth',
})<{ drawerWidth: number }>(({ theme, drawerWidth }) => ({
  width: drawerWidth,
  flexShrink: 0,
  '& .MuiDrawer-paper': {
    width: drawerWidth,
    boxSizing: 'border-box',
    borderRight: 'none',
    backgroundColor: theme.palette.background.paper,
    overflowX: 'hidden',
    position: 'sticky',
    top: 0,
    height: '100vh',
    pointerEvents: 'none',
  },
}));

export const TemporaryDrawer = styled(Drawer)(({ theme }) => ({
  '& .MuiDrawer-paper': {
    width: DRAWER_WIDTH,
    backgroundColor: theme.palette.background.paper,
  },
}));

export const EmptyToolbar = styled(Toolbar)({
  pointerEvents: 'none',
});
