import { useEffect, useCallback, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store';
import { setActiveTab, setActiveSubTab } from '@/store/slices/uiSlice';
import { useUserPermissions } from '@/hooks/useUserPermissions';

export const mainTabs = [
  { id: 0, label: 'Transactions', path: '/financials/all-transactions' },
  { id: 1, label: 'Bank Deposits', path: '/financials/bank-deposits' },
  { id: 2, label: 'Statements', path: '/financials/statements/pip' },
  { id: 3, label: 'Variance Analysis', path: '/financials/variance-analysis/fee-schedule' },
  { id: 4, label: 'Trends & Forecast', path: '/financials/trends-forecast/forecast' },
  // { id: 5, label: 'Reconciliation', path: '/financials/reconciliation/unreconciled' },
];

// export const reconciliationSubTabs = [
//   { id: 0, label: 'Unreconciled', path: '/financials/reconciliation/unreconciled' },
//   { id: 1, label: 'Reconciled', path: '/financials/reconciliation/reconciled' },
//   { id: 2, label: 'My Queue', path: '/financials/reconciliation/my-queue' },
// ];

export const transactionSubTabs = [
  { id: 0, label: 'All Transactions', path: '/financials/all-transactions' },
  { id: 1, label: 'Payments', path: '/financials/payments' },
  { id: 2, label: 'Recoupments', path: '/financials/recoupments' },
  { id: 3, label: 'Other Adjustments', path: '/financials/other-adjustments' },
];

export const statementsSubTabs = [
  { id: 0, label: 'PIP', path: '/financials/statements/pip' },
  { id: 1, label: 'Forward Balances', path: '/financials/statements/forward-balance' },
  { id: 2, label: 'Suspense Accounts', path: '/financials/statements/suspense-accounts' },
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

  const { getMenuStatus } = useUserPermissions();

  const isMindPath = useMemo(
    () =>
      user?.company?.toLowerCase() === 'mindpath' ||
      selectedTenantId?.toLowerCase() === 'mindpath',
    [user, selectedTenantId]
  );

  useEffect(() => {
    const path = location.pathname;
    if (path.includes('/all-transactions') || path.includes('/payments') || path.includes('/recoupments') || path.includes('/other-adjustments')) {
      dispatch(setActiveTab(0));
      const subIndex = transactionSubTabs.findIndex(st => path.includes(st.path));
      if (subIndex !== -1) dispatch(setActiveSubTab(subIndex));
    } else if (path.includes('/collections')) {
      dispatch(setActiveTab(0));
      dispatch(setActiveSubTab(1));
    } else if (path.includes('/bank-deposits')) {
      dispatch(setActiveTab(1));
      dispatch(setActiveSubTab(0));
    } else if (path.includes('/statements') || path.includes('/pip')) {
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
    }
  }, [location.pathname, dispatch]);

  useEffect(() => {
    const pathPart = location.pathname.split('/financials/')[1] || '';
    if (activeTab === 2 && isMindPath) {
      navigate('/financials/payments', { replace: true });
    } else if (pathPart === '') {
      navigate('/financials/all-transactions', { replace: true });
    }
  }, [activeTab, isMindPath, navigate, location.pathname]);

  const handleMainTabChange = useCallback((index: number, path: string) => {
    if (getMenuStatus(mainTabs[index].label, 'Financials') === 'Disabled') return;
    dispatch(setActiveTab(index));
    navigate(path);
  }, [dispatch, navigate, getMenuStatus]);

  const handleSubTabChange = useCallback((index: number, path: string) => {
    // Determine the relevant sub-tab label for the click handler
    let label = '';
    const currentSubTabs =
      activeTab === 0 ? transactionSubTabs :
        activeTab === 2 ? statementsSubTabs :
          activeTab === 3 ? varianceSubTabs :
            activeTab === 4 ? trendsSubTabs : [];
    
    label = currentSubTabs[index]?.label || '';
    
    const parentLabel = 
      activeTab === 0 ? 'Transactions' :
      activeTab === 2 ? 'Statements' :
      activeTab === 3 ? 'Variance Analysis' :
      activeTab === 4 ? 'Trends & Forecast' : 'Financials';

    if (getMenuStatus(label, parentLabel) === 'Disabled') return;

    dispatch(setActiveSubTab(index));
    navigate(path);
  }, [dispatch, navigate, activeTab, getMenuStatus]);

  const canShowActions = useMemo(() => activeTab === 0 || activeTab === 2 || activeTab === 3 || activeTab === 5, [activeTab]);
  const shouldShowPrint = showPrint ?? canShowActions;
  const shouldShowReload = showReload ?? canShowActions;
  const shouldShowExport = showExportWizard ?? canShowActions;

  const hasSubTabs = useMemo(() => [0, 2, 3, 4, 5].includes(activeTab), [activeTab]);
  const hasActions = shouldShowPrint || shouldShowReload || shouldShowExport;
  const showSubTabsRow = hasSubTabs || hasActions;

  const filteredMainTabs = useMemo(() => {
    return mainTabs.filter((tab) => {
      // Containers that don't directly map to a single security module 
      // but should be visible if Financials is accessible.
      if (['Transactions', 'Bank Deposits', 'Statements'].includes(tab.label)) {
        if (getMenuStatus('Financials') === 'Hidden') return false;
        if (tab.id === 2 && isMindPath) return false;
        return true;
      }

      const status = getMenuStatus(tab.label, 'Financials');
      if (status === 'Hidden') return false;
      return true;
    });
  }, [isMindPath, getMenuStatus]);

  const filteredTransactionSubTabs = useMemo(() => transactionSubTabs.filter(st => getMenuStatus(st.label, 'Transactions') !== 'Hidden'), [getMenuStatus]);
  const filteredStatementsSubTabs = useMemo(() => statementsSubTabs.filter(st => getMenuStatus(st.label, 'Statements') !== 'Hidden' && !(st.label === 'PIP' && isMindPath)), [getMenuStatus, isMindPath]);
  const filteredVarianceSubTabs = useMemo(() => varianceSubTabs.filter(st => getMenuStatus(st.label, 'Variance Analysis') !== 'Hidden'), [getMenuStatus]);
  const filteredTrendsSubTabs = useMemo(() => trendsSubTabs.filter(st => getMenuStatus(st.label, 'Trends & Forecast') !== 'Hidden'), [getMenuStatus]);

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
    filteredTransactionSubTabs,
    filteredStatementsSubTabs,
    filteredVarianceSubTabs,
    filteredTrendsSubTabs,
    handleMainTabChange,
    handleSubTabChange,
    getMenuStatus
  };
};
