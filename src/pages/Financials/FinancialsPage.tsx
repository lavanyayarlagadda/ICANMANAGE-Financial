import React, { Suspense, lazy, useMemo } from 'react';
import { Box, IconButton, useTheme, CircularProgress, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SecurityIcon from '@mui/icons-material/Security';
import DashboardLayout from '@/components/templates/DashboardLayout/DashboardLayout';
import FinancialsTabs from '@/components/organisms/FinancialsTabs/FinancialsTabs';
import ViewDialog from '@/components/molecules/ViewDialog/ViewDialog';
import EditDialog from '@/components/molecules/EditDialog/EditDialog';
import ConfirmDeleteDialog from '@/components/molecules/ConfirmDeleteDialog/ConfirmDeleteDialog';
import AddNewDialog from '@/components/molecules/AddNewDialog/AddNewDialog';
import { 
    PageWrapper, 
    BackButtonWrapper, 
    BackText,
    RestrictedContainer,
    RestrictedTitle,
    RestrictedBody
} from './FinancialsPage.styles';
import { useFinancialsPage } from './FinancialsPage.hook';
import { closeViewDialog, closeEditDialog, closeConfirmDelete } from '@/store/slices/uiSlice';
import { themeConfig } from '@/theme/themeConfig';
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
  <Box sx={{ 
    display: 'flex', 
    flexDirection: 'column',
    justifyContent: 'center', 
    alignItems: 'center', 
    py: 12,
    gap: 2
  }}>
    <CircularProgress size={32} thickness={4} sx={{ color: '#94a3b8' }} />
    <Typography variant="body2" sx={{ color: '#94a3b8', fontWeight: 500 }}>
      Preparing module view...
    </Typography>
  </Box>
);

const FinancialsPage: React.FC = () => {
  const theme = useTheme();
  const {
    activeTab,
    activeSubTab,
    isRestricted,
    activePage,
    financialsTabs,
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
    isLoadingUserDetails,
    dispatch,
  } = useFinancialsPage();

  const tabContent = useMemo(() => {
    const mainTab = financialsTabs.find(t => t.id === activeTab);
    if (!mainTab) return <AllTransactionsScreen skip={false} />;

    if (mainTab.subTabs && mainTab.subTabs.length > 0) {
        const subTab = mainTab.subTabs.find(st => st.id === activeSubTab) || mainTab.subTabs[0];
        const Component = subTab.component;
        if (Component) return <Component skip={false} />;

        // Fallback for screens like "Statements" or "Variance" which still have their own internal sub-tab logic or are compound
        // If we want to strictly use our dynamic structure for everything, we might need to adjust those screens.
        // For now, let's see if the main component can handle it.
        const MainComponent = mainTab.component;
        if (MainComponent) return <MainComponent skip={false} />;
        
        return <AllTransactionsScreen skip={false} />;
    }

    const Component = mainTab.component;
    if (Component) return <Component skip={false} />;

    return <AllTransactionsScreen skip={false} />;
  }, [activeTab, activeSubTab, financialsTabs]);

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

    if (isLoadingUserDetails) return null; // Handled by DashboardLayout overlay

    return (
      <>
        <FinancialsTabs 
        onPrint={handlePrint}
        onReload={handleReload}
        onExportWizard={handleExport}
        isRestricted={isRestricted}
      />
      
      {isRestricted ? (
          <RestrictedContainer>
              <SecurityIcon sx={{ fontSize: 64, color: '#CBD5E1', mb: 2 }} />
              <RestrictedTitle variant="h5">
                  Access Restricted
              </RestrictedTitle>
              <RestrictedBody variant="body1">
                  You don't have the necessary permissions to view this module. 
                  Please contact your administrator for access.
              </RestrictedBody>
          </RestrictedContainer>
      ) : (
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, px: 2, pt: 1 }}>
            {tabContent}
          </Box>
      )}
      </>
    );
  }, [activePage, showRemittanceDetail, theme, handleBackToPayments, handlePrint, handleReload, handleExport, tabContent, isRestricted]);

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

