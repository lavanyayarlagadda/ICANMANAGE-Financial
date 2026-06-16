import React from 'react';
import {
  CssBaseline,
  useTheme,
  useMediaQuery,
  List,
  ListItemText,
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
  DrawerContentWrapper,
  StyledListItemButton,
  StyledListItemIcon,
  ErrorIconTypography,
  ErrorTitleTypography,
  ErrorDescTypography,
  LoadingTitleTypography,
  LoadingDescTypography,
  LoadingWaitTypography,
  PermanentDrawer,
  TemporaryDrawer,
  EmptyToolbar,
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
    hasInitError,
    sidebar,
    getMenuStatus,
    handleNavClick,
    handleMenuToggle,
    handleMobileMenuClose,
    tenant,
    ui,
    financials,
  } = useDashboardLayout();

  const { mobileMenuOpen, sidebarCollapsed } = ui;

  const drawerWidth = sidebarCollapsed ? DRAWER_COLLAPSED_WIDTH : DRAWER_WIDTH;

  const drawerContent = (
    <DrawerContentWrapper>
      {sidebar.map((item) => {
        const config = NAV_CONFIG[item.label];
        const Icon = config?.icon || AccountBalanceIcon;
        const status = getMenuStatus(item.label);

        if (status === 'Hidden') return null;

        return (
          <List key={item.id} disablePadding>
            <Tooltip
              title={
                status === 'Disabled'
                  ? 'This module is currently unavailable'
                  : sidebarCollapsed
                    ? item.label
                    : ''
              }
              placement="right"
              arrow
            >
              <StyledListItemButton
                sidebarCollapsed={sidebarCollapsed}
                disabled={status === 'Disabled'}
                selected={ui.activePage === item.label.toLowerCase()}
                onClick={() =>
                  status !== 'Disabled' && handleNavClick(item.label.toLowerCase(), item.path)
                }
              >
                <StyledListItemIcon sidebarCollapsed={sidebarCollapsed}>
                  <Icon fontSize="small" />
                </StyledListItemIcon>
                {!sidebarCollapsed && (
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{ variant: 'body2', fontWeight: 600 }}
                  />
                )}
              </StyledListItemButton>
            </Tooltip>
          </List>
        );
      })}
    </DrawerContentWrapper>
  );

  return (
    <PageWrapper>
      {/* Full-Screen Blurred Loader / Error Overlay */}
      {isOverlayActive && (
        <GlobalOverlay>
          {hasInitError ? (
            <>
              <ErrorIconTypography variant="h4" color="error">
                ⚠️
              </ErrorIconTypography>
              <ErrorTitleTypography variant="h6" color="error">
                Initialization Failed
              </ErrorTitleTypography>
              <ErrorDescTypography variant="body2" color="text.secondary">
                We could not load your user permissions or organization details. Please refresh the
                page or try logging out and back in.
              </ErrorDescTypography>
            </>
          ) : (
            <>
              <CircularProgress size={60} thickness={4} />
              <LoadingTitleTypography variant="h6" color="primary">
                {tenant.isLoading || isWaitingForTenants
                  ? 'Loading Your Organizations...'
                  : isLoadingDetails
                    ? 'Authorizing Account & Permissions...'
                    : ui.isReloading
                      ? 'Syncing Fresh Financial Data...'
                      : ui.activeExportType
                        ? `Generating ${ui.activeExportType.toUpperCase()} Report`
                        : ui.isDrillingDown
                          ? 'Resolving Transaction Details...'
                          : ui.isGlobalFetching || financials.loading
                            ? 'Fetching Records...'
                            : 'Configuring View...'}
              </LoadingTitleTypography>

              {ui.activeExportType ? (
                <LoadingDescTypography variant="body2" color="text.secondary">
                  Your report is being prepared. Due to the high volume of data, this may take a
                  moment. Your file will download automatically once ready.
                </LoadingDescTypography>
              ) : (
                <LoadingWaitTypography variant="body2" color="text.secondary">
                  Please wait while we load your data securely...
                </LoadingWaitTypography>
              )}
            </>
          )}
        </GlobalOverlay>
      )}

      <CssBaseline />
      <TopNavBar onMenuToggle={handleMenuToggle} />

      {!isMobile && (
        <PermanentDrawer variant="permanent" drawerWidth={drawerWidth}>
          <EmptyToolbar />
          {drawerContent}
        </PermanentDrawer>
      )}

      {isMobile && (
        <TemporaryDrawer variant="temporary" open={mobileMenuOpen} onClose={handleMobileMenuClose}>
          <EmptyToolbar />
          {drawerContent}
        </TemporaryDrawer>
      )}

      <MainContentWrapper drawerWidth={isMobile ? 0 : drawerWidth}>
        <EmptyToolbar />
        <ContentArea component="main">{!isWaitingForTenants && children}</ContentArea>
      </MainContentWrapper>
      <Footer />
    </PageWrapper>
  );
};

export default DashboardLayout;
