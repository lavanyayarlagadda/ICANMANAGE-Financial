import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Divider,
  Grid,
  Box,
  Typography,
  IconButton,
  TextField,
  Button,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import DescriptionIcon from '@mui/icons-material/Description';
import { GlassDialog, SectionSidebar, ModernUploadZone, DynamicTableContainer } from '../ReconciliationScreen.styles';
import { ReconciliationRow, ReconciliationStatus } from '../ReconciliationScreen.hook';
import { formatDate } from '@/utils/formatters';

interface EftDetailsDialogProps {
  view?: ReconciliationStatus;
  open: boolean;
  onClose: () => void;
  selectedRow: ReconciliationRow | null;
  selectedTxNo: string;
  setSelectedTxNo: (val: string) => void;
  uploadedFileName: string | null;
  setUploadedFileName: (val: string) => void;
  setSubmitConfirmOpen: (val: boolean) => void;
  setBaiDataOpen: (val: boolean) => void;
  setPdfPreviewOpen: (val: boolean) => void;
}

const PopupTable: React.FC<{
  headers: string[];
  rows: (string | number)[][];
  onCellClick?: (val: string) => void;
  onDeleteClick?: (ri: number) => void;
}> = ({ headers, rows, onCellClick, onDeleteClick }) => (
  <DynamicTableContainer>
    <table>
      <thead>
        <tr>
          {headers.map((h, i) => <th key={i}>{h}</th>)}
        </tr>
      </thead>
      <tbody>
        {rows.length > 0 ? rows.map((row, ri) => (
          <tr key={ri}>
            {row.map((cell, ci) => (
              <td
                key={ci}
                style={typeof cell === 'string' && cell.endsWith('.pdf') ? { color: 'primary.main', textDecoration: 'underline', cursor: 'pointer', fontWeight: 700 } : {}}
                onClick={() => typeof cell === 'string' && cell.endsWith('.pdf') ? onCellClick?.(cell) : null}
              >
                {cell === 'Delete' ? (
                  <IconButton size="small" color="error" onClick={() => onDeleteClick?.(ri)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                ) : (
                  cell
                )}
              </td>
            ))}
          </tr>
        )) : (
          <tr>
            <td colSpan={headers.length} style={{ textAlign: 'center', opacity: 0.5 }}>No Data Available</td>
          </tr>
        )}
      </tbody>
    </table>
  </DynamicTableContainer>
);

const EftDetailsDialog: React.FC<EftDetailsDialogProps> = ({
  open,
  onClose,
  selectedRow,
  selectedTxNo,
  setSelectedTxNo,
  uploadedFileName,
  setUploadedFileName,
  setSubmitConfirmOpen,
  setBaiDataOpen,
  setPdfPreviewOpen
}) => {

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperComponent={GlassDialog}
    >
      <DialogTitle sx={{ p: { xs: 2, sm: 2.5 }, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', bgcolor: 'grey.50' }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, flex: 1, mt: 0.5 }}>
          <Box sx={{ p: 1, borderRadius: '10px', bgcolor: 'primary.main', color: 'common.white', display: 'flex' }}>
            <CalendarMonthIcon fontSize="small" />
          </Box>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 900, color: 'text.primary', lineHeight: 1.2 }}>EFT Transaction Details</Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, display: 'block', mt: 0.5 }}>
              {selectedRow ? (
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: { xs: 0.5, sm: 2 } }}>
                  <span>{selectedRow.transactionNo}</span>
                  {selectedRow.reconcileDate && (
                    <Box component="span" sx={{ color: 'success.main', fontWeight: 800 }}>
                      Reconcile Date: {formatDate(selectedRow.reconcileDate)}
                    </Box>
                  )}
                </Box>
              ) : 'No Selection'}
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={onClose} sx={{ bgcolor: 'background.paper', boxShadow: (t) => t.shadows[1], flexShrink: 0 }} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <Divider sx={{ opacity: 0.5 }} />

      <DialogContent sx={{ p: { xs: 2, sm: 3 }, bgcolor: 'background.default' }}>
        {/* Actions Row - Reorganized */}
        <Grid container spacing={{ xs: 2, md: 2 }} sx={{ mb: 4, alignItems: 'stretch' }}>
          {/* 1. TRANSACTION SEARCH */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={{ height: '100%', p: 2, borderRadius: '12px', bgcolor: 'grey.50', border: (t) => `1px solid ${t.palette.divider}` }}>
              <Typography variant="caption" sx={{ fontWeight: 800, mb: 1, display: 'block', color: 'text.secondary', textTransform: 'uppercase' }}>Scan/Search Transaction</Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  size="small"
                  fullWidth
                  value={selectedTxNo}
                  onChange={(e) => setSelectedTxNo(e.target.value)}
                  placeholder="Enter ID..."
                  InputProps={{ sx: { borderRadius: '8px', bgcolor: 'background.paper', fontWeight: 700 } }}
                />
                <Button variant="contained" sx={{ borderRadius: '8px', px: 2, textTransform: 'none', fontWeight: 800, boxShadow: 'none' }}>Search</Button>
              </Box>
            </Box>
          </Grid>

          {/* 2. UPLOAD ZONE */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={{ height: '100%', p: 2, borderRadius: '12px', bgcolor: 'grey.50', border: (t) => `1px solid ${t.palette.divider}`, display: 'flex', flexDirection: 'column' }}>
              <Typography variant="caption" sx={{ fontWeight: 800, mb: 1, display: 'block', color: 'text.secondary', textTransform: 'uppercase' }}>Documentation</Typography>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', height: '100%' }}>
                <ModernUploadZone as="label" sx={{ flex: 1, height: '40px', py: 0, px: 1.5, borderStyle: 'solid', borderWidth: '1px' }}>
                  <CloudUploadIcon color="primary" sx={{ fontSize: 20 }} />
                  <Typography variant="caption" sx={{ fontWeight: 700, color: uploadedFileName ? 'success.main' : 'text.secondary', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {uploadedFileName || 'Choose PDF...'}
                  </Typography>
                  <input
                    type="file"
                    hidden
                    accept=".pdf"
                    onChange={(e) => {
                      if (e.target.files?.[0]) setUploadedFileName(e.target.files[0].name);
                    }}
                  />
                </ModernUploadZone>
                <Button
                  variant="contained"
                  disabled={!uploadedFileName}
                  onClick={() => setSubmitConfirmOpen(true)}
                  color="success"
                  sx={{ borderRadius: '8px', height: '40px', textTransform: 'none', fontWeight: 800, px: 2 }}
                >
                  Submit
                </Button>
              </Box>
            </Box>
          </Grid>

        </Grid>

        {/* Reusable Sectioned Content */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* BAI SECTION */}
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, borderRadius: '16px', overflow: 'hidden', border: (t) => `1px solid ${t.palette.divider}`, boxShadow: (t) => t.shadows[1] }}>
            <SectionSidebar bgColor="warning.light">
              <Typography variant="caption" sx={{ fontWeight: 900, color: 'warning.dark', textTransform: 'uppercase', letterSpacing: '0.1em' }}>BAI</Typography>
            </SectionSidebar>
            <PopupTable
              headers={['File Received Date', 'Amount', 'Payor', 'Location', 'File Name']}
              rows={[[formatDate('06/05/2025'), '$292.88', 'SELF PAY', 'Ohio', '2025_SET5PROD.pdf']]}
              onCellClick={(val) => val.endsWith('.pdf') ? setPdfPreviewOpen(true) : setBaiDataOpen(true)}
            />
          </Box>

          {/* REMIT SECTION */}
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, borderRadius: '16px', overflow: 'hidden', border: (t) => `1px solid ${t.palette.divider}`, boxShadow: (t) => t.shadows[1] }}>
            <SectionSidebar bgColor="success.light">
              <Typography variant="caption" sx={{ fontWeight: 900, color: 'success.dark', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Remit</Typography>
            </SectionSidebar>
            <PopupTable
              headers={['File Received Date', 'Amount', 'Payor', 'File Name']}
              rows={[[formatDate('06/28/2025'), '$1,240.20', 'Blue Cross Blue Shield', 'REMIT_AUG_22.pdf']]}
              onCellClick={(val) => val.endsWith('.pdf') ? setPdfPreviewOpen(true) : null}
            />
          </Box>

          {/* CASH POSTING SECTION */}
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, borderRadius: '16px', overflow: 'hidden', border: (t) => `1px solid ${t.palette.divider}`, boxShadow: (t) => t.shadows[1] }}>
            <SectionSidebar bgColor="secondary.light">
              <Typography variant="caption" sx={{ fontWeight: 900, color: 'secondary.dark', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Cash Posting</Typography>
            </SectionSidebar>
            <PopupTable
              headers={['File Received Date', 'Amount', 'Batch Id', 'Batch Owner', 'File Name']}
              rows={[[formatDate('06/30/2025'), '$292.88', '778945', 'ICAN', 'POST_82775.pdf']]}
              onCellClick={(val) => val.endsWith('.pdf') ? setPdfPreviewOpen(true) : null}
            />
          </Box>
        </Box>

        {/* History of Uploaded Documentation */}
        <Box sx={{ mt: 5 }}>
          <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 900, color: 'text.primary', display: 'flex', alignItems: 'center', gap: 1 }}>
            <DescriptionIcon sx={{ fontSize: 18, color: 'primary.main' }} />
            Document Submission History
          </Typography>
          <PopupTable
            headers={['File Name', 'Uploaded By', 'Action']}
            rows={[['payment-variance-analysis.pdf', 'ICAN_SYSTEM', 'Delete']]}
            onCellClick={(val) => val.endsWith('.pdf') ? setPdfPreviewOpen(true) : null}
            onDeleteClick={() => alert('Document deleted')}
          />
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default EftDetailsDialog;