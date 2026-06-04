import { useState, useCallback, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState, useAppDispatch } from '@/store';
import { MenuItem, useUpdateMePreferencesMutation } from '@/store/api/userApi';
import { setShowRemittanceDetail } from '@/store/slices/financialsSlice';

import { NAV_CONFIG } from '@/config/navigation';
import { useUserPermissions } from '@/hooks/useUserPermissions';

import { skipToken } from '@reduxjs/toolkit/query/react';
import { useGetMappedHeadersDataQuery } from '@/store/api/reconciliationApi';
import { useDepositReconColumnsForPreferences } from './hooks/useDepositReconColumnsForPreferences';

export interface GridConfig {
  name: string;
  isDynamic?: boolean;
  staticColumns?: string[];
}

export interface PageGridConfig {
  hasGrids: boolean;
  grids: GridConfig[];
}

export const PAGE_GRIDS_CONFIG: Record<string, PageGridConfig> = {
  'Executive Summary': { hasGrids: false, grids: [] },
  'Trends & Forecast': { hasGrids: false, grids: [] },
  'Forecast Trends': { hasGrids: false, grids: [] },
  'Payer Performance': { hasGrids: false, grids: [] },
  'All Transactions': { hasGrids: true, grids: [{ name: 'All Transactions', staticColumns: ['Transaction No', 'Effective Date', 'Category', 'Type', 'Description', 'Source Provider', 'Amount', 'Open Balance', 'Status'] }] },
  'Payments': { hasGrids: true, grids: [{ name: 'Payments', staticColumns: ['Payment Date', 'Type', 'Transaction No', 'Payer', 'Description', 'Amount', 'Open Balance', 'Status'] }] },
  'PIP': { hasGrids: true, grids: [{ name: 'PIP', staticColumns: ['Payment Date', 'Check/EFT Number', 'Payment Amount', 'Suspense Balance', 'Status'] }] },
  'Forward Balances': { hasGrids: true, grids: [{ name: 'Forward Balances', staticColumns: ['Notification Date', 'Provider Name', 'NPI', 'Description', 'Original Amount', 'Remaining Balance', 'Status'] }] },
  'Recoupments': { hasGrids: true, grids: [{ name: 'Recoupments', staticColumns: ['Recoupment Date', 'Payer', 'Patient Name', 'Claim ID', 'Original Payment', 'Recoupment Amount', 'Reason', 'Status'] }] },
  'Other Adjustments': { hasGrids: true, grids: [{ name: 'Other Adjustments', staticColumns: ['Effective Date', 'Type', 'Description', 'Source Provider', 'Amount', 'Reference ID', 'Status'] }] },
  'Collections': { hasGrids: true, grids: [{ name: 'Collections', staticColumns: ['Account Number', 'Patient Name', 'Payer', 'Total Due', 'Amount Collected', 'Balance', 'Status', 'Aging', 'Priority'] }] },
  'Deposit Reconciliation': { hasGrids: false, grids: [] },
  'Variance Analysis': { hasGrids: true, grids: [
    { name: 'Fee Schedule Variance', staticColumns: ['Transaction No', 'Payment Date', 'Patient Name', 'Payer Name', 'Expected Allowed', 'Actual Allowed', 'Variance', 'Adjustment Code 1', 'Adjustment Code 2'] },
    { name: 'Payment Variance', staticColumns: ['Transaction No', 'Payment Date', 'Patient Name', 'Payer Name', 'Expected Allowed', 'Actual Allowed', 'Variance', 'Adjustment Code 1', 'Adjustment Code 2'] }
  ]},
  'Fee Schedule Variance': { hasGrids: true, grids: [{ name: 'Fee Schedule Variance', staticColumns: ['Transaction No', 'Payment Date', 'Patient Name', 'Payer Name', 'Expected Allowed', 'Actual Allowed', 'Variance', 'Adjustment Code 1', 'Adjustment Code 2'] }] },
  'Payment Variance': { hasGrids: true, grids: [{ name: 'Payment Variance', staticColumns: ['Transaction No', 'Payment Date', 'Patient Name', 'Payer Name', 'Expected Allowed', 'Actual Allowed', 'Variance', 'Adjustment Code 1', 'Adjustment Code 2'] }] },
  'FB & Recoup': { hasGrids: true, grids: [
    { name: 'Forward Balances', staticColumns: ['Notification Date', 'Provider Name', 'NPI', 'Description', 'Original Amount', 'Remaining Balance', 'Status'] },
    { name: 'Recoupments', staticColumns: ['Recoupment Date', 'Payer', 'Patient Name', 'Claim ID', 'Original Payment', 'Recoupment Amount', 'Reason', 'Status'] }
  ]},
  'Forward Balances & Recoupments': { hasGrids: true, grids: [
    { name: 'Forward Balances', staticColumns: ['Notification Date', 'Provider Name', 'NPI', 'Description', 'Original Amount', 'Remaining Balance', 'Status'] },
    { name: 'Recoupments', staticColumns: ['Recoupment Date', 'Payer', 'Patient Name', 'Claim ID', 'Original Payment', 'Recoupment Amount', 'Reason', 'Status'] }
  ]},
  'Bank Deposits': { hasGrids: true, grids: [{ name: 'Bank Deposits', isDynamic: true }] },
};

