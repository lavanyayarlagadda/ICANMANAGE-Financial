import { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setCredentials } from '@/store/slices/authSlice';
import { useLoginMutation } from '@/store/api/authApi';

export const useLoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('ajohnson');
  const [password, setPassword] = useState('password123');
  const [errorMsg, setErrorMsg] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [login, { isLoading }] = useLoginMutation();

  const togglePasswordVisibility = useCallback(() => setShowPassword((show) => !show), []);
  const handleMouseDownPassword = useCallback((event: React.MouseEvent<HTMLButtonElement>) => event.preventDefault(), []);

  const handleLogin = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    
    if (!username || !password) {
        setErrorMsg('Please enter both username and password');
        return;
    }

    try {
        const result = await login({ username, password }).unwrap();
        dispatch(setCredentials({
            user: result.user,
            accessToken: result.accessToken,
            refreshToken: result.refreshToken,
        }));

        const landingPageRoute = result.user.role === 'Admin' ? '/financials/all-transactions' : '/collections';
        navigate(landingPageRoute, { replace: true });
    } catch (err: any) {
      setErrorMsg(err.data?.message || 'Invalid username or password');
    }
  }, [username, password, login, dispatch, navigate]);

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
