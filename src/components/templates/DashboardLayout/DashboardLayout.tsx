import React from 'react';
import {
  Box,
  CssBaseline,
  Toolbar,
  useTheme,
  useMediaQuery,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
  Snackbar,
  Alert,
  Tooltip,
  CircularProgress,
} from '@mui/material';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import { NAV_CONFIG } from '@/config/navigation';
import TopNavBar from '@/components/organisms/TopNavBar/TopNavBar';
import Footer from '@/components/organisms/Footer/Footer';
import { MENU_STATUS } from '@/config/constants';
import {
  DRAWER_WIDTH,
  DRAWER_COLLAPSED_WIDTH,
  PageWrapper,
  MainContentWrapper,
  ContentArea,
  GlobalOverlay,
  NavItemStyles
} from './DashboardLayout.styles';
import { useDashboardLayout } from './DashboardLayout.hook';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const {
    isOverlayActive,
    isWaitingForTenants,
    sidebar,
    getMenuStatus,
    handleNavClick,
    handleMenuToggle,
    handleSnackbarClose,
    handleMobileMenuClose,
    tenant,
    ui
  } = useDashboardLayout();

  const {
    mobileMenuOpen,
    sidebarCollapsed,
    snackbarOpen,
    snackbarMessage,
    snackbarSeverity,
  } = ui;

  const drawerWidth = sidebarCollapsed ? DRAWER_COLLAPSED_WIDTH : DRAWER_WIDTH;

  const drawerContent = (
    <Box sx={{ pt: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
      {sidebar.map((item) => {
        const config = NAV_CONFIG[item.label];
        const Icon = config?.icon || AccountBalanceIcon;
        const status = getMenuStatus(item.label);

        if (status === 'Hidden') return null;

        return (
          <List key={item.id} disablePadding>
            <Tooltip title={sidebarCollapsed ? item.label : ''} placement="right">
              <ListItemButton
                disabled={status === 'Disabled'}
                selected={ui.activePage === item.label.toLowerCase()}
                onClick={() => status !== 'Disabled' && handleNavClick(item.label.toLowerCase(), item.path)}
                sx={NavItemStyles(sidebarCollapsed, theme)}
              >
                <ListItemIcon sx={{ minWidth: sidebarCollapsed ? 0 : 36, justifyContent: 'center' }}>
                  <Icon fontSize="small" />
                </ListItemIcon>
                {!sidebarCollapsed && (
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{ variant: 'body2', fontWeight: 600 }}
                  />
                )}
              </ListItemButton>
            </Tooltip>
          </List>
        );
      })}
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden', backgroundColor: theme.palette.background.default }}>
      {/* Global Interaction Blocker */}
      {isOverlayActive && (
        <GlobalOverlay>
          <CircularProgress size={60} thickness={4} />
          <Typography variant="h6" color="primary" sx={{ fontWeight: 600 }}>
            {tenant.isLoading || isWaitingForTenants ? 'Initializing Organization...' : (ui.isReloading ? 'Refreshing Data...' :
              (ui.activeExportType ? 'Preparing Report...' :
                (ui.isGlobalFetching ? 'Please Wait...' : 'Processing...')))}
          </Typography>
        </GlobalOverlay>
      )}

      <CssBaseline />
      <TopNavBar onMenuToggle={handleMenuToggle} />

      {!isMobile && (
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            transition: theme.transitions.create('width', { duration: theme.transitions.duration.shorter }),
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
              borderRight: 'none',
              backgroundColor: theme.palette.background.paper,
              transition: theme.transitions.create('width', { duration: theme.transitions.duration.shorter }),
              overflowX: 'hidden',
            },
          }}
        >
          <Toolbar />
          {drawerContent}
        </Drawer>
      )}

      {isMobile && (
        <Drawer
          variant="temporary"
          open={mobileMenuOpen}
          onClose={handleMobileMenuClose}
          sx={{ '& .MuiDrawer-paper': { width: DRAWER_WIDTH, backgroundColor: theme.palette.background.paper } }}
        >
          <Toolbar />
          {drawerContent}
        </Drawer>
      )}

      <MainContentWrapper>
        <Toolbar />
        <ContentArea component="main">
          {!isWaitingForTenants && children}
        </ContentArea>
        <Footer />
      </MainContentWrapper>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default DashboardLayout;
