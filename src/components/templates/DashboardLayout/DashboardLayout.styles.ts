import { styled } from '@mui/material/styles';
import { Box, Card, Typography, TextField, Button } from '@mui/material';

export const DRAWER_WIDTH = 240;
export const DRAWER_COLLAPSED_WIDTH = 64;

export const PageWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  height: '100vh',
  overflow: 'hidden',
  backgroundColor: theme.palette.background.default
}));

export const MainContentWrapper = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  display: 'flex',
  flexDirection: 'column',
  height: '100vh',
  minWidth: 0,
  overflow: 'hidden'
}));

export const ContentArea = styled(Box)<{ component?: React.ElementType }>(({ theme }) => ({
  flex: 1,
  minHeight: 0,
  padding: theme.spacing(3),
  overflow: 'auto',
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
  backgroundColor: 'rgba(255, 255, 255, 0.7)',
  zIndex: 99999,
  cursor: 'wait',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing(2)
}));

export const NavItemStyles = (sidebarCollapsed: boolean, theme: any) => ({
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
