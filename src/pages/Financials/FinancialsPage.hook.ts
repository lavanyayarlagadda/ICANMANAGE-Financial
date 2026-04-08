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

export const useFinancialsPage = () => {
  const dispatch = useAppDispatch();
  const uiState = useAppSelector((s) => s.ui);
  const { showRemittanceDetail } = useAppSelector((s) => s.financials);
  const { getMenuStatus } = useUserPermissions();
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.pathname.startsWith('/collections')) {
      dispatch(setActivePage('collections'));
    } else if (location.pathname.startsWith('/financials')) {
      dispatch(setActivePage('financials'));
      const pathPart = location.pathname.split('/financials/')[1] || '';
      const pathMap: Record<string, { tab: number; subTab: number; label: string; parent?: string }> = {
        'all-transactions': { tab: 0, subTab: 0, label: 'All Transactions', parent: 'Transactions' },
        'payments': { tab: 0, subTab: 1, label: 'Payments', parent: 'Transactions' },
        'recoupments': { tab: 0, subTab: 2, label: 'Recoupments', parent: 'Transactions' },
        'other-adjustments': { tab: 0, subTab: 3, label: 'Other Adjustments', parent: 'Transactions' },
        'bank-deposits': { tab: 1, subTab: 0, label: 'Bank Deposits' },
        'statements': { tab: 2, subTab: 0, label: 'Statements' },
        'statements/pip': { tab: 2, subTab: 0, label: 'PIP', parent: 'Statements' },
        'statements/forward-balance': { tab: 2, subTab: 1, label: 'Forward Balances', parent: 'Statements' },
        'statements/suspense-accounts': { tab: 2, subTab: 2, label: 'Suspense Accounts', parent: 'Statements' },
        'variance-analysis': { tab: 3, subTab: 0, label: 'Variance Analysis' },
        'variance-analysis/fee-schedule': { tab: 3, subTab: 0, label: 'Fee Schedule Variance', parent: 'Variance Analysis' },
        'variance-analysis/payment': { tab: 3, subTab: 1, label: 'Payment Variance', parent: 'Variance Analysis' },
        'trends-forecast': { tab: 4, subTab: 0, label: 'Trends & Forecast' },
        'trends-forecast/forecast': { tab: 4, subTab: 0, label: 'Forecast Trends', parent: 'Trends & Forecast' },
        'trends-forecast/summary': { tab: 4, subTab: 1, label: 'Executive Summary', parent: 'Trends & Forecast' },
        'trends-forecast/payer-performance': { tab: 4, subTab: 2, label: 'Payer Performance', parent: 'Trends & Forecast' },
        'reconciliation': { tab: 5, subTab: 0, label: 'Reconciliation' },
      };

      const match = pathMap[pathPart];

      // Redirection logic for Restricted (Hidden/Disabled) modules
      if (match) {
        const status = getMenuStatus(match.label, match.parent);
        if (status === 'Hidden' || status === 'Disabled') {
          // Find first active sub-tab in Transactions (the default group)
          const firstActive = ['all-transactions', 'payments', 'recoupments', 'other-adjustments'].find(p => {
             const m = pathMap[p];
             return getMenuStatus(m.label, m.parent) === 'Active';
          });
          
          if (firstActive) {
            navigate(`/financials/${firstActive}`, { replace: true });
          } else {
            // If all transactions are restricted, maybe go somewhere else or just stay
            console.warn('[FinancialsPage] No accessible sub-tabs found for redirection.');
          }
          return;
        }

        if (uiState.activeTab !== match.tab) dispatch(setActiveTab(match.tab));
        if (uiState.activeSubTab !== match.subTab) dispatch(setActiveSubTab(match.subTab));
      } else if (pathPart === '') {
        navigate('/financials/all-transactions', { replace: true });
      }
    }
  }, [location.pathname, dispatch, navigate, uiState.activeTab, uiState.activeSubTab, getMenuStatus]);

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

  return {
    ...uiState,
    showRemittanceDetail,
    addDialogOpen,
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
