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
  const { canViewPip } = useUserPermissions();
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.pathname.startsWith('/collections')) {
      dispatch(setActivePage('collections'));
    } else if (location.pathname.startsWith('/financials')) {
      dispatch(setActivePage('financials'));
      const pathPart = location.pathname.split('/financials/')[1] || '';
      const pathMap: Record<string, { tab: number; subTab: number }> = {
        'all-transactions': { tab: 0, subTab: 0 },
        'payments': { tab: 0, subTab: 1 },
        'recoupments': { tab: 0, subTab: 2 },
        'other-adjustments': { tab: 0, subTab: 3 },
        'pip': { tab: 0, subTab: 3 },
        'bank-deposits': { tab: 1, subTab: 0 },
        'statements': { tab: 2, subTab: 0 },
        'statements/pip': { tab: 2, subTab: 0 },
        'statements/forward-balance': { tab: 2, subTab: 1 },
        'variance-analysis': { tab: 3, subTab: 0 },
        'trends-forecast': { tab: 4, subTab: 0 },
        'calendar': { tab: 5, subTab: 0 },
      };

      const match = pathMap[pathPart];

      if (!canViewPip && (pathPart === 'pip' || pathPart === 'statements/pip' || pathPart === 'statements')) {
        const target = pathPart.startsWith('statements') 
          ? '/financials/statements/forward-balance' 
          : '/financials/all-transactions';
        navigate(target, { replace: true });
        return;
      }

      if (match) {
        if (uiState.activeTab !== match.tab) dispatch(setActiveTab(match.tab));
        if (uiState.activeSubTab !== match.subTab) dispatch(setActiveSubTab(match.subTab));
      } else if (pathPart === '') {
        navigate('/financials/payments', { replace: true });
      }
    }
  }, [location.pathname, dispatch, navigate, uiState.activeTab, uiState.activeSubTab, canViewPip]);

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
