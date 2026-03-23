import React from 'react';
import { Box, IconButton, Typography, useTheme } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DashboardLayout from '@/components/templates/DashboardLayout';
import FinancialsTabs from '@/components/organisms/FinancialsTabs';
import AllTransactionsScreen from '@/components/pages/AllTransactionsScreen';
import PaymentsScreen from '@/components/pages/PaymentsScreen';
import PipScreen from '@/components/pages/PipScreen';
import RemittanceDetailScreen from '@/components/pages/RemittanceDetailScreen';
import TrendsScreen from '@/components/pages/TrendsScreen';
import VarianceScreen from '@/components/pages/VarianceScreen';
import BankDepositsScreen from '@/components/pages/BankDepositsScreen';
import StatementsScreen from '@/components/pages/StatementsScreen';
import RecoupmentsScreen from '@/components/pages/RecoupmentsScreen';
import OtherAdjustmentsScreen from '@/components/pages/OtherAdjustmentsScreen';
import CollectionsScreen from '@/components/pages/CollectionsScreen';
import CalendarScreen from '@/components/pages/CalendarScreen';
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

const FinancialsPage: React.FC = () => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const { activeTab, activeSubTab, activePage, viewDialogOpen, viewDialogData, editDialogOpen, editDialogData, confirmDeleteOpen, confirmDeleteId, confirmDeleteType } = useAppSelector((s) => s.ui);
  const { showRemittanceDetail } = useAppSelector((s) => s.financials);
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
  };

  const handleDelete = () => {
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
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <IconButton onClick={() => dispatch(setShowRemittanceDetail(false))} size="small" sx={{ border: `1px solid ${theme.palette.divider}` }}>
              <ArrowBackIcon fontSize="small" />
            </IconButton>
            <Typography variant="body2" color="text.secondary">
              Back to Payments
            </Typography>
          </Box>
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
        {renderTabContent()}
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
