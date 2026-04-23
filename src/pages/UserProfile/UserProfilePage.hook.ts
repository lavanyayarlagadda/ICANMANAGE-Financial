import { useState, useCallback, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState, useAppDispatch } from '@/store';
import { useGetMeDetailsQuery, MenuItem, useUpdateMePreferencesMutation } from '@/store/api/userApi';
import { setShowRemittanceDetail } from '@/store/slices/financialsSlice';

import { NAV_CONFIG } from '@/config/navigation';
import { useUserPermissions } from '@/hooks/useUserPermissions';

export const useUserProfilePage = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { userDetails, isLoadingDetails } = useUserPermissions();
    const authUser = useSelector((state: RootState) => state.auth.user);

    const [updatePreferences, { isLoading: isUpdatingPreferences }] = useUpdateMePreferencesMutation();

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

    const handleLandingPageChange = useCallback(async (newPage: string) => {
        setLandingPage(newPage);
        try {
            await updatePreferences({ defaultLandingPage: newPage }).unwrap();
            setSuccessMessage(`Landing page updated to ${newPage}. Redirecting...`);

            // Close any open remittance detail when changing preferences
            dispatch(setShowRemittanceDetail(false));

            const config = NAV_CONFIG[newPage];
            const targetPath = config?.path || '/financials/all-transactions';

            setTimeout(() => {
                setSuccessMessage('');
                navigate(targetPath);
            }, 1200);
        } catch (error) {
            console.error('Failed to update preferences:', error);
        }
    }, [updatePreferences, navigate, dispatch]);

    const getAccessiblePages = useCallback(() => {
        return Object.keys(NAV_CONFIG).filter(label => {
            if (label === 'Collections') return isModuleVisible('Collections');
            return isModuleVisible('Financials');
        });
    }, [isModuleVisible]);

    // Legacy support for manual save if called from UI somewhere else
    const handleSavePreferences = handleLandingPageChange;

    const handleBack = useCallback(() => navigate(-1), [navigate]);

    const landingPageChanged = useMemo(() => {
        return landingPage !== user?.defaultLandingPage;
    }, [landingPage, user?.defaultLandingPage]);

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
        handleLandingPageChange,
        getAccessiblePages,
        handleSavePreferences,
        handleBack,
        isModuleVisible,
        isModuleDisabled,
        isLoadingDetails: isLoadingDetails || isUpdatingPreferences,
        landingPageChanged,
    };
};
