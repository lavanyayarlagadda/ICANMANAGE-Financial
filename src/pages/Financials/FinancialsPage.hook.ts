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
import { getNavigationStructure, DynamicTab, NavigationStructure } from '@/utils/navigationUtils';
import { NAV_CONFIG } from '@/config/navigation';

export const useFinancialsPage = () => {
  const dispatch = useAppDispatch();
  const uiState = useAppSelector((s) => s.ui);
  const { showRemittanceDetail } = useAppSelector((s) => s.financials);
  // const { canViewPip } = useUserPermissions();
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [isPathResolved, setIsPathResolved] = useState(false);

  const { user: userFromPermissions, userDetails, isLoadingDetails, accessibleModules } = useUserPermissions();
  const authUser = useAppSelector((s) => s.auth.user);
  const menus = useMemo(() => (userDetails?.menus || authUser?.menus || []) as MenuItem[], [userDetails, authUser]);
  const { financialsTabs }: NavigationStructure = useMemo(() => getNavigationStructure(menus, accessibleModules), [menus, accessibleModules]);

  // Build dynamic path map from financialsTabs
  const pathMap = useMemo(() => {
    const map: Record<string, { tab: number; subTab: number }> = {};
    financialsTabs.forEach(mainTab => {
      const mainPath = mainTab.path.toLowerCase().replace(/\/$/, '').split('/financials/')[1] || '';
      if (mainPath) map[mainPath] = { tab: mainTab.id, subTab: 0 };

      mainTab.subTabs?.forEach(subTab => {
        const subPath = subTab.path.toLowerCase().replace(/\/$/, '').split('/financials/')[1] || '';
        if (subPath) map[subPath] = { tab: mainTab.id, subTab: subTab.id };
      });
    });
    return map;
  }, [financialsTabs]);

  useEffect(() => {
    setIsPathResolved(false);
  }, [location.pathname]);

  useEffect(() => {
    // 1. Handle Active Page switching (instantly update layout based on URL)
    if (location.pathname.startsWith('/collections')) {
      if (uiState.activePage !== 'collections') dispatch(setActivePage('collections'));
    } else if (location.pathname.startsWith('/financials')) {
      if (uiState.activePage !== 'financials') dispatch(setActivePage('financials'));
    }

    if (isLoadingDetails || financialsTabs.length === 0) {
      if (isPathResolved) setIsPathResolved(false);
      return; 
    }

    if (location.pathname.startsWith('/financials')) {
      const currentPath = location.pathname.toLowerCase().replace(/\/$/, '');
      const pathSuffix = currentPath.split('/financials/')[1] || '';
      
      let match = pathSuffix ? pathMap[pathSuffix] : null;
      
      if (!match && pathSuffix) {
          const bestPath = Object.keys(pathMap).find(p => p && (pathSuffix.endsWith(p) || p.endsWith(pathSuffix)));
          if (bestPath) match = pathMap[bestPath];
      }

      if (match) {
        const isCurrentMatch = uiState.activeTab === match.tab && uiState.activeSubTab === match.subTab;
        
        if (isCurrentMatch) {
            if (!isPathResolved) setIsPathResolved(true);
        } else {
            if (uiState.activeTab !== match.tab) dispatch(setActiveTab(match.tab));
            if (uiState.activeSubTab !== match.subTab) dispatch(setActiveSubTab(match.subTab));
            if (isPathResolved) setIsPathResolved(false);
        }

        const activeMainTab = financialsTabs.find(t => t.id === match.tab);
        if (activeMainTab && activeMainTab.subTabs && activeMainTab.subTabs.length > 0) {
            const mainPathPart = activeMainTab.path.toLowerCase().replace(/\/$/, '').split('/financials/')[1] || '';
            if (pathSuffix === mainPathPart) {
                const firstSubTabPath = activeMainTab.subTabs[0].path;
                navigate(firstSubTabPath, { replace: true });
            }
        }
      } else if (currentPath === '/financials') {
        const firstTab = financialsTabs[0];
        if (firstTab) {
          const defaultPath = firstTab.subTabs?.[0]?.path || firstTab.path;
          navigate(defaultPath, { replace: true });
        }
      }
    }
  }, [location.pathname, dispatch, navigate, financialsTabs, isLoadingDetails, pathMap, uiState.activeTab, uiState.activeSubTab, isPathResolved]);

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
    // 1. If we have a match in the pathMap, check for 'Disabled' status
    const pathPart = location.pathname.toLowerCase().replace(/\/$/, '').split('/financials/')[1] || '';
    const match = pathMap[pathPart];

    if (match) {
        const activeMain = financialsTabs.find((t: DynamicTab) => t.id === match.tab);
        if (!activeMain) return false;
        if (activeMain.status === 'Disabled') return true;

        if (activeMain.subTabs) {
          const activeSub = activeMain.subTabs.find((st: DynamicTab) => st.id === match.subTab);
          if (activeSub && activeSub.status === 'Disabled') return true;
        }
        return false;
    }

    // 2. If no match is found but we are in the /financials/ route with a pathPart,
    // it's either an invalid route or a HIDDEN route.
    if (location.pathname.startsWith('/financials') && pathPart !== '') {
        // If it's a known configuration path in NAV_CONFIG but missing from our pathMap, it's hidden.
        // We find any config that starts with /financials/ and matches our path
        const isKnownRoute = Object.values(NAV_CONFIG).some(cfg => 
            cfg.path.toLowerCase().replace(/\/$/, '').endsWith(pathPart)
        );
        
        if (isKnownRoute) return true;
    }

    return false;
  }, [financialsTabs, location.pathname, pathMap]);

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
    isPathResolved,
    dispatch,
  };
};
