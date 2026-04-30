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
  Typography,
  Tooltip,
  CircularProgress,
} from '@mui/material';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import { NAV_CONFIG } from '@/config/navigation';
import TopNavBar from '@/components/organisms/TopNavBar/TopNavBar';
import Footer from '@/components/organisms/Footer/Footer';
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
    isLoadingDetails,
    isWaitingForTenants,
    sidebar,
    getMenuStatus,
    handleNavClick,
    handleMenuToggle,
    handleMobileMenuClose,
    tenant,
    ui,
    financials,
  } = useDashboardLayout();

  const {
    mobileMenuOpen,
    sidebarCollapsed,
  } = ui;

  const drawerWidth = sidebarCollapsed ? DRAWER_COLLAPSED_WIDTH : DRAWER_WIDTH;

  const drawerContent = (
    <Box sx={{ pt: 1, display: 'flex', flexDirection: 'column', pointerEvents: 'none' }}>
      {sidebar.map((item) => {
        const config = NAV_CONFIG[item.label];
        const Icon = config?.icon || AccountBalanceIcon;
        const status = getMenuStatus(item.label);

        if (status === 'Hidden') return null;

        return (
          <List key={item.id} disablePadding>
            <Tooltip
              title={status === 'Disabled' ? "This module is currently unavailable" : (sidebarCollapsed ? item.label : '')}
              placement="right"
              arrow
            >
              <ListItemButton
                disabled={status === 'Disabled'}
                selected={ui.activePage === item.label.toLowerCase()}
                onClick={() => status !== 'Disabled' && handleNavClick(item.label.toLowerCase(), item.path)}
                sx={{
                  ...NavItemStyles(sidebarCollapsed, theme),
                  pointerEvents: 'auto',
                  '&.Mui-disabled': {
                    opacity: 0.5,
                    cursor: 'not-allowed'
                  }
                }}
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
    <PageWrapper>
      {/* Full-Screen Blurred Loader */}
      {isOverlayActive && (
        <GlobalOverlay>
          <CircularProgress size={60} thickness={4} />
          <Typography variant="h6" color="primary" sx={{ fontWeight: 600, mt: 2 }}>
            {tenant.isLoading || isWaitingForTenants
              ? 'Loading Your Organizations...'
              : (isLoadingDetails
                ? 'Authorizing Account & Permissions...'
                : (ui.isReloading
                  ? 'Syncing Fresh Financial Data...'
                  : (ui.activeExportType
                    ? `Generating ${ui.activeExportType.toUpperCase()} Report`
                    : (ui.isDrillingDown ? 'Resolving Transaction Details...' : (ui.isGlobalFetching || financials.loading ? 'Fetching Records...' : 'Configuring View...')))))}
          </Typography>

          {ui.activeExportType ? (
            <Typography variant="body2" color="text.secondary" sx={{ opacity: 0.8, mt: 1, maxWidth: 450, textAlign: 'center' }}>
              Your report is being prepared. Due to the high volume of data, this may take a moment. 
              Your file will download automatically once ready.
            </Typography>
          ) : (
            <Typography variant="body2" color="text.secondary" sx={{ opacity: 0.8, mt: 1 }}>
              Please wait while we load your data securely...
            </Typography>
          )}
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
          }}
        >
          <Toolbar sx={{ pointerEvents: 'none' }} />
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
          <Toolbar sx={{ pointerEvents: 'none' }} />
          {drawerContent}
        </Drawer>
      )}

      <MainContentWrapper sx={{ pl: isMobile ? 0 : `${drawerWidth}px` }}>
        <Toolbar sx={{ pointerEvents: 'none' }} />
        <ContentArea component="main" sx={{ pb: 8, overflow: 'visible' }}>
          {!isWaitingForTenants && children}
        </ContentArea>
      </MainContentWrapper>
      <Footer />

    </PageWrapper>
  );
};

export default DashboardLayout;
