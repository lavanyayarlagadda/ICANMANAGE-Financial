import React, { Suspense, lazy, useMemo } from 'react';
import { Box } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
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
  RestrictedBody,
  FallbackContainer,
  FallbackProgress,
  FallbackText,
  BackIconButton,
  RestrictedIconWrapper,
  RestrictedIcon,
  TabContentWrapper,
} from './FinancialsPage.styles';
import { useFinancialsPage } from './FinancialsPage.hook';
import { closeViewDialog, closeEditDialog, closeConfirmDelete } from '@/store/slices/uiSlice';

const AllTransactionsScreen = lazy(
  () => import('@/pages/Financials/screens/AllTransactions/AllTransactionsScreen'),
);
const RemittanceDetailScreen = lazy(
  () => import('@/pages/Financials/screens/RemittanceDetail/RemittanceDetailScreen'),
);
const CollectionsScreen = lazy(
  () => import('@/pages/Financials/screens/Collections/CollectionsScreen'),
);

const TabLoadingFallback = () => (
  <FallbackContainer>
    <FallbackProgress size={32} thickness={4} />
    <FallbackText variant="body2">Preparing module view...</FallbackText>
  </FallbackContainer>
);

const FinancialsPage: React.FC = () => {
  const {
    activeTab,
    activeSubTab,
    isRestricted,
    isRedirectingFromHiddenRoute,
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
    const mainTab = financialsTabs.find((t) => t.id === activeTab);
    if (!mainTab) return <AllTransactionsScreen skip={false} />;

    if (mainTab.subTabs && mainTab.subTabs.length > 0) {
      const subTab = mainTab.subTabs.find((st) => st.id === activeSubTab) || mainTab.subTabs[0];
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
            <BackIconButton onClick={handleBackToPayments} size="small">
              <ArrowBackIcon fontSize="small" />
            </BackIconButton>
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

        {isRestricted && !isRedirectingFromHiddenRoute ? (
          <RestrictedContainer>
            <RestrictedIconWrapper>
              <RestrictedIcon />
            </RestrictedIconWrapper>
            <RestrictedTitle variant="h5">Access Restricted</RestrictedTitle>
            <RestrictedBody variant="body1">
              You don't have the necessary permissions to view this module. Please contact your
              administrator to request access to this specific financial data.
            </RestrictedBody>
          </RestrictedContainer>
        ) : (
          <TabContentWrapper>{tabContent}</TabContentWrapper>
        )}
      </>
    );
  }, [
    activePage,
    showRemittanceDetail,
    handleBackToPayments,
    handlePrint,
    handleReload,
    handleExport,
    tabContent,
    isRestricted,
    isLoadingUserDetails,
    isRedirectingFromHiddenRoute,
  ]);

  return (
    <DashboardLayout>
      <PageWrapper>
        <Suspense fallback={<TabLoadingFallback />}>{mainContent}</Suspense>

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
