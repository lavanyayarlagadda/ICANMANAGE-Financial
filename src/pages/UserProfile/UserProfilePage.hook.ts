import { useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '@/store';

export const useUserProfilePage = () => {
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);
  const menus = user?.menus || [];
  const [tabIndex, setTabIndex] = useState(0);

  // Profile fields
  const [username, setUsername] = useState(user?.username || '');

  // Password fields
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Preference fields
  const [landingPage, setLandingPage] = useState(user?.defaultLandingPage || 'Financials');

  // UI state
  const [successMessage, setSuccessMessage] = useState('');

  const getMenuStatus = useCallback((label: string) => {
    const findStatus = (menusArray: any[]): string | null => {
      for (const m of menusArray) {
        if (m.menuName === label) return m.status;
        if (m.subModules) {
          const sub = findStatus(m.subModules);
          if (sub) return sub;
        }
      }
      return null;
    };
    return findStatus(menus) || 'Hidden';
  }, [menus]);

  const isModuleVisible = useCallback((label: string) => {
    if (label === 'Financials' || label === 'Collections') {
      return getMenuStatus(label) !== 'Hidden';
    }
    if (getMenuStatus('Financials') === 'Hidden') return false;
    return getMenuStatus(label) !== 'Hidden';
  }, [getMenuStatus]);

  const isModuleDisabled = useCallback((label: string) => {
    if (label === 'Financials' || label === 'Collections') {
      return getMenuStatus(label) === 'Disabled';
    }
    if (getMenuStatus('Financials') === 'Disabled') return true;
    return getMenuStatus(label) === 'Disabled';
  }, [getMenuStatus]);

  const handleTabChange = useCallback((_event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
    setSuccessMessage('');
  }, []);

  const handleUpdateUsername = useCallback(() => {
    setSuccessMessage('Username updated successfully.');
    setTimeout(() => setSuccessMessage(''), 3000);
  }, []);

  const handleChangePassword = useCallback(() => {
    setSuccessMessage('Password changed successfully.');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setSuccessMessage(''), 3000);
  }, []);

  const handleSavePreferences = useCallback(() => {
    setSuccessMessage('Preferences saved successfully.');
    setTimeout(() => setSuccessMessage(''), 3000);
  }, []);

  const handleBack = useCallback(() => navigate(-1), [navigate]);

  return {
    user,
    tabIndex,
    username,
    setUsername,
    currentPassword,
    setCurrentPassword,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    landingPage,
    setLandingPage,
    successMessage,
    handleTabChange,
    handleUpdateUsername,
    handleChangePassword,
    handleSavePreferences,
    handleBack,
    isModuleVisible,
    isModuleDisabled,
  };
};
