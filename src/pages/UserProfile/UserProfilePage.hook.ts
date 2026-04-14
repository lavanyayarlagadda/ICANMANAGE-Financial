import { useState, useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '@/store';
import { MenuAccess } from '@/store/slices/authSlice';
import { useGetMeDetailsQuery, MenuItem } from '@/store/api/userApi';

export const useUserProfilePage = () => {
    const navigate = useNavigate();
    const { data: userDetails, isLoading: isLoadingDetails } = useGetMeDetailsQuery();
    const authUser = useSelector((state: RootState) => state.auth.user);
    
    // Fallback to authUser if userDetails is not yet loaded
    const user = userDetails || authUser;
    const menus = (user?.menus || []) as MenuItem[];
    
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

    // Sync state with userDetails when it loads
    useEffect(() => {
        if (userDetails) {
            if (userDetails.username) setUsername(userDetails.username);
            if (userDetails.defaultLandingPage) setLandingPage(userDetails.defaultLandingPage);
        }
    }, [userDetails]);

    const getMenuStatus = useCallback((label: string) => {
        const findStatus = (menusArray: MenuItem[]): string | null => {
            for (const m of menusArray) {
                if (m.menuName === label) return m.status;
                if (m.modules) {
                    for (const mod of m.modules) {
                        if (mod.menuName === label) return mod.status;
                        if (mod.subModules) {
                            for (const sub of mod.subModules) {
                                if (sub.menuName === label) return sub.status;
                            }
                        }
                    }
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
        // For other modules, check if parent Financials is visible
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
        isLoadingDetails,
    };
};
