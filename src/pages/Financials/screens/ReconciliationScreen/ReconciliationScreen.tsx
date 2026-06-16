import React, { useState, useEffect, useRef, useCallback } from 'react';
import { CircularProgress, InputAdornment } from '@mui/material';
import { useAppSelector } from '@/store';
import {
  useReconciliation,
  ReconciliationStatus,
  ReconciliationRow,
} from './ReconciliationScreen.hook';
import { useReconciliationColumns } from './ReconciliationScreen.columns';

// Sub Components
import AdvancedSearchDialog from './components/AdvancedSearchDialog';
import EftDetailsDialog from './components/EftDetailsDialog';
import SummaryStats from './components/SummaryStats';
import LocationTabs from './components/LocationTabs';
import PdfPreviewDialog from './components/PdfPreviewDialog';
import BaiDataDialog from './components/BaiDataDialog';
import SubmitConfirmDialog from './components/SubmitConfirmDialog';
import DataTable from '@/components/molecules/DataTable/DataTable';
import CommentsDialog from './components/CommentsDialog';
import EditDetailsDialog from './components/EditDialog';
import AssignUserDialog from './components/AssignUserDialog';
import RangeDropdown from '@/components/atoms/RangeDropdown/RangeDropdown';
import SearchIcon from '@mui/icons-material/Search';
import {
  ScreenWrapper,
  TabsStatsContainer,
  CenteredLoadingBox,
  ToolbarContainer,
  RangeWrapper,
  SearchField,
  searchIconStyles,
  getRowStyle,
} from './ReconciliationScreen.styles';

