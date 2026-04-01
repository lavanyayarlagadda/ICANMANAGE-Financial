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
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
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
      canViewPip,
      canViewCollections,
      canViewFinancials,
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
      {/* Collections Section */}
      {/* {canViewCollections && (
        <List disablePadding>
          <Tooltip title={sidebarCollapsed ? 'Collections' : ''} placement="right">
            <ListItemButton
              disabled={getMenuStatus('Collections') === MENU_STATUS.DISABLED}
              selected={ui.activePage === 'collections'}
              onClick={() => getMenuStatus('Collections') !== MENU_STATUS.DISABLED && handleNavClick('collections')}
              sx={NavItemStyles(sidebarCollapsed, theme)}
            >
              <ListItemIcon sx={{ minWidth: sidebarCollapsed ? 0 : 36, justifyContent: 'center' }}><ReceiptLongIcon fontSize="small" /></ListItemIcon>
              {!sidebarCollapsed && <ListItemText primary="Collections" primaryTypographyProps={{ variant: 'body2', fontWeight: 600 }} />}
            </ListItemButton>
          </Tooltip>
        </List>
      )} */}

      {/* <Divider sx={{ mx: sidebarCollapsed ? 0.5 : 2, my: 1 }} /> */}

      {/* Financials Section */}
      {canViewFinancials && (
        <List disablePadding>
          <Tooltip title={sidebarCollapsed ? 'Financials' : ''} placement="right">
            <ListItemButton
              disabled={getMenuStatus('Financials') === MENU_STATUS.DISABLED}
              selected={ui.activePage === 'financials'}
              onClick={() => getMenuStatus('Financials') !== MENU_STATUS.DISABLED && handleNavClick('financials', '/financials/payments')}
              sx={NavItemStyles(sidebarCollapsed, theme)}
            >
              <ListItemIcon sx={{ minWidth: sidebarCollapsed ? 0 : 36, justifyContent: 'center' }}><AccountBalanceIcon fontSize="small" /></ListItemIcon>
              {!sidebarCollapsed && <ListItemText primary="Financials" primaryTypographyProps={{ variant: 'body2', fontWeight: 600 }} />}
            </ListItemButton>
          </Tooltip>
        </List>
      )}
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
