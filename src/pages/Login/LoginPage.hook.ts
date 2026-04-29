import { useState, useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '@/store';
import { setCredentials } from '@/store/slices/authSlice';
import { resetUiState } from '@/store/slices/uiSlice';
import { useLoginMutation } from '@/store/api/authApi';
import { baseApi } from '@/store/api/baseApi';
import { resetRemittanceViewState } from '@/store/slices/financialsSlice';

export const useLoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [login, { isLoading }] = useLoginMutation();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const togglePasswordVisibility = useCallback(() => setShowPassword((show) => !show), []);
  const handleMouseDownPassword = useCallback((event: React.MouseEvent<HTMLButtonElement>) => event.preventDefault(), []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!username || !password) {
      setErrorMsg('Please enter both username and password');
      return;
    }

    try {
      const result = await login({ username, password }).unwrap();

      // Reset UI state (tabs, etc) before setting new user
      dispatch(resetUiState());
      dispatch(resetRemittanceViewState());

      // Wipe prior cached user queries (like /me/details) and tenants
      dispatch(baseApi.util.resetApiState());
      localStorage.removeItem('ican_selected_tenant');

      // Success! Store credentials and navigate to root resolver
      dispatch(setCredentials({
        user: result.user,
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
      }));

      // Navigate to / which delegates to RootRedirect for fetching the live defaultLandingPage
      navigate('/', { replace: true });
    } catch (err) {
      console.error('Login failed:', err);
      const error = err as { data?: { message?: string } };
      setErrorMsg(error.data?.message || 'Invalid username or password');
    }
  };


  return {
    username,
    setUsername,
    password,
    setPassword,
    showPassword,
    errorMsg,
    isLoading,
    togglePasswordVisibility,
    handleMouseDownPassword,
    handleLogin,
  };
};