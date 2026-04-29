import React, { useMemo, useState, useEffect, useRef, useCallback } from 'react';
import {
  Typography,
  Box,
  CircularProgress,
  IconButton,
  Theme,
} from '@mui/material';
import { ChatBubbleOutline } from '@mui/icons-material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { useAppSelector } from '@/store';
import { useReconciliation, ReconciliationStatus, ReconciliationRow } from './ReconciliationScreen.hook';
import RowActionMenu from '@/components/molecules/RowActionMenu/RowActionMenu';
import { HighlightCell } from './ReconciliationScreen.styles';

// Sub Components
import AdvancedSearchDialog from './components/AdvancedSearchDialog';
import EftDetailsDialog from './components/EftDetailsDialog';
import SummaryStats from './components/SummaryStats';
import LocationTabs from './components/LocationTabs';
import PdfPreviewDialog from './components/PdfPreviewDialog';
import BaiDataDialog from './components/BaiDataDialog';
import SubmitConfirmDialog from './components/SubmitConfirmDialog';
import DataTable from '@/components/molecules/DataTable/DataTable';
import { DataColumn } from '@/components/molecules/DataTable/DataTable.hook';
import CommentsDialog from './components/CommentsDialog';
import EditDetailsDialog from './components/EditDialog';
import AssignUserDialog from './components/AssignUserDialog';
import RangeDropdown from '@/components/atoms/RangeDropdown/RangeDropdown';
import { InputAdornment, TextField } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const ReconciliationScreen: React.FC = () => {
  const { activeSubTab, actionTriggers } = useAppSelector(s => s.ui);

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

  const columns = useMemo<DataColumn<ReconciliationRow>[]>(() => {
    return headerData
      .filter(h => h.id !== 'actions' || view !== 'reconciled')
      .map((header) => ({
        id: header.id as keyof ReconciliationRow,
        label: header.label,
        align: header.align,
        filterOptions: view === 'reconciled'
          ? (header.id === 'complexStatus' ? header.filterOptions : undefined)
          : header.filterOptions,
        accessor: (row) => {
          const val = row[header.id as keyof ReconciliationRow];
          if (Array.isArray(val)) return val.join(', ');
          return (val as string | number) ?? '';
        },
        render: (row) => {
          const val = row[header.id as keyof ReconciliationRow];

          if (header.id === 'actions') {
            return (
              <RowActionMenu
                onEdit={() => {
                  setSelectedRow(row);
                  setSelectedTxNo(row.transactionNo);
                  setEditDialogOpen(true);
                }}
                extraActions={[
                  {
                    label: 'Assign User',
                    icon: <PersonAddIcon fontSize="small" />,
                    onClick: () => {
                      setSelectedRow(row);
                      setSelectedTxNo(row.transactionNo);
                      setAssignUserOpen(true);
                    }
                  },
                  {
                    label: 'Comment',
                    icon: <ChatBubbleOutline fontSize="small" />,
                    onClick: () => {
                      setCommentsRow(row);
                      setCommentsDialogOpen(true);
                    }
                  }
                ]}
              />
            );
          }

          if (header.isCurrency) {
            const content = (
              <Typography variant="body2" sx={{ fontWeight: 700, color: 'inherit' }}>
                {formatCurrency(Number(val))}
              </Typography>
            );
            return header.highlightOnZero && Number(val) === 0 ? <HighlightCell>{formatCurrency(Number(val))}</HighlightCell> : content;
          }

          if (header.id === 'reconcileDate') {
            return (
              <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                {formatDate(val as string)}
              </Typography>
            );
          }

          if (header.isLink) {
            return (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 700,
                    color: row.isEdited ? 'success.main' : 'primary.main',
                    cursor: 'pointer',
                    textDecoration: 'underline',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}
                  onClick={() => {
                    setSelectedRow(row);
                    setSelectedTxNo(String(val));
                    setEftDialogOpen(true);
                  }}
                >
                  {String(val ?? '-')}
                </Typography>
                {view === 'reconciled' && (
                  <IconButton
                    size="small"
                    sx={{
                      p: 0.2,
                      color: 'text.disabled',
                      '&:hover': { color: 'primary.main', bgcolor: 'grey.100' }
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCommentsRow(row);
                      setCommentsDialogOpen(true);
                    }}
                  >
                    <ChatBubbleOutline sx={{ fontSize: 16 }} />
                  </IconButton>
                )}
              </Box>
            );
          }

          return (val as string | number) ?? '-';
        }
      }));
  }, [headerData, view]);

  const handleSearchWrapper = useCallback((txNo: string) => {
    handleGlobalTransactionSearch(txNo);
  }, [handleGlobalTransactionSearch]);

  const handleSetTransactionNo = useCallback((val: string) => {
    setSearchFilters(prev => ({ ...prev, transactionNo: val }));
  }, [setSearchFilters]);

  return (
    <Box sx={{ p: 3, pt: 1 }}>
      <Box sx={{ mb: 4 }}>
        <LocationTabs
          view={view}
          locations={locations}
          activeLocation={activeLocation}
          setActiveLocation={setActiveLocation}
        />
        <SummaryStats stats={stats} />
        {/* <ReconciliationFilters
          view={view}
          dateMode={dateMode}
          setDateMode={setDateMode}
          searchFilters={searchFilters}
          setSearchFilters={setSearchFilters}
          applyFilters={applyFilters}
          setAdvancedSearchOpen={setAdvancedSearchOpen}
          activeAge={activeAge}
          setActiveAge={setActiveAge}
          ageRanges={ageRanges}
          daysInView={eachDayOfInterval({ start: startOfMonth(new Date()), end: endOfMonth(new Date()) })}
        /> */}
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 8 }}><CircularProgress /></Box>
      ) : (
        <DataTable
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
          getRowStyle={(row) => ({
            backgroundColor: row.isEdited ? 'grey.50' : 'transparent',
            color: row.isEdited ? 'primary.main' : 'inherit',
            fontWeight: row.isEdited ? 700 : 'inherit',
            transition: 'all 0.2s ease',
            '& td': {
              color: row.isEdited ? 'success.main' : 'inherit',
            },
            '&:hover': {
              background: (t: Theme) => row.isEdited ? t.palette.grey[100] + ' !important' : t.palette.grey[50] + ' !important'
            }
          })}
          customToolbarContent={(
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'nowrap' }}>
              {view !== 'reconciled' && (
                <>
                  <Box sx={{ flexShrink: 0 }}>
                    <RangeDropdown value={globalFilters.rangeLabel} onChange={handleRangeChange} />
                  </Box>

                  <TextField
                    size="small"
                    placeholder="Search Tx No"
                    value={searchFilters.transactionNo || ''}
                    onChange={(e) => handleSetTransactionNo(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearchWrapper(searchFilters.transactionNo || '')}
                    sx={{
                      width: '160px',
                      '& .MuiOutlinedInput-root': {
                        height: '32px',
                        borderRadius: '6px',
                        bgcolor: 'background.paper',
                        fontSize: '12px'
                      }
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon fontSize="small" sx={{ color: 'text.disabled' }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </>
              )}
            </Box>
          )}
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
      <BaiDataDialog
        open={baiDataOpen}
        onClose={() => setBaiDataOpen(false)}
        txNo={selectedTxNo}
      />
      <SubmitConfirmDialog
        open={submitConfirmOpen}
        onClose={() => setSubmitConfirmOpen(false)}
        onConfirm={() => { setSubmitConfirmOpen(false); alert('File uploaded successfully!'); }}
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
    </Box>
  );
};

export default ReconciliationScreen;
