import { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setCredentials } from '@/store/slices/authSlice';
import { STATIC_AUTH_TOKEN, STATIC_REFRESH_TOKEN, DUMMY_USER } from '@/constants/auth';

export const useLoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('ajohnson');
  const [password, setPassword] = useState('password123');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const togglePasswordVisibility = useCallback(() => setShowPassword((show) => !show), []);
  const handleMouseDownPassword = useCallback((event: React.MouseEvent<HTMLButtonElement>) => event.preventDefault(), []);

  const handleLogin = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    if (!username || !password) {
      setErrorMsg('Please enter both username and password');
      setIsLoading(false);
      return;
    }

    try {
      // Mocking API delay
      await new Promise(resolve => setTimeout(resolve, 800));

      // Use static login bypass with DUMMY_USER for development
      dispatch(setCredentials({
        user: DUMMY_USER,
        accessToken: STATIC_AUTH_TOKEN,
        refreshToken: STATIC_REFRESH_TOKEN,
      }));

      const landingPageRoute = DUMMY_USER.role === 'Admin' ? '/financials/all-transactions' : '/collections';
      navigate(landingPageRoute, { replace: true });
    } catch (err: any) {
      setErrorMsg('Login failed');
    } finally {
      setIsLoading(false);
    }
  }, [username, password, dispatch, navigate]);

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
