import { useEffect, useCallback, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store';
import { setActiveTab, setActiveSubTab } from '@/store/slices/uiSlice';
import { SelectChangeEvent } from '@mui/material';

export const mainTabs = [
  { id: 0, label: 'Transactions', path: '/financials/payments' },
  // { id: 1, label: 'Bank Deposits', path: '/financials/bank-deposits' },
  { id: 2, label: 'Statements', path: '/financials/statements/pip' },
  { id: 3, label: 'Variance Analysis', path: '/financials/variance-analysis' },
  { id: 4, label: 'Trends & Forecast', path: '/financials/trends-forecast' },
  { id: 5, label: 'Reconciliation', path: '/financials/reconciliation' },
];

export const reconciliationSubTabs = [
  { id: 0, label: 'Unreconciled', path: '/financials/reconciliation/unreconciled' },
  { id: 1, label: 'Reconciled', path: '/financials/reconciliation/reconciled' },
  { id: 2, label: 'My Queue', path: '/financials/reconciliation/my-queue' },
];

export const transactionSubTabs = [
  // { id: 0, label: 'All Transactions', path: '/financials/all-transactions' },
  { id: 1, label: 'Payments', path: '/financials/payments' },
  // { id: 2, label: 'Recoupments', path: '/financials/recoupments' },
  // { id: 3, label: 'Adjustments', path: '/financials/other-adjustments' },
];

export const statementsSubTabs = [
  { id: 0, label: 'PIP Statements', path: '/financials/statements/pip' },
  // { id: 1, label: 'Forward Balance', path: '/financials/statements/forward-balance' },
  // { id: 2, label: 'Suspense Accounts', path: '/financials/statements/suspense-accounts' },
];

export const varianceSubTabs = [
  { id: 0, label: 'Fee Schedule Variance', path: '/financials/variance-analysis/fee-schedule' },
  { id: 1, label: 'Payment Variance', path: '/financials/variance-analysis/payment' },
];

export const trendsSubTabs = [
  { id: 0, label: 'Forecast Trends', path: '/financials/trends-forecast/forecast' },
  { id: 1, label: 'Executive Summary', path: '/financials/trends-forecast/summary' },
  { id: 2, label: 'Payer Performance', path: '/financials/trends-forecast/payer-performance' },
];

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
  const user = useAppSelector((s) => s.auth.user);
  const { selectedTenantId } = useAppSelector((s) => s.tenant);
  const isMindPath = useMemo(
    () =>
      user?.company?.toLowerCase() === 'mindpath' ||
      selectedTenantId?.toLowerCase() === 'mindpath',
    [user, selectedTenantId]
  );
  useEffect(() => {
    const path = location.pathname;
    if (path.includes('/all-transactions') || path.includes('/payments') || path.includes('/recoupments') || path.includes('/other-adjustments') || path.includes('/pip') || path.includes('/collections')) {
      dispatch(setActiveTab(0));
      const subIndex = transactionSubTabs.findIndex(st => path === st.path);
      if (subIndex !== -1) dispatch(setActiveSubTab(subIndex));
    } else if (path.includes('/statements')) {
      dispatch(setActiveTab(2));
      if (path.includes('/pip')) dispatch(setActiveSubTab(0));
      else if (path.includes('/forward-balance')) dispatch(setActiveSubTab(1));
      else if (path.includes('/suspense-accounts')) dispatch(setActiveSubTab(2));
    } else if (path.includes('/variance-analysis')) {
      dispatch(setActiveTab(3));
      if (path.includes('/fee-schedule')) dispatch(setActiveSubTab(0));
      else if (path.includes('/payment')) dispatch(setActiveSubTab(1));
    } else if (path.includes('/trends-forecast')) {
      dispatch(setActiveTab(4));
      if (path.includes('/forecast')) dispatch(setActiveSubTab(0));
      else if (path.includes('/summary')) dispatch(setActiveSubTab(1));
      else if (path.includes('/payer-performance')) dispatch(setActiveSubTab(2));
    } else if (path.includes('/reconciliation')) {
      dispatch(setActiveTab(5));
      const subIndex = reconciliationSubTabs.findIndex(st => path === st.path);
      dispatch(setActiveSubTab(subIndex !== -1 ? subIndex : 0));
    }
  }, [location.pathname, dispatch]);

  useEffect(() => {
    if (activeTab === 2 && isMindPath) {
      navigate('/financials/payments', { replace: true });
    }
  }, [activeTab, isMindPath, navigate, dispatch]);

  const handleMainTabChange = useCallback((index: number, path: string) => {
    dispatch(setActiveTab(index));
    navigate(path);
  }, [dispatch, navigate]);

  const handleSubTabChange = useCallback((index: number, path: string) => {
    dispatch(setActiveSubTab(index));
    navigate(path);
  }, [dispatch, navigate]);

  const canShowActions = useMemo(() => activeTab === 0 || activeTab === 2 || activeTab === 3 || activeTab === 5, [activeTab]);
  const shouldShowPrint = showPrint ?? canShowActions;
  const shouldShowReload = showReload ?? canShowActions;
  const shouldShowExport = showExportWizard ?? canShowActions;

  const hasSubTabs = useMemo(() => [0, 2, 3, 4, 5].includes(activeTab), [activeTab]);
  const hasActions = shouldShowPrint || shouldShowReload || shouldShowExport;
  const showSubTabsRow = hasSubTabs || hasActions;

  const filteredMainTabs = useMemo(() => {
    return mainTabs.filter(tab => !(tab.id === 2 && isMindPath));
  }, [isMindPath]);

  return {
    activeTab,
    activeSubTab,
    isReloading,
    isMindPath,
    shouldShowPrint,
    shouldShowReload,
    shouldShowExport,
    showSubTabsRow,
    filteredMainTabs,
    handleMainTabChange,
    handleSubTabChange,
  };
};
