import React, { lazy, Suspense } from 'react';
import { IconButton, Typography, useTheme, Box, CircularProgress } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DashboardLayout from '@/components/templates/DashboardLayout';
import FinancialsTabs from '@/components/organisms/FinancialsTabs';
import ViewDialog from '@/components/molecules/ViewDialog';
import EditDialog from '@/components/molecules/EditDialog';
import ConfirmDeleteDialog from '@/components/molecules/ConfirmDeleteDialog';
import AddNewDialog from '@/components/molecules/AddNewDialog';
import { useAppSelector, useAppDispatch } from '@/store';
import {
  closeViewDialog,
  closeEditDialog,
  closeConfirmDelete,
  showSnackbar,
  setActivePage,
  setActiveTab,
  setActiveSubTab,
} from '@/store/slices/uiSlice';
import {
  setShowRemittanceDetail,
  deletePayment,
  deleteRecoupment,
  deleteAdjustment,
  deleteAllTransaction,
  deleteCollection,
} from '@/store/slices/financialsSlice';
import { BackButtonContainer } from './FinancialsPage.styles';

// Lazy load screens to improve bundle size and initial load time
const AllTransactionsScreen = lazy(() => import('@/components/pages/AllTransactionsScreen'));
const PaymentsScreen = lazy(() => import('@/components/pages/PaymentsScreen'));
const RecoupmentsScreen = lazy(() => import('@/components/pages/RecoupmentsScreen'));
const OtherAdjustmentsScreen = lazy(() => import('@/components/pages/OtherAdjustmentsScreen'));
const BankDepositsScreen = lazy(() => import('@/components/pages/BankDepositsScreen'));
const StatementsScreen = lazy(() => import('@/components/pages/StatementsScreen'));
const VarianceScreen = lazy(() => import('@/components/pages/VarianceScreen'));
const TrendsScreen = lazy(() => import('@/components/pages/TrendsScreen'));
const CalendarScreen = lazy(() => import('@/components/pages/CalendarScreen'));
const CollectionsScreen = lazy(() => import('@/components/pages/CollectionsScreen'));
const RemittanceDetailScreen = lazy(() => import('@/components/pages/RemittanceDetailScreen'));

// Static path mapping outside component to prevent recreation on every render
const PATH_MAP: Record<string, { tab: number; subTab: number }> = {
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

const LoadingFallback: React.FC = () => (
  <Box sx={{ display: 'flex', justifyContent: 'center', p: 8 }}>
    <CircularProgress size={32} />
  </Box>
);

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
  const [addDialogOpen, setAddDialogOpen] = React.useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Sync tab state with URL path
  React.useEffect(() => {
    if (location.pathname.startsWith('/collections')) {
      dispatch(setActivePage('collections'));
    } else if (location.pathname.startsWith('/financials')) {
      dispatch(setActivePage('financials'));
      const pathPart = location.pathname.split('/financials/')[1] || '';
      const match = PATH_MAP[pathPart];
      
      if (match) {
        if (activeTab !== match.tab) dispatch(setActiveTab(match.tab));
        if (activeSubTab !== match.subTab) dispatch(setActiveSubTab(match.subTab));
      } else if (pathPart === '') {
        navigate('/financials/all-transactions', { replace: true });
      }
    }
  }, [location.pathname, dispatch, navigate, activeTab, activeSubTab]);

  const renderTabContent = () => {
    if (activeTab === 0) {
      switch (activeSubTab) {
        case 1: return <PaymentsScreen />;
        case 2: return <RecoupmentsScreen />;
        case 3: return <OtherAdjustmentsScreen />;
        default: return <AllTransactionsScreen />;
      }
    }

    switch (activeTab) {
      case 1: return <BankDepositsScreen />;
      case 2: return <StatementsScreen />;
      case 3: return <VarianceScreen />;
      case 4: return <TrendsScreen />;
      case 5: return <CalendarScreen />;
      default: return <AllTransactionsScreen />;
    }
  };

  const handleDelete = () => {
    if (!confirmDeleteId) return;
    const deleteAction = {
      payment: deletePayment,
      recoupment: deleteRecoupment,
      adjustment: deleteAdjustment,
      transaction: deleteAllTransaction,
      collection: deleteCollection,
    }[confirmDeleteType as keyof { payment: any; recoupment: any; adjustment: any; transaction: any; collection: any }];

    if (deleteAction) {
      dispatch(deleteAction(confirmDeleteId));
      dispatch(closeConfirmDelete());
      dispatch(showSnackbar({ message: `${confirmDeleteType} deleted successfully.`, severity: 'success' }));
    }
  };

  const handleEditSave = () => {
    dispatch(closeEditDialog());
    dispatch(showSnackbar({ message: 'Record updated successfully.', severity: 'success' }));
  };

  const renderContent = () => {
    if (activePage === 'collections') {
      return <CollectionsScreen />;
    }

    if (showRemittanceDetail) {
      return (
        <Box>
          <BackButtonContainer>
            <IconButton 
              onClick={() => dispatch(setShowRemittanceDetail(false))} 
              size="small" 
              sx={{ border: `1px solid ${theme.palette.divider}` }}
            >
              <ArrowBackIcon fontSize="small" />
            </IconButton>
            <Typography variant="body2" color="text.secondary">
              Back to Payments
            </Typography>
          </BackButtonContainer>
          <RemittanceDetailScreen />
        </Box>
      );
    }

    return (
      <>
        <FinancialsTabs onAddNew={() => setAddDialogOpen(true)} />
        <Suspense fallback={<LoadingFallback />}>
          {renderTabContent()}
        </Suspense>
      </>
    );
  };

  return (
    <DashboardLayout>
      {renderContent()}

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
