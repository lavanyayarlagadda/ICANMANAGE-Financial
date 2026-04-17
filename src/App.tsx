import React, { Suspense, lazy } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, Box, CircularProgress, Typography } from '@mui/material';
import { Provider } from 'react-redux';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { muiTheme } from '@/theme';
import { store } from '@/store';
import ProtectedRoute from '@/components/ProtectedRoute';
import { GlobalHooksWrapper } from '@/components/GlobalHooksWrapper';

import { NAV_CONFIG } from '@/config/navigation';
import { useAppSelector } from '@/store';
import { useUserPermissions } from '@/hooks/useUserPermissions';
import { GlobalOverlay } from './components/templates/DashboardLayout/DashboardLayout.styles';

const FinancialsPage = lazy(() => import('@/pages/Financials/FinancialsPage'));
const LoginPage = lazy(() => import('@/pages/Login/LoginPage'));
const UserProfilePage = lazy(() => import('@/pages/UserProfile/UserProfilePage'));
const NotFound = lazy(() => import('@/pages/NotFound/NotFound'));

const LoadingFallback = () => (
  <GlobalOverlay>
    <CircularProgress size={60} thickness={4} />
    <Typography variant="body2" color="text.secondary" sx={{ opacity: 0.8 }}>
      Loading your data...
    </Typography>
  </GlobalOverlay>
);

const RootRedirect = () => {
  const { user: userDetails, isCognitiveUser, isLoadingDetails } = useUserPermissions();
  // If user is cognitive, we need both selectedTenantId AND meDetails
  // useUserPermissions handles the skip logic.
  const { selectedTenantId, isLoading: isTenantsLoading } = useAppSelector((s) => s.tenant);

  const isLoading = isTenantsLoading || (isCognitiveUser && !userDetails) || isLoadingDetails;
  const user = useAppSelector((state) => state.auth.user);

  if (isLoading) {
    return <LoadingFallback />;
  }
  const defaultPageLabel = userDetails?.defaultLandingPage || user?.defaultLandingPage;

  if (defaultPageLabel) {
    const configKey = Object.keys(NAV_CONFIG).find(
      key => key.toLowerCase() === defaultPageLabel.toLowerCase()
    );

    if (configKey) {
      return <Navigate to={NAV_CONFIG[configKey].path} replace />;
    }
  }

  // Fallback to /financials which auto-selects the first available tab
  return <Navigate to="/financials" replace />;
};

const App = () => (
  <Provider store={store}>
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <ThemeProvider theme={muiTheme}>
        <CssBaseline />
        <BrowserRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true
          }}
        >
          <GlobalHooksWrapper>
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<LoginPage />} />

                {/* Protected Routes */}
                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <RootRedirect />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/financials/*"
                  element={
                    <ProtectedRoute>
                      <FinancialsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/collections"
                  element={
                    <ProtectedRoute>
                      <FinancialsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <UserProfilePage />
                    </ProtectedRoute>
                  }
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </GlobalHooksWrapper>
        </BrowserRouter>
      </ThemeProvider>
    </LocalizationProvider>
  </Provider>
);

export default App;
