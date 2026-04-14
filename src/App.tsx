import React, { Suspense, lazy } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, Box, CircularProgress } from '@mui/material';
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
import { useGetMeDetailsQuery } from '@/store/api/userApi';

const FinancialsPage = lazy(() => import('@/pages/Financials/FinancialsPage'));
const LoginPage = lazy(() => import('@/pages/Login/LoginPage'));
const UserProfilePage = lazy(() => import('@/pages/UserProfile/UserProfilePage'));
const NotFound = lazy(() => import('@/pages/NotFound/NotFound'));

const LoadingFallback = () => (
  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', width: '100vw' }}>
    <CircularProgress size={40} />
  </Box>
);

const RootRedirect = () => {
  const { data: userDetails, isLoading } = useGetMeDetailsQuery();
  const user = useAppSelector((state) => state.auth.user);
  
  if (isLoading) {
    return <LoadingFallback />;
  }

  const defaultPage = userDetails?.defaultLandingPage || user?.defaultLandingPage || 'Transactions';
  const toPath = NAV_CONFIG[defaultPage]?.path || '/financials/all-transactions';
  
  return <Navigate to={toPath} replace />;
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
