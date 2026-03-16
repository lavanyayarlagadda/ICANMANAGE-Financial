import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { Provider } from 'react-redux';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { muiTheme } from '@/theme';
import { store } from '@/store';
import FinancialsPage from '@/pages/FinancialsPage';
import LoginPage from '@/pages/LoginPage';
import UserProfilePage from '@/pages/UserProfilePage';
import NotFound from '@/pages/NotFound';
import PocScreen from '@/pages/PocScreen';
import ProtectedRoute from '@/components/ProtectedRoute';
import { GlobalHooksWrapper } from '@/components/GlobalHooksWrapper';

const App = () => (
  <Provider store={store}>
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <ThemeProvider theme={muiTheme}>
        <CssBaseline />
        <BrowserRouter>
          <GlobalHooksWrapper>
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
              <Route
                path="/poc"
                element={
                  <ProtectedRoute>
                    <PocScreen />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </GlobalHooksWrapper>
        </BrowserRouter>
      </ThemeProvider>
    </LocalizationProvider>
  </Provider>
);

export default App;
