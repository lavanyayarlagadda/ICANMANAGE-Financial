import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { Provider } from 'react-redux';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { muiTheme } from '@/theme';
import { store } from '@/store';
import React, { lazy, Suspense } from 'react';
import { CircularProgress, Box } from '@mui/material';

import ProtectedRoute from '@/components/ProtectedRoute';
import { GlobalHooksWrapper } from '@/components/GlobalHooksWrapper';

const LoginPage = lazy(() => import('@/pages/LoginPage'));
const FinancialsPage = lazy(() => import('@/pages/FinancialsPage'));
const UserProfilePage = lazy(() => import('@/pages/UserProfilePage'));
const NotFound = lazy(() => import('@/pages/NotFound'));

const PageLoader = () => (
  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f5f7fa' }}>
    <CircularProgress thickness={4} size={40} sx={{ color: '#6B99C4' }} />
  </Box>
);

const App = () => (
  <Provider store={store}>
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <ThemeProvider theme={muiTheme}>
        <CssBaseline />
        <BrowserRouter>
          <GlobalHooksWrapper>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<LoginPage />} />

                {/* Protected Routes */}
                <Route path="/" element={<LoginPage />} />
                
                <Route
                  path="/financials/*"
                  element={
                    <ProtectedRoute>
                      <FinancialsPage />
                    </ProtectedRoute>
                  }
                />
                
                <Route
                  path="/collections/*"
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
