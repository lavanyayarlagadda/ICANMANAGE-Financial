import React from 'react';
import {
  Typography,
  Box,
  CircularProgress,
  IconButton,
} from '@mui/material';
import { ChatBubbleOutline } from '@mui/icons-material';
import EditIcon from '@mui/icons-material/Edit';
import { formatCurrency } from '@/utils/formatters';
import { useAppSelector, useAppDispatch } from '@/store';
import { useReconciliation, ReconciliationStatus } from './ReconciliationScreen.hook';
import { ReconciliationRow } from '@/interfaces/financials';
import { HighlightCell } from './ReconciliationScreen.styles';
import { startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { themeConfig } from '@/theme/themeConfig';

// Sub Components
import AdvancedSearchDialog from './components/AdvancedSearchDialog';
import EftDetailsDialog from './components/EftDetailsDialog';
import ReconciliationFilters from './components/ReconciliationFilters';
import SummaryStats from './components/SummaryStats';
import LocationTabs from './components/LocationTabs';
import PdfPreviewDialog from './components/PdfPreviewDialog';
import BaiDataDialog from './components/BaiDataDialog';
import SubmitConfirmDialog from './components/SubmitConfirmDialog';
// import CommentsDialog from './components/CommentsDialog';
import DataTable from '@/components/molecules/DataTable/DataTable';
import { DataColumn } from '@/components/molecules/DataTable/DataTable.hook';
import CommentsDialog from './components/CommentsDialog';

const ReconciliationScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const { activeSubTab, actionTriggers } = useAppSelector(s => s.ui);

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
    ageRanges,
    activeAge,
    setActiveAge,
    searchFilters,
    setSearchFilters,
    applyFilters,
    handleGlobalTransactionSearch,
  } = useReconciliation();

  const [advancedSearchOpen, setAdvancedSearchOpen] = React.useState(false);
  const [ageOpen, setAgeOpen] = React.useState(false);
  const [dateMode, setDateMode] = React.useState<'range' | 'day'>('range');

  // EFT & Drill-down State
  const [eftDialogOpen, setEftDialogOpen] = React.useState(false);
  const [selectedRow, setSelectedRow] = React.useState<ReconciliationRow | null>(null);
  const [selectedTxNo, setSelectedTxNo] = React.useState('');
  const [pdfPreviewOpen, setPdfPreviewOpen] = React.useState(false);
  const [submitConfirmOpen, setSubmitConfirmOpen] = React.useState(false);
  const [baiDataOpen, setBaiDataOpen] = React.useState(false);
  const [selectedAssignee, setSelectedAssignee] = React.useState('All');
  const [uploadedFileName, setUploadedFileName] = React.useState<string | null>(null);

  // Comments Dialog state
  const [commentsDialogOpen, setCommentsDialogOpen] = React.useState(false);
  const [commentsRow, setCommentsRow] = React.useState<ReconciliationRow | null>(null);

  // Sync internal view with global sub-tab
  React.useEffect(() => {
    const subTabMap: Record<number, ReconciliationStatus> = {
      0: 'unreconciled',
      1: 'reconciled',
      2: 'my-queue',
    };
    const targetView = subTabMap[activeSubTab] || 'unreconciled';
    handleToggle(targetView);
  }, [activeSubTab, handleToggle]);

  // Sync Global Action Triggers
  const reloadCount = React.useRef(actionTriggers.reload);
  const printCount = React.useRef(actionTriggers.print);
  const exportCount = React.useRef(actionTriggers.export);

  React.useEffect(() => {
    if (actionTriggers.reload > reloadCount.current) {
      applyFilters();
      reloadCount.current = actionTriggers.reload;
    }
  }, [actionTriggers.reload]);

  React.useEffect(() => {
    if (actionTriggers.print > printCount.current) {
      window.print();
      printCount.current = actionTriggers.print;
    }
  }, [actionTriggers.print]);

  React.useEffect(() => {
    if (actionTriggers.export > exportCount.current) {
      alert('Exporting Reconciliation Data to Excel...');
      exportCount.current = actionTriggers.export;
    }
  }, [actionTriggers.export]);

  // Days list for Day Wise mode
  const daysInView = React.useMemo(() => {
    try {
      const start = searchFilters.fromDate ? new Date(searchFilters.fromDate) : startOfMonth(new Date());
      const end = searchFilters.toDate ? new Date(searchFilters.toDate) : endOfMonth(new Date());
      if (start > end) return [start];
      return eachDayOfInterval({ start, end });
    } catch (e) {
      return eachDayOfInterval({ start: startOfMonth(new Date()), end: endOfMonth(new Date()) });
    }
  }, [searchFilters.fromDate, searchFilters.toDate]);

  const columns: DataColumn<ReconciliationRow>[] = headerData
    .filter(h => h.id !== 'actions' || view !== 'reconciled')
    .map((header) => ({
      id: header.id as any,
      label: header.label,
      align: header.align as 'left' | 'right' | 'center',
      accessor: (row) => {
        const val = row[header.id as keyof ReconciliationRow];
        if (Array.isArray(val)) return val.join(', ');
        return (val as string | number) ?? '';
      },
      render: (row) => {
        const val = row[header.id as keyof ReconciliationRow];

        if (header.id === 'actions') {
          return (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton
                size="small"
                color="info"
                sx={{ '&:hover': { backgroundColor: 'info.light' } }}
                onClick={() => {
                  setSelectedRow(row);
                  setSelectedTxNo(row.transactionNo);
                  setEftDialogOpen(true);
                }}
              >
                <EditIcon fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                sx={{ color: themeConfig.colors.primary }}
                onClick={() => {
                  setCommentsRow(row);
                  setCommentsDialogOpen(true);
                }}
              >
                <ChatBubbleOutline fontSize="small" />
              </IconButton>
            </Box>
          );
        }

        if (header.isCurrency) {
          const isHighlight = header.highlightOnZero && Number(val) === 0;
          const content = (
            <Typography
              variant="body2"
              sx={{
                fontWeight: 700,
                color: header.id === 'variance' ? (Number(val) < 0 ? 'error.main' : 'text.primary') : 'inherit'
              }}
            >
              {formatCurrency(Number(val))}
            </Typography>
          );
          return isHighlight ? <HighlightCell>{formatCurrency(Number(val))}</HighlightCell> : content;
        }

        if (header.isStatus) {
          return (
            <Box>
              {row.complexStatus.map((s: string, idx: number) => (
                <Typography
                  key={idx}
                  variant="caption"
                  display="block"
                  sx={{
                    color: s.toLowerCase().includes('age') || s.toLowerCase().includes('missing') ? 'error.main' : 'text.secondary',
                    fontWeight: 600,
                    borderBottom: idx < row.complexStatus.length - 1 ? `1px solid ${themeConfig.colors.slate[200]}` : 'none',
                    pb: 0.5,
                    mb: 0.5
                  }}
                >
                  {s}
                </Typography>
              ))}
            </Box>
          );
        }

        if (header.isLink) {
          return (
            <Typography
              variant="body2"
              sx={{ fontWeight: 700, color: row.isEdited ? themeConfig.colors.success : 'primary.main', cursor: 'pointer', textDecoration: 'underline' }}
              onClick={() => {
                setSelectedRow(row);
                setSelectedTxNo(String(val));
                setEftDialogOpen(true);
              }}
            >
              {String(val ?? '-')}
            </Typography>
          );
        }

        return (val as string | number) ?? '-';
      }
    }));

  return (
    <Box sx={{ p: 3, pt: 1 }}>
      <ReconciliationFilters
        view={view}
        dateMode={dateMode}
        setDateMode={setDateMode}
        searchFilters={searchFilters}
        setSearchFilters={setSearchFilters}
        applyFilters={applyFilters}
        setAdvancedSearchOpen={setAdvancedSearchOpen}
        daysInView={daysInView}
      />

      <Box sx={{ mb: 4 }}>
        <LocationTabs
          view={view}
          locations={locations}
          activeLocation={activeLocation}
          setActiveLocation={setActiveLocation}
          ageOpen={ageOpen}
          setAgeOpen={setAgeOpen}
          ageRanges={ageRanges}
          activeAge={activeAge}
          setActiveAge={setActiveAge}
          transactionNo={searchFilters.transactionNo || ''}
          setTransactionNo={(val) => setSearchFilters({ ...searchFilters, transactionNo: val })}
          handleSearch={handleGlobalTransactionSearch}
        />
        <SummaryStats stats={stats} />
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
          getRowStyle={(row) => ({
            backgroundColor: row.isEdited ? themeConfig.colors.slate[50] : 'transparent',
            color: row.isEdited ? themeConfig.colors.primary : 'inherit',
            fontWeight: row.isEdited ? 700 : 'inherit',
            transition: 'all 0.2s ease',
            '& td': {
              color: row.isEdited ? themeConfig.colors.success : 'inherit',
              // borderColor: row.isEdited ? themeConfig.colors.primary + '33' : 'inherit', // 20% opacity border
            },
            '&:hover': {
              background: row.isEdited ? themeConfig.colors.slate[100] + ' !important' : themeConfig.colors.slate[50] + ' !important'
            }
          })}
        />
      )}

      {/* Drill-down Dialogs */}
      <AdvancedSearchDialog
        open={advancedSearchOpen}
        onClose={() => setAdvancedSearchOpen(false)}
        view={view}
        searchFilters={searchFilters}
        setSearchFilters={setSearchFilters}
        onSearch={handleGlobalTransactionSearch}
      />

      <EftDetailsDialog
        open={eftDialogOpen}
        onClose={() => setEftDialogOpen(false)}
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

      <CommentsDialog
        open={commentsDialogOpen}
        onClose={() => setCommentsDialogOpen(false)}
        row={commentsRow}
      />
    </Box>
  );
};

export default ReconciliationScreen;
