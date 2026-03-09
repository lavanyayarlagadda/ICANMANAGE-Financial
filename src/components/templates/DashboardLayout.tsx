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
  IconButton,
  Tooltip,
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
  setActivePage,
  setActiveTab,
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
  const { mobileMenuOpen, activePage, activeTab, sidebarCollapsed, snackbarOpen, snackbarMessage, snackbarSeverity } = useAppSelector((s) => s.ui);

  const drawerWidth = sidebarCollapsed ? DRAWER_COLLAPSED_WIDTH : DRAWER_WIDTH;

  const handleNavClick = (page: 'financials' | 'collections', tab?: number) => {
    dispatch(setActivePage(page));
    if (tab !== undefined) dispatch(setActiveTab(tab));
    dispatch(closeMobileMenu());
  };

  const financialsSubItems = [
    { label: 'All Transactions', tab: 0, icon: <DashboardIcon fontSize="small" /> },
    { label: 'Payments', tab: 1, icon: <PaymentIcon fontSize="small" /> },
    { label: 'PIP', tab: 2, icon: <AccountBalanceIcon fontSize="small" /> },
    { label: 'Forward Balances', tab: 3, icon: <CompareArrowsIcon fontSize="small" /> },
    { label: 'Recoupments', tab: 4, icon: <ReceiptLongIcon fontSize="small" /> },
    { label: 'Variance Analysis', tab: 6, icon: <CompareArrowsIcon fontSize="small" /> },
    { label: 'Trends & Forecast', tab: 7, icon: <TrendingUpIcon fontSize="small" /> },
  ];

  const drawerContent = (
    <Box sx={{ pt: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Collapse toggle - desktop only */}
      {!isMobile && (
        <Box sx={{ display: 'flex', justifyContent: sidebarCollapsed ? 'center' : 'flex-end', px: 1, mb: 0.5 }}>
          <IconButton size="small" onClick={() => dispatch(toggleSidebarCollapse())} sx={{ border: `1px solid ${theme.palette.divider}` }}>
            {sidebarCollapsed ? <ChevronRightIcon fontSize="small" /> : <ChevronLeftIcon fontSize="small" />}
          </IconButton>
        </Box>
      )}

      {/* Collections Section */}
      <List disablePadding>
        <Tooltip title={sidebarCollapsed ? 'Collections' : ''} placement="right">
          <ListItemButton
            selected={activePage === 'collections'}
            onClick={() => handleNavClick('collections')}
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

      <Divider sx={{ mx: sidebarCollapsed ? 0.5 : 2, my: 1 }} />

      {/* Financials Section */}
      {!sidebarCollapsed && (
        <Box sx={{ px: 2, py: 0.5 }}>
          <Typography variant="caption" sx={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: theme.palette.text.disabled, fontSize: '0.65rem' }}>
            Financials
          </Typography>
        </Box>
      )}
      <List disablePadding>
        {financialsSubItems.map((item) => (
          <Tooltip key={item.label} title={sidebarCollapsed ? item.label : ''} placement="right">
            <ListItemButton
              selected={activePage === 'financials' && activeTab === item.tab}
              onClick={() => handleNavClick('financials', item.tab)}
              sx={{
                mx: sidebarCollapsed ? 0.5 : 1,
                borderRadius: 1,
                mb: 0.25,
                py: 0.75,
                justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                px: sidebarCollapsed ? 1 : 2,
                '&.Mui-selected': {
                  backgroundColor: `${theme.palette.primary.main}12`,
                  color: theme.palette.primary.main,
                  '& .MuiListItemIcon-root': { color: theme.palette.primary.main },
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: sidebarCollapsed ? 0 : 32, justifyContent: 'center' }}>{item.icon}</ListItemIcon>
              {!sidebarCollapsed && <ListItemText primary={item.label} primaryTypographyProps={{ variant: 'body2', fontWeight: 500, fontSize: '0.8rem' }} />}
            </ListItemButton>
          </Tooltip>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden', backgroundColor: theme.palette.background.default }}>
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