export const useUserProfilePage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { userDetails, isLoadingDetails } = useUserPermissions();
  const authUser = useSelector((state: RootState) => state.auth.user);

  const [updatePreferences, { isLoading: isUpdatingPreferences }] =
    useUpdateMePreferencesMutation();

  // Fallback to authUser if userDetails is not yet loaded
  const user = userDetails || authUser;
  const menus = useMemo(() => (user?.menus || []) as MenuItem[], [user?.menus]);

  const [tabIndex, setTabIndex] = useState(0);

  // Profile fields
  const [username, setUsername] = useState(user?.username || '');
  const [firstName, setFirstName] = useState(authUser?.firstName || '');
  const [lastName, setLastName] = useState(authUser?.lastName || '');

  // Password fields
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Preference fields
  const [landingPage, setLandingPage] = useState(user?.defaultLandingPage || 'Financials');
  const [selectedColumns, setSelectedColumns] = useState<Record<string, string[]>>(
    user?.defaultColumns || {}
  );

  // UI state
  const [successMessage, setSuccessMessage] = useState('');

  const currentPageConfig = PAGE_GRIDS_CONFIG[landingPage] || { hasGrids: true, grids: [{ name: landingPage, staticColumns: [] }] };
  const isDynamic = currentPageConfig.grids.some(g => g.isDynamic);

  const { data: dynamicHeadersResponse, isFetching: isFetchingHeaders } = useGetMappedHeadersDataQuery(
    isDynamic ? { hospitalId: 0, pageName: landingPage } : skipToken
  );

  const dynamicColumns = useMemo(() => {
    return dynamicHeadersResponse?.data?.map(c => c.displayName) || [];
  }, [dynamicHeadersResponse]);

  const depositReconDynamicColumns = useDepositReconColumnsForPreferences(landingPage !== 'Deposit Reconciliation');

  const getColumnsForGrid = useCallback((grid: GridConfig) => {
    if (landingPage === 'Deposit Reconciliation') {
      const cols = depositReconDynamicColumns[grid.name as keyof typeof depositReconDynamicColumns];
      return cols || [];
    }

    const staticCols = grid.staticColumns || [];
    if (grid.isDynamic) {
      // Create a unique array combining static columns and dynamically fetched columns
      return Array.from(new Set([...staticCols, ...dynamicColumns]));
    }
    return staticCols;
  }, [dynamicColumns, landingPage, depositReconDynamicColumns]);

  // Sync state with userDetails when it loads
  useEffect(() => {
    if (userDetails) {
      if (userDetails.username) setUsername(userDetails.username);
      if (userDetails.defaultLandingPage) setLandingPage(userDetails.defaultLandingPage);
    }
  }, [userDetails]);

  const getMenuStatus = useCallback(
    (label: string) => {
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
    },
    [menus],
  );

  const isModuleVisible = useCallback(
    (label: string) => {
      if (label === 'Financials' || label === 'Collections') {
        return getMenuStatus(label) !== 'Hidden';
      }
      // For other modules, check if parent Financials is visible
      if (getMenuStatus('Financials') === 'Hidden') return false;
      return getMenuStatus(label) !== 'Hidden';
    },
    [getMenuStatus],
  );

  const isModuleDisabled = useCallback(
    (label: string) => {
      if (label === 'Financials' || label === 'Collections') {
        return getMenuStatus(label) === 'Disabled';
      }
      if (getMenuStatus('Financials') === 'Disabled') return true;
      return getMenuStatus(label) === 'Disabled';
    },
    [getMenuStatus],
  );

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

  const handleLandingPageChange = useCallback(
    (newPage: string) => {
      setLandingPage(newPage);
      setSelectedColumns({});
    },
    []
  );

  const getAccessiblePages = useCallback(() => {
    return Object.keys(NAV_CONFIG).filter((label) => {
      const config = NAV_CONFIG[label];
      // Only suggest pages that have a component and are visible to the user
      return config.component && isModuleVisible(label);
    });
  }, [isModuleVisible]);

  const handleSavePreferences = useCallback(
    async () => {
      try {
        await updatePreferences({ 
          defaultLandingPage: landingPage,
          defaultColumns: selectedColumns 
        }).unwrap();
        setSuccessMessage(`Preferences updated to ${landingPage}. Redirecting...`);

        // Close any open remittance detail when changing preferences
        dispatch(setShowRemittanceDetail(false));

        const config = NAV_CONFIG[landingPage];
        const targetPath = config?.path || '/financials/all-transactions';

        setTimeout(() => {
          setSuccessMessage('');
          navigate(targetPath);
        }, 1200);
      } catch (error) {
        console.error('Failed to update preferences:', error);
      }
    },
    [landingPage, selectedColumns, updatePreferences, navigate, dispatch],
  );

  const handleBack = useCallback(() => navigate(-1), [navigate]);

  const landingPageChanged = useMemo(() => {
    return landingPage !== user?.defaultLandingPage;
  }, [landingPage, user?.defaultLandingPage]);

  return {
    user,
    tabIndex,
    username,
    setUsername,
    firstName,
    setFirstName,
    lastName,
    setLastName,
    currentPassword,
    setCurrentPassword,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    landingPage,
    setLandingPage,
    selectedColumns,
    setSelectedColumns,
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
    isLoadingDetails: isLoadingDetails || isUpdatingPreferences || isFetchingHeaders,
    landingPageChanged,
    currentPageConfig,
    getColumnsForGrid,
  };
};