const ReconciliationScreen: React.FC = () => {
  const { activeSubTab, actionTriggers } = useAppSelector((s) => s.ui);

  const reconciliation = useReconciliation();
  const {
    view,
    loading,
    headerData,
    filteredData,
    stats,
    handleToggle,
    locations,
    activeLocation,
    setActiveLocation,
    searchFilters,
    setSearchFilters,
    applyFilters,
    handleGlobalTransactionSearch,
    handleRangeChange,
    setActiveAge,
    globalFilters,
  } = reconciliation;

  // UI State
  const [eftDialogOpen, setEftDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<ReconciliationRow | null>(null);
  const [selectedTxNo, setSelectedTxNo] = useState('');
  const [pdfPreviewOpen, setPdfPreviewOpen] = useState(false);
  const [submitConfirmOpen, setSubmitConfirmOpen] = useState(false);
  const [baiDataOpen, setBaiDataOpen] = useState(false);
  const [assignUserOpen, setAssignUserOpen] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [advancedSearchOpen, setAdvancedSearchOpen] = useState(false);

  // Comments Dialog state
  const [commentsDialogOpen, setCommentsDialogOpen] = useState(false);
  const [commentsRow, setCommentsRow] = useState<ReconciliationRow | null>(null);

  // Sync internal view with global sub-tab
  useEffect(() => {
    const subTabMap: Record<number, ReconciliationStatus> = {
      0: 'unreconciled',
      1: 'reconciled',
      2: 'my-queue',
    };
    const targetView = subTabMap[activeSubTab] || 'unreconciled';
    if (view !== targetView) {
      handleToggle(targetView);
    }
  }, [activeSubTab, handleToggle, view]);

  // Sync Global Action Triggers
  const reloadCount = useRef(actionTriggers.reload);
  const printCount = useRef(actionTriggers.print);
  const exportCount = useRef(actionTriggers.export);

  useEffect(() => {
    if (actionTriggers.reload > reloadCount.current) {
      applyFilters();
      reloadCount.current = actionTriggers.reload;
    }
  }, [actionTriggers.reload, applyFilters]);

  useEffect(() => {
    if (actionTriggers.print > printCount.current) {
      window.print();
      printCount.current = actionTriggers.print;
    }
  }, [actionTriggers.print]);

  useEffect(() => {
    if (actionTriggers.export > exportCount.current) {
      alert('Exporting Reconciliation Data to Excel...');
      exportCount.current = actionTriggers.export;
    }
  }, [actionTriggers.export]);

  const columns = useReconciliationColumns({
    headerData,
    view,
    setSelectedRow,
    setSelectedTxNo,
    setEditDialogOpen,
    setAssignUserOpen,
    setCommentsRow,
    setCommentsDialogOpen,
    setEftDialogOpen,
  });

  const handleSearchWrapper = useCallback(
    (txNo: string) => {
      handleGlobalTransactionSearch(txNo);
    },
    [handleGlobalTransactionSearch],
  );

  const handleSetTransactionNo = useCallback(
    (val: string) => {
      setSearchFilters((prev) => ({ ...prev, transactionNo: val }));
    },
    [setSearchFilters],
  );

  return (
    <ScreenWrapper>
      <TabsStatsContainer>
        <LocationTabs
          view={view}
          locations={locations}
          activeLocation={activeLocation}
          setActiveLocation={setActiveLocation}
        />
        <SummaryStats stats={stats} />
      </TabsStatsContainer>

      {loading ? (
        <CenteredLoadingBox>
          <CircularProgress />
        </CenteredLoadingBox>
      ) : (
        <DataTable
          gridName={
            view === 'unreconciled'
              ? 'Unreconciled'
              : view === 'reconciled'
                ? 'Reconciled'
                : 'My Queue'
          }
          columns={columns}
          data={filteredData}
          rowKey={(row) => row.id}
          paginated={true}
          exportTitle={`Reconciliation_${view}`}
          rowsPerPage={10}
          dictionaryId="reconciliation"
          searchable={false}
          download={false}
          dense={true}
          onFilterChange={(filters) => {
            if (view === 'reconciled') {
              setActiveAge(filters.complexStatus || null);
            }
          }}
          getRowStyle={(row) => getRowStyle(row)}
          customToolbarContent={
            <ToolbarContainer>
              {view !== 'reconciled' && (
                <>
                  <RangeWrapper>
                    <RangeDropdown value={globalFilters.rangeLabel} onChange={handleRangeChange} />
                  </RangeWrapper>

                  <SearchField
                    size="small"
                    placeholder="Search Tx No"
                    value={searchFilters.transactionNo || ''}
                    onChange={(e) => handleSetTransactionNo(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === 'Enter' && handleSearchWrapper(searchFilters.transactionNo || '')
                    }
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon fontSize="small" sx={searchIconStyles} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </>
              )}
            </ToolbarContainer>
          }
        />
      )}

      <EftDetailsDialog
        view={view}
        open={eftDialogOpen}
        onClose={() => setEftDialogOpen(false)}
        selectedRow={selectedRow}
        selectedTxNo={selectedTxNo}
        setSelectedTxNo={setSelectedTxNo}
        uploadedFileName={uploadedFileName}
        setUploadedFileName={setUploadedFileName}
        setSubmitConfirmOpen={setSubmitConfirmOpen}
        setBaiDataOpen={setBaiDataOpen}
        setPdfPreviewOpen={setPdfPreviewOpen}
      />
      <EditDetailsDialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        selectedRow={selectedRow}
      />
      <PdfPreviewDialog
        open={pdfPreviewOpen}
        onClose={() => setPdfPreviewOpen(false)}
        txNo={selectedTxNo}
      />
      <BaiDataDialog open={baiDataOpen} onClose={() => setBaiDataOpen(false)} txNo={selectedTxNo} />
      <SubmitConfirmDialog
        open={submitConfirmOpen}
        onClose={() => setSubmitConfirmOpen(false)}
        onConfirm={() => {
          setSubmitConfirmOpen(false);
          alert('File uploaded successfully!');
        }}
      />
      <AdvancedSearchDialog
        open={advancedSearchOpen}
        onClose={() => setAdvancedSearchOpen(false)}
        view={view}
        searchFilters={searchFilters}
        setSearchFilters={setSearchFilters}
        onSearch={handleSearchWrapper}
      />
      <CommentsDialog
        open={commentsDialogOpen}
        onClose={() => setCommentsDialogOpen(false)}
        row={commentsRow}
      />
      <AssignUserDialog
        open={assignUserOpen}
        onClose={() => setAssignUserOpen(false)}
        txNo={selectedTxNo}
        onAssign={(user) => {
          alert(`Transaction ${selectedTxNo} assigned to ${user}`);
        }}
      />
    </ScreenWrapper>
  );
};

export default ReconciliationScreen;
