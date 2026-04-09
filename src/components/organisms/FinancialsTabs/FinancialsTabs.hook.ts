import { useEffect, useCallback, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store';
import { setActiveTab, setActiveSubTab } from '@/store/slices/uiSlice';

export const mainTabs = [
  { id: 0, label: 'Transactions', path: '/financials/all-transactions' },
  { id: 1, label: 'Bank Deposits', path: '/financials/bank-deposits' },
  { id: 2, label: 'Statements', path: '/financials/statements/pip' },
  { id: 3, label: 'Variance Analysis', path: '/financials/variance-analysis/fee-schedule' },
  { id: 4, label: 'Trends & Forecast', path: '/financials/trends-forecast/forecast' },
  { id: 5, label: 'Reconciliation', path: '/financials/reconciliation/unreconciled' },
];

export const reconciliationSubTabs = [
  { id: 0, label: 'Unreconciled', path: '/financials/reconciliation/unreconciled' },
  { id: 1, label: 'Reconciled', path: '/financials/reconciliation/reconciled' },
  { id: 2, label: 'My Queue', path: '/financials/reconciliation/my-queue' },
];

export const transactionSubTabs = [
  { id: 0, label: 'All Transactions', path: '/financials/all-transactions' },
  { id: 1, label: 'Payments', path: '/financials/payments' },
  { id: 2, label: 'Recoupments', path: '/financials/recoupments' },
  { id: 3, label: 'Adjustments', path: '/financials/other-adjustments' },
];

export const statementsSubTabs = [
  { id: 0, label: 'PIP Statements', path: '/financials/statements/pip' },
  { id: 1, label: 'Forward Balance', path: '/financials/statements/forward-balance' },
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

  const isMindPath = useMemo(
    () =>
      user?.company?.toLowerCase() === 'mindpath' ||
      selectedTenantId?.toLowerCase() === 'mindpath',
    [user, selectedTenantId]
  );

  useEffect(() => {
    // Rely on FinancialsPage to sync path with activeTab/SubTab to avoid redundancy
  }, []);

  useEffect(() => {
    const pathPart = location.pathname.split('/financials/')[1] || '';
    if (activeTab === 2 && isMindPath) {
      navigate('/financials/payments', { replace: true });
    } else if (pathPart === '') {
      navigate('/financials/all-transactions', { replace: true });
    }
  }, [activeTab, isMindPath, navigate, location.pathname]);

  const handleMainTabChange = useCallback((index: number, path: string) => {
    if (activeTab !== index) dispatch(setActiveTab(index));
    navigate(path);
  }, [dispatch, navigate, activeTab]);

  const handleSubTabChange = useCallback((index: number, path: string) => {
    if (activeSubTab !== index) dispatch(setActiveSubTab(index));
    navigate(path);
  }, [dispatch, navigate, activeSubTab]);

  const isExecutiveSummary = activeTab === 4 && activeSubTab === 1;
  const canShowActions = useMemo(() => [0, 1, 2, 3, 4, 5].includes(activeTab), [activeTab]);
  const shouldShowPrint = showPrint ?? (canShowActions && !isExecutiveSummary);
  const shouldShowReload = showReload ?? canShowActions;
  const shouldShowExport = showExportWizard ?? (canShowActions && !isExecutiveSummary);

  const hasSubTabs = useMemo(() => [0, 2, 3, 4, 5].includes(activeTab), [activeTab]);
  const hasActions = shouldShowPrint || shouldShowReload || shouldShowExport;
  const showSubTabsRow = (hasSubTabs || hasActions) && activeTab !== -1;

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
    hasSubTabs,
    filteredMainTabs,
    handleMainTabChange,
    handleSubTabChange,
  };
};
