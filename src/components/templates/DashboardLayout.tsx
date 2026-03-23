import React from 'react';
import { useNavigate } from 'react-router-dom';
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
  IconButton,
  Tooltip,
  CircularProgress,
} from '@mui/material';
import PaymentIcon from '@mui/icons-material/Payment';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import DashboardIcon from '@mui/icons-material/Dashboard';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import TopNavBar from '@/components/organisms/TopNavBar';
import Footer from '@/components/organisms/Footer';
import { useAppDispatch, useAppSelector } from '@/store';
import {
  toggleMobileMenu,
  closeMobileMenu,
  closeSnackbar,
  toggleSidebarCollapse,
} from '@/store/slices/uiSlice';

const DRAWER_WIDTH = 240;
const DRAWER_COLLAPSED_WIDTH = 64;

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const dispatch = useAppDispatch();
  const { mobileMenuOpen, activePage, activeTab, sidebarCollapsed, snackbarOpen, snackbarMessage, snackbarSeverity,
    activeExportType, isReloading, isDrillingDown, isGlobalFetching } = useAppSelector((s) => s.ui);
  const { loading: financialsLoading } = useAppSelector((s) => s.financials);

  const user = useAppSelector((state) => state.auth.user);
  const menus = user?.menus || [];

  const getMenuStatus = (label: string) => {
    const findStatus = (menusArray: any[]): string | null => {
      for (const m of menusArray) {
        if (m.menuName?.toLowerCase() === label.toLowerCase()) return m.status;
        if (m.subModules) {
          const sub = findStatus(m.subModules);
          if (sub) return sub;
        }
      }
      return null;
    };
    const status = findStatus(menus);
    // If user has no menus defined, default to 'Visible' for base menus
    if (!menus || menus.length === 0) return 'Visible';
    return status || 'Hidden';
  };

  const drawerWidth = sidebarCollapsed ? DRAWER_COLLAPSED_WIDTH : DRAWER_WIDTH;

  const navigate = useNavigate();

  const handleNavClick = (page: 'financials' | 'collections', path?: string) => {
    dispatch(closeMobileMenu());
    if (page === 'collections') {
      navigate('/collections');
    } else if (path) {
      navigate(path);
    }
  };

  const financialsSubItems = [
    { label: 'All Transactions', tab: 0, path: '/financials/all-transactions', icon: <DashboardIcon fontSize="small" /> },
    { label: 'Payments', tab: 1, path: '/financials/payments', icon: <PaymentIcon fontSize="small" /> },
    { label: 'PIP', tab: 2, path: '/financials/pip', icon: <AccountBalanceIcon fontSize="small" /> },
    { label: 'Forward Balances', tab: 3, path: '/financials/forward-balances', icon: <CompareArrowsIcon fontSize="small" /> },
    { label: 'Recoupments', tab: 4, path: '/financials/recoupments', icon: <ReceiptLongIcon fontSize="small" /> },
    { label: 'Other Adjustments', tab: 5, path: '/financials/other-adjustments', icon: <CompareArrowsIcon fontSize="small" /> },
    { label: 'Variance Analysis', tab: 6, path: '/financials/variance-analysis', icon: <CompareArrowsIcon fontSize="small" /> },
    { label: 'Trends & Forecast', tab: 7, path: '/financials/trends-forecast', icon: <TrendingUpIcon fontSize="small" /> },
  ].filter(item => getMenuStatus(item.label) !== 'Hidden');

  const hasCollections = getMenuStatus('Collections') !== 'Hidden';
  const hasFinancials = getMenuStatus('Financials') !== 'Hidden';

  const drawerContent = (
    <Box sx={{ pt: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Collections Section */}
      {hasCollections && (
        <List disablePadding>
          <Tooltip title={sidebarCollapsed ? 'Collections' : ''} placement="right">
            <ListItemButton
              disabled={getMenuStatus('Collections') === 'Disabled'}
              selected={activePage === 'collections'}
              onClick={() => getMenuStatus('Collections') !== 'Disabled' && handleNavClick('collections')}
              sx={{
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
              }}
            >
              <ListItemIcon sx={{ minWidth: sidebarCollapsed ? 0 : 36, justifyContent: 'center' }}><ReceiptLongIcon fontSize="small" /></ListItemIcon>
              {!sidebarCollapsed && <ListItemText primary="Collections" primaryTypographyProps={{ variant: 'body2', fontWeight: 600 }} />}
            </ListItemButton>
          </Tooltip>
        </List>
      )}

      <Divider sx={{ mx: sidebarCollapsed ? 0.5 : 2, my: 1 }} />

      {/* Financials Section */}
      {hasFinancials && (
        <List disablePadding>
          <Tooltip title={sidebarCollapsed ? 'Financials' : ''} placement="right">
            <ListItemButton
              disabled={getMenuStatus('Financials') === 'Disabled'}
              selected={activePage === 'financials'}
              onClick={() => getMenuStatus('Financials') !== 'Disabled' && handleNavClick('financials', '/financials/all-transactions')}
              sx={{
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
              }}
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
      {(activeExportType || isReloading || isDrillingDown || isGlobalFetching || financialsLoading) && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(255, 255, 255, 0.7)', // Stronger backdrop
            zIndex: 99999, // Above everything
            cursor: 'wait',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 2
          }}
        >
          <CircularProgress size={60} thickness={4} />
          <Typography variant="h6" color="primary" sx={{ fontWeight: 600 }}>
            {isReloading ? 'Refreshing Data...' : 
            (activeExportType ? 'Preparing Report...' : 
            (isGlobalFetching ? 'Please Wait...' : 'Processing...'))}
          </Typography>
        </Box>
      )}

      <CssBaseline />
      <TopNavBar onMenuToggle={() => dispatch(toggleMobileMenu())} />

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
              borderRight: `1px solid ${theme.palette.divider}`,
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
          onClose={() => dispatch(closeMobileMenu())}
          sx={{ '& .MuiDrawer-paper': { width: DRAWER_WIDTH, backgroundColor: theme.palette.background.paper } }}
        >
          <Toolbar />
          {drawerContent}
        </Drawer>
      )}

      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', height: '100vh', minWidth: 0, overflow: 'hidden' }}>
        <Toolbar />
        <Box component="main" sx={{ flex: 1, minHeight: 0, p: { xs: 2, md: 3 }, overflow: 'auto', minWidth: 0 }}>
          {children}
        </Box>
        <Footer />
      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => dispatch(closeSnackbar())}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={() => dispatch(closeSnackbar())} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default DashboardLayout;
