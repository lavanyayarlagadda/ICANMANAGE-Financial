import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { Provider } from 'react-redux';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { muiTheme } from '@/theme';
import { store } from '@/store';
import FinancialsPage from '@/pages/FinancialsPage';
import NotFound from '@/pages/NotFound';

const App = () => (
  <Provider store={store}>
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<FinancialsPage />} />
          <Route path="/financials" element={<FinancialsPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  </Provider>
);

export default App;
