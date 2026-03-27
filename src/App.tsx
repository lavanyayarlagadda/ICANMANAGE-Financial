import React, { Suspense, lazy } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, Box, CircularProgress } from '@mui/material';
import { Provider } from 'react-redux';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { muiTheme } from '@/theme';
import { store } from '@/store';
import ProtectedRoute from '@/components/ProtectedRoute';
import { GlobalHooksWrapper } from '@/components/GlobalHooksWrapper';

const FinancialsPage = lazy(() => import('@/pages/FinancialsPage'));
const LoginPage = lazy(() => import('@/pages/LoginPage'));
const UserProfilePage = lazy(() => import('@/pages/UserProfilePage'));
const NotFound = lazy(() => import('@/pages/NotFound'));

const LoadingFallback = () => (
  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', width: '100vw' }}>
    <CircularProgress size={40} />
  </Box>
);

const App = () => (
  <Provider store={store}>
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <ThemeProvider theme={muiTheme}>
        <CssBaseline />
        <BrowserRouter>
          <GlobalHooksWrapper>
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<LoginPage />} />

                {/* Protected Routes */}
                <Route
                  path="/"
                  element={
                    <LoginPage />
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
