import { useEffect, useCallback, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store';
import { setActiveTab, setActiveSubTab } from '@/store/slices/uiSlice';
import { useGetMeDetailsQuery } from '@/store/api/userApi';
import { getNavigationStructure, DynamicTab } from '@/utils/navigationUtils';
import { MenuItem } from '@/store/api/userApi';

interface UseFinancialsTabsProps {
  showPrint?: boolean;
  showReload?: boolean;
  showExportWizard?: boolean;
}

export const useFinancialsTabs = ({
  showPrint,
  showReload,
  showExportWizard,
}: UseFinancialsTabsProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { activeTab, activeSubTab, isReloading } = useAppSelector((s) => s.ui);
  const { data: userDetails } = useGetMeDetailsQuery();
  const authUser = useAppSelector((s) => s.auth.user);
  const { selectedTenantId } = useAppSelector((s) => s.tenant);

  const menus = useMemo(() => (userDetails?.menus || authUser?.menus || []) as MenuItem[], [userDetails, authUser]);

  const { financialsTabs } = useMemo(() => getNavigationStructure(menus), [menus]);

  const isMindPath = useMemo(
    () =>
      authUser?.company?.toLowerCase() === 'mindpath' ||
      selectedTenantId?.toLowerCase() === 'mindpath',
    [authUser, selectedTenantId]
  );

  const handleMainTabChange = useCallback((index: number, path: string) => {
    if (activeTab !== index) dispatch(setActiveTab(index));
    navigate(path);
  }, [dispatch, navigate, activeTab]);

  const handleSubTabChange = useCallback((index: number, path: string) => {
    if (activeSubTab !== index) dispatch(setActiveSubTab(index));
    navigate(path);
  }, [dispatch, navigate, activeSubTab]);

  const currentMainTab = financialsTabs.find(t => t.id === activeTab);
  const currentSubTabs = currentMainTab?.subTabs || [];

  const isExecutiveSummary = currentMainTab?.label === 'Trends & Forecast' && activeSubTab === 1;
  const canShowActions = financialsTabs.length > 0;
  const shouldShowPrint = showPrint ?? (canShowActions && !isExecutiveSummary);
  const shouldShowReload = showReload ?? canShowActions;
  const shouldShowExport = showExportWizard ?? (canShowActions && !isExecutiveSummary);

  const hasSubTabs = currentSubTabs.length > 0;
  const hasActions = shouldShowPrint || shouldShowReload || shouldShowExport;
  const showSubTabsRow = (hasSubTabs || hasActions) && activeTab !== -1;

  return {
    activeTab,
    activeSubTab,
    isReloading,
    isMindPath,
    shouldShowPrint,
    shouldShowReload,
    shouldShowExport,
    showSubTabsRow,
    hasSubTabs,
    filteredMainTabs: financialsTabs,
    currentSubTabs,
    handleMainTabChange,
    handleSubTabChange,
  };
};
