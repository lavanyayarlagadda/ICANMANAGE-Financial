import React from 'react';
import { Box, IconButton, Typography, useTheme } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DashboardLayout from '@/components/templates/DashboardLayout';
import FinancialsTabs from '@/components/organisms/FinancialsTabs';
import AllTransactionsScreen from '@/components/pages/AllTransactionsScreen';
import PaymentsScreen from '@/components/pages/PaymentsScreen';
import PipScreen from '@/components/pages/PipScreen';
import RemittanceDetailScreen from '@/components/pages/RemittanceDetailScreen';
import TrendsScreen from '@/components/pages/TrendsScreen';
import VarianceScreen from '@/components/pages/VarianceScreen';
import ForwardBalancesScreen from '@/components/pages/ForwardBalancesScreen';
import RecoupmentsScreen from '@/components/pages/RecoupmentsScreen';
import OtherAdjustmentsScreen from '@/components/pages/OtherAdjustmentsScreen';
import CollectionsScreen from '@/components/pages/CollectionsScreen';
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
} from '@/store/slices/uiSlice';
import {
  setShowRemittanceDetail,
  deletePayment,
  deleteRecoupment,
  deleteAdjustment,
  deleteForwardBalance,
  deleteAllTransaction,
  deleteCollection,
} from '@/store/slices/financialsSlice';

const FinancialsPage: React.FC = () => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const { activeTab, activePage, viewDialogOpen, viewDialogData, editDialogOpen, editDialogData, confirmDeleteOpen, confirmDeleteId, confirmDeleteType } = useAppSelector((s) => s.ui);
  const { showRemittanceDetail } = useAppSelector((s) => s.financials);
  const [addDialogOpen, setAddDialogOpen] = React.useState(false);

  const tabContentMap: Record<number, React.ReactNode> = {
    0: <AllTransactionsScreen />,
    1: <PaymentsScreen />,
    2: <PipScreen />,
    3: <ForwardBalancesScreen />,
    4: <RecoupmentsScreen />,
    5: <OtherAdjustmentsScreen />,
    6: <VarianceScreen />,
    7: <TrendsScreen />,
  };

  const handleDelete = () => {
    if (!confirmDeleteId) return;
    const deleteMap: Record<string, () => void> = {
      payment: () => dispatch(deletePayment(confirmDeleteId)),
      recoupment: () => dispatch(deleteRecoupment(confirmDeleteId)),
      adjustment: () => dispatch(deleteAdjustment(confirmDeleteId)),
      'forward balance': () => dispatch(deleteForwardBalance(confirmDeleteId)),
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
        <FinancialsTabs onAddNew={() => setAddDialogOpen(true)} />
        {tabContentMap[activeTab] ?? <AllTransactionsScreen />}
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
