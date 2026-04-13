import { useEffect, useMemo, useCallback, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '@/store';
import {
  closeViewDialog,
  closeEditDialog,
  closeConfirmDelete,
  showSnackbar,
  setActivePage,
  setActiveTab,
  setActiveSubTab,
  triggerExport,
  triggerPrint,
  triggerReload,
} from '@/store/slices/uiSlice';
import {
  setShowRemittanceDetail,
  deletePayment,
  deleteRecoupment,
  deleteAdjustment,
  deleteAllTransaction,
  deleteCollection,
} from '@/store/slices/financialsSlice';
import { useUserPermissions } from '@/hooks/useUserPermissions';
import { useGetMeDetailsQuery, MenuItem } from '@/store/api/userApi';
import { getNavigationStructure, DynamicTab } from '@/utils/navigationUtils';

export const useFinancialsPage = () => {
  const dispatch = useAppDispatch();
  const uiState = useAppSelector((s) => s.ui);
  const { showRemittanceDetail } = useAppSelector((s) => s.financials);
  const { canViewPip } = useUserPermissions();
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const { data: userDetails, isLoading: isLoadingDetails } = useGetMeDetailsQuery();
  const authUser = useAppSelector((s) => s.auth.user);
  const menus = useMemo(() => (userDetails?.menus || authUser?.menus || []) as MenuItem[], [userDetails, authUser]);
  const { financialsTabs } = useMemo(() => getNavigationStructure(menus), [menus]);

  useEffect(() => {
    if (location.pathname.startsWith('/collections')) {
      dispatch(setActivePage('collections'));
    } else if (location.pathname.startsWith('/financials')) {
      dispatch(setActivePage('financials'));
      
      const pathPart = location.pathname.split('/financials/')[1] || '';
      
      // Build dynamic path map from financialsTabs
      const pathMap: Record<string, { tab: number; subTab: number }> = {};
      financialsTabs.forEach(mainTab => {
        // Main tabs can have components too (no sub-tabs case)
        const mainPath = mainTab.path.split('/financials/')[1] || '';
        if (mainPath) pathMap[mainPath] = { tab: mainTab.id, subTab: 0 };

        mainTab.subTabs?.forEach(subTab => {
          const subPath = subTab.path.split('/financials/')[1] || '';
          if (subPath) pathMap[subPath] = { tab: mainTab.id, subTab: subTab.id };
        });
      });

      const match = pathMap[pathPart];

      if (match) {
        if (uiState.activeTab !== match.tab) dispatch(setActiveTab(match.tab));
        if (uiState.activeSubTab !== match.subTab) dispatch(setActiveSubTab(match.subTab));
      } else {
        // Current path is invalid or hidden, redirect to first available tab
        const firstTab = financialsTabs[0];
        if (firstTab) {
            const defaultPath = firstTab.subTabs?.[0]?.path || firstTab.path;
            if (location.pathname !== defaultPath) {
                navigate(defaultPath, { replace: true });
            }
        }
      }
    }
  }, [location.pathname, dispatch, navigate, uiState.activeTab, uiState.activeSubTab, financialsTabs]);

  const handleDelete = useCallback(() => {
    if (!uiState.confirmDeleteId) return;
    const { confirmDeleteId, confirmDeleteType } = uiState;
    const deleteMap: Record<string, () => void> = {
      payment: () => dispatch(deletePayment(confirmDeleteId)),
      recoupment: () => dispatch(deleteRecoupment(confirmDeleteId)),
      adjustment: () => dispatch(deleteAdjustment(confirmDeleteId)),
      transaction: () => dispatch(deleteAllTransaction(confirmDeleteId)),
      collection: () => dispatch(deleteCollection(confirmDeleteId)),
    };
    deleteMap[confirmDeleteType]?.();
    dispatch(closeConfirmDelete());
    dispatch(showSnackbar({ message: `${confirmDeleteType} deleted successfully.`, severity: 'success' }));
  }, [uiState, dispatch]);

  const handleEditSave = useCallback(() => {
    dispatch(closeEditDialog());
    dispatch(showSnackbar({ message: 'Record updated successfully.', severity: 'success' }));
  }, [dispatch]);

  const handleBackToPayments = useCallback(() => {
    dispatch(setShowRemittanceDetail(false));
  }, [dispatch]);

  const handlePrint = useCallback(() => dispatch(triggerPrint()), [dispatch]);
  const handleReload = useCallback(() => dispatch(triggerReload()), [dispatch]);
  const handleExport = useCallback(() => dispatch(triggerExport()), [dispatch]);

  const isRestricted = useMemo(() => {
    const activeMain = financialsTabs.find((t: DynamicTab) => t.id === uiState.activeTab);
    if (!activeMain) return false;
    if (activeMain.status === 'Disabled') return true;
    
    if (activeMain.subTabs) {
      const activeSub = activeMain.subTabs.find((st: DynamicTab) => st.id === uiState.activeSubTab);
      if (activeSub && activeSub.status === 'Disabled') return true;
    }
    
    return false;
  }, [financialsTabs, uiState.activeTab, uiState.activeSubTab]);

  return {
    ...uiState,
    financialsTabs,
    showRemittanceDetail,
    addDialogOpen,
    isRestricted,
    isLoadingUserDetails: isLoadingDetails,
    setAddDialogOpen,
    handleDelete,
    handleEditSave,
    handleBackToPayments,
    handlePrint,
    handleReload,
    handleExport,
    dispatch,
  };
};
