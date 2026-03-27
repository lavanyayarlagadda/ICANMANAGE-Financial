import React, { Suspense, lazy, useMemo, useCallback } from 'react';
import { Box, IconButton, Typography, useTheme, CircularProgress } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DashboardLayout from '@/components/templates/DashboardLayout';
import FinancialsTabs from '@/components/organisms/FinancialsTabs';
import ViewDialog from '@/components/molecules/ViewDialog';
import EditDialog from '@/components/molecules/EditDialog';
import ConfirmDeleteDialog from '@/components/molecules/ConfirmDeleteDialog';
import AddNewDialog from '@/components/molecules/AddNewDialog';
import { PageWrapper, BackButtonWrapper, BackText } from './FinancialsPage.styles';

const AllTransactionsScreen = lazy(() => import('@/components/pages/AllTransactionsScreen'));
const PaymentsScreen = lazy(() => import('@/components/pages/PaymentsScreen'));
const PipScreen = lazy(() => import('@/components/pages/PipScreen'));
const RemittanceDetailScreen = lazy(() => import('@/components/pages/RemittanceDetailScreen'));
const TrendsScreen = lazy(() => import('@/components/pages/TrendsScreen'));
const VarianceScreen = lazy(() => import('@/components/pages/VarianceScreen'));
const BankDepositsScreen = lazy(() => import('@/components/pages/BankDepositsScreen'));
const StatementsScreen = lazy(() => import('@/components/pages/StatementsScreen'));
const RecoupmentsScreen = lazy(() => import('@/components/pages/RecoupmentsScreen'));
const OtherAdjustmentsScreen = lazy(() => import('@/components/pages/OtherAdjustmentsScreen'));
const CollectionsScreen = lazy(() => import('@/components/pages/CollectionsScreen'));
const CalendarScreen = lazy(() => import('@/components/pages/CalendarScreen'));

const TabLoadingFallback = () => (
  <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
    <CircularProgress size={32} />
  </Box>
);
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

const FinancialsPage: React.FC = () => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const { 
    activeTab, 
    activeSubTab, 
    activePage, 
    viewDialogOpen, 
    viewDialogData, 
    editDialogOpen, 
    editDialogData, 
    confirmDeleteOpen, 
    confirmDeleteId, 
    confirmDeleteType 
  } = useAppSelector((s) => s.ui);
  const { showRemittanceDetail } = useAppSelector((s) => s.financials);
  const { canViewPip } = useUserPermissions();
  const [addDialogOpen, setAddDialogOpen] = React.useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  React.useEffect(() => {
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
        'pip': { tab: 0, subTab: 3 }, // Map PIP to Adjustments for now
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
        if (activeTab !== match.tab) dispatch(setActiveTab(match.tab));
        if (activeSubTab !== match.subTab) dispatch(setActiveSubTab(match.subTab));
      } else if (pathPart === '') {
        navigate('/financials/all-transactions', { replace: true });
      }
    }
  }, [location.pathname, dispatch, navigate, activeTab, activeSubTab, canViewPip]);

  const tabContent = useMemo(() => {
    if (activeTab === 0) {
      const subMap: Record<number, React.ReactNode> = {
        0: <AllTransactionsScreen />,
        1: <PaymentsScreen />,
        2: <RecoupmentsScreen />,
        3: <OtherAdjustmentsScreen />,
      };
      return subMap[activeSubTab] ?? <AllTransactionsScreen />;
    }

    if (activeTab === 1) return <BankDepositsScreen />;
    if (activeTab === 2) return <StatementsScreen />;
    if (activeTab === 3) return <VarianceScreen />;
    if (activeTab === 4) return <TrendsScreen />;
    if (activeTab === 5) return <CalendarScreen />;

    return <AllTransactionsScreen />;
  }, [activeTab, activeSubTab]);

  const handleDelete = useCallback(() => {
    if (!confirmDeleteId) return;
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
  }, [confirmDeleteId, confirmDeleteType, dispatch]);

  const handleEditSave = useCallback(() => {
    dispatch(closeEditDialog());
    dispatch(showSnackbar({ message: 'Record updated successfully.', severity: 'success' }));
  }, [dispatch]);

  const mainContent = useMemo(() => {
    if (activePage === 'collections') {
      return <CollectionsScreen />;
    }

    if (showRemittanceDetail) {
      return (
        <Box>
          <BackButtonWrapper>
            <IconButton onClick={() => dispatch(setShowRemittanceDetail(false))} size="small" sx={{ border: `1px solid ${theme.palette.divider}` }}>
              <ArrowBackIcon fontSize="small" />
            </IconButton>
            <BackText>
              Back to Payments
            </BackText>
          </BackButtonWrapper>
          <RemittanceDetailScreen />
        </Box>
      );
    }

    return (
      <>
        <FinancialsTabs
          onPrint={() => dispatch(triggerPrint())}
          onReload={() => dispatch(triggerReload())}
          onExportWizard={() => dispatch(triggerExport())}
        />
        {tabContent}
      </>
    );
  }, [activePage, showRemittanceDetail, theme, dispatch, tabContent]);

  return (
    <DashboardLayout>
      <Suspense fallback={<TabLoadingFallback />}>
        {mainContent}
      </Suspense>

      {/* Global Dialogs */}
      <ViewDialog
        open={viewDialogOpen}
        onClose={() => dispatch(closeViewDialog())}
        title="Record Details"
        data={viewDialogData}
      />

      <EditDialog
        open={editDialogOpen}
        onClose={() => dispatch(closeEditDialog())}
        onSave={handleEditSave}
        title="Record"
        data={editDialogData}
      />

      <ConfirmDeleteDialog
        open={confirmDeleteOpen}
        onClose={() => dispatch(closeConfirmDelete())}
        onConfirm={handleDelete}
        itemType={confirmDeleteType}
      />

      <AddNewDialog
        open={addDialogOpen}
        onClose={() => setAddDialogOpen(false)}
        activeTab={activeTab}
      />
    </DashboardLayout>
  );
};

export default FinancialsPage;
