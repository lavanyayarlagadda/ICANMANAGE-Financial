import React, { Suspense, lazy, useMemo } from 'react';
import { Box, IconButton, useTheme, CircularProgress } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DashboardLayout from '@/components/templates/DashboardLayout/DashboardLayout';
import FinancialsTabs from '@/components/organisms/FinancialsTabs/FinancialsTabs';
import ViewDialog from '@/components/molecules/ViewDialog/ViewDialog';
import EditDialog from '@/components/molecules/EditDialog/EditDialog';
import ConfirmDeleteDialog from '@/components/molecules/ConfirmDeleteDialog/ConfirmDeleteDialog';
import AddNewDialog from '@/components/molecules/AddNewDialog/AddNewDialog';
import { PageWrapper, BackButtonWrapper, BackText } from './FinancialsPage.styles';
import { useFinancialsPage } from './FinancialsPage.hook';
import { closeViewDialog, closeEditDialog, closeConfirmDelete } from '@/store/slices/uiSlice';
import ReconciliationScreen from '@/components/pages/ReconciliationScreen/ReconciliationScreen';

const PaymentsScreen = lazy(() => import('@/components/pages/Payments/PaymentsScreen'));
const AllTransactionsScreen = lazy(() => import('@/components/pages/AllTransactions/AllTransactionsScreen'));
const RecoupmentsScreen = lazy(() => import('@/components/pages/Recoupments/RecoupmentsScreen'));
const OtherAdjustmentsScreen = lazy(() => import('@/components/pages/OtherAdjustments/OtherAdjustmentsScreen'));
const BankDepositsScreen = lazy(() => import('@/components/pages/BankDeposits/BankDepositsScreen'));
const RemittanceDetailScreen = lazy(() => import('@/components/pages/RemittanceDetail/RemittanceDetailScreen'));
const TrendsScreen = lazy(() => import('@/components/pages/Trends/TrendsScreen'));
const VarianceScreen = lazy(() => import('@/components/pages/Variance/VarianceScreen'));
const StatementsScreen = lazy(() => import('@/components/pages/Statements/StatementsScreen'));
const CollectionsScreen = lazy(() => import('@/components/pages/Collections/CollectionsScreen'));

const TabLoadingFallback = () => (
  <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
    <CircularProgress size={32} />
  </Box>
);

const FinancialsPage: React.FC = () => {
  const theme = useTheme();
  const {
    activeTab,
    activeSubTab,
    activePage,
    viewDialogOpen,
    viewDialogData,
    editDialogOpen,
    editDialogData,
    confirmDeleteOpen,
    confirmDeleteType,
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
  } = useFinancialsPage();

  const tabContent = useMemo(() => {
    if (activeTab === 0) {
      switch (activeSubTab) {
        case 0: return <AllTransactionsScreen skip={false} />;
        case 1: return <PaymentsScreen skip={false} />;
        case 2: return <RecoupmentsScreen skip={false} />;
        case 3: return <OtherAdjustmentsScreen skip={false} />;
        default: return <AllTransactionsScreen skip={false} />;
      }
    }

    if (activeTab === 1) return <BankDepositsScreen skip={false} />;
    if (activeTab === 2) return <StatementsScreen skip={false} />;
    if (activeTab === 3) return <VarianceScreen skip={false} />;
    if (activeTab === 4) return <TrendsScreen skip={false} />;
    if (activeTab === 5) return <ReconciliationScreen />;

    return <AllTransactionsScreen skip={false} />;
  }, [activeTab, activeSubTab]);

  const mainContent = useMemo(() => {
    if (activePage === 'collections') {
      return <CollectionsScreen skip={activePage !== 'collections'} />;
    }

    if (showRemittanceDetail) {
      return (
        <Box>
          <BackButtonWrapper>
            <IconButton onClick={handleBackToPayments} size="small" sx={{ border: `1px solid ${theme.palette.divider}` }}>
              <ArrowBackIcon fontSize="small" />
            </IconButton>
            <BackText>Back</BackText>
          </BackButtonWrapper>
          <RemittanceDetailScreen />
        </Box>
      );
    }

    return (
      <>
        <FinancialsTabs
          onPrint={handlePrint}
          onReload={handleReload}
          onExportWizard={handleExport}
        />
        {tabContent}
      </>
    );
  }, [activePage, showRemittanceDetail, theme, handleBackToPayments, handlePrint, handleReload, handleExport, tabContent]);

  return (
    <DashboardLayout>
      <PageWrapper>
        <Suspense fallback={<TabLoadingFallback />}>
          {mainContent}
        </Suspense>

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
      </PageWrapper>
    </DashboardLayout>
  );
};

export default FinancialsPage;

