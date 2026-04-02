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

const AllTransactionsScreen = lazy(() => import('@/components/pages/AllTransactions/AllTransactionsScreen'));
const PaymentsScreen = lazy(() => import('@/components/pages/Payments/PaymentsScreen'));
const RemittanceDetailScreen = lazy(() => import('@/components/pages/RemittanceDetail/RemittanceDetailScreen'));
const TrendsScreen = lazy(() => import('@/components/pages/Trends/TrendsScreen'));
const VarianceScreen = lazy(() => import('@/components/pages/Variance/VarianceScreen'));
const BankDepositsScreen = lazy(() => import('@/components/pages/BankDeposits/BankDepositsScreen'));
const StatementsScreen = lazy(() => import('@/components/pages/Statements/StatementsScreen'));
const RecoupmentsScreen = lazy(() => import('@/components/pages/Recoupments/RecoupmentsScreen'));
const OtherAdjustmentsScreen = lazy(() => import('@/components/pages/OtherAdjustments/OtherAdjustmentsScreen'));
const CollectionsScreen = lazy(() => import('@/components/pages/Collections/CollectionsScreen'));
const CalendarScreen = lazy(() => import('@/components/pages/Calendar/CalendarScreen'));

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

  const mainContent = useMemo(() => {
    if (activePage === 'collections') {
      return <CollectionsScreen />;
    }

    if (showRemittanceDetail) {
      return (
        <Box>
          <BackButtonWrapper>
            <IconButton onClick={handleBackToPayments} size="small" sx={{ border: `1px solid ${theme.palette.divider}` }}>
              <ArrowBackIcon fontSize="small" />
            </IconButton>
            <BackText>Back to Payments</BackText>
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

