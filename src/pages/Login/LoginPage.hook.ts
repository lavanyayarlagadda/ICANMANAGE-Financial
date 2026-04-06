import { useState, useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '@/store';
import { setCredentials } from '@/store/slices/authSlice';
import { STATIC_AUTH_TOKEN, STATIC_REFRESH_TOKEN, DUMMY_USER } from '@/constants/auth';
import { useLoginMutation } from '@/store/api/authApi';

export const useLoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('ajohnson');
  const [password, setPassword] = useState('password123');
  const [errorMsg, setErrorMsg] = useState('');
  const [login, { isLoading }] = useLoginMutation();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  const from = location.state?.from?.pathname || '/financials/payments';

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

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

      // Success! Store credentials and navigate
      dispatch(setCredentials({
        user: result.user,
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
      }));

      // Always land on the default landing page regardless of where we came from
      // const landingPageRoute = result.user.role === 'Admin' ? '/financials/all-transactions' : '/collections';
      const landingPageRoute = '/financials/payments';
      const redirectTo = landingPageRoute;

      navigate(redirectTo, { replace: true });
    } catch (err: any) {
      console.error('Login failed:', err);
      setErrorMsg(err.data?.message || 'Invalid username or password');
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