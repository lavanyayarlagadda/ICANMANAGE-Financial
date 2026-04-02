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
  MenuItem,
  Button,
  Chip
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { GlassDialog, SectionSidebar, ModernUploadZone, DynamicTableContainer } from '../ReconciliationScreen.styles';
import { ReconciliationRow } from '../ReconciliationScreen.hook';

interface EftDetailsDialogProps {
  open: boolean;
  onClose: () => void;
  selectedRow: ReconciliationRow | null;
  selectedTxNo: string;
  setSelectedTxNo: (val: string) => void;
  uploadedFileName: string | null;
  setUploadedFileName: (val: string) => void;
  selectedAssignee: string;
  setSelectedAssignee: (val: string) => void;
  setSubmitConfirmOpen: (val: boolean) => void;
  setBaiDataOpen: (val: boolean) => void;
  setPdfPreviewOpen: (val: boolean) => void;
}

const PopupTable: React.FC<{
  headers: string[];
  rows: any[][];
  onCellClick?: (val: any) => void;
}> = ({ headers, rows, onCellClick }) => (
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
                style={typeof cell === 'string' && cell.endsWith('.pdf') ? { color: '#3b82f6', textDecoration: 'underline', cursor: 'pointer', fontWeight: 700 } : {}}
                onClick={() => typeof cell === 'string' && cell.endsWith('.pdf') ? onCellClick?.(cell) : null}
              >
                {cell}
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
  selectedAssignee,
  setSelectedAssignee,
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
      <DialogTitle sx={{ p: 2.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'linear-gradient(to right, #f8fafc, #fff)' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{ p: 1, borderRadius: '10px', background: 'linear-gradient(135deg, #3b82f6, #2563eb)', color: '#fff', display: 'flex' }}>
            <CalendarMonthIcon fontSize="small" />
          </Box>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 900, color: '#1e293b', lineHeight: 1.2 }}>EFT Transaction Details</Typography>
            <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>
              {selectedRow ? (
                <>
                  {selectedRow.transactionNo}
                  {selectedRow.reconcileDate && (
                    <Box component="span" sx={{ ml: 2, color: 'success.main', fontWeight: 800 }}>
                      Reconcile Date: {selectedRow.reconcileDate}
                    </Box>
                  )}
                </>
              ) : 'No Selection'}
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={onClose} sx={{ backgroundColor: '#fff', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <Divider sx={{ opacity: 0.5 }} />

      <DialogContent sx={{ p: 3, backgroundColor: '#fdfdfd' }}>
        {/* Actions Row - Balanced 3-column Layout */}
        <Grid container spacing={4} sx={{ mb: 4, alignItems: 'stretch' }}>
          {/* 1. TRANSACTION SEARCH */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Box sx={{ height: '100%', p: 2, borderRadius: '12px', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
              <Typography variant="caption" sx={{ fontWeight: 800, mb: 1, display: 'block', color: '#64748b', textTransform: 'uppercase' }}>Scan/Search Transaction</Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  size="small"
                  fullWidth
                  value={selectedTxNo}
                  onChange={(e) => setSelectedTxNo(e.target.value)}
                  placeholder="Enter ID..."
                  InputProps={{ sx: { borderRadius: '8px', backgroundColor: '#fff', fontWeight: 700 } }}
                />
                <Button variant="contained" sx={{ borderRadius: '8px', px: 2, textTransform: 'none', fontWeight: 800, boxShadow: 'none' }}>Search</Button>
              </Box>
            </Box>
          </Grid>

          {/* 2. UPLOAD ZONE */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Box sx={{ height: '100%', p: 2, borderRadius: '12px', background: '#f8fafc', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column' }}>
              <Typography variant="caption" sx={{ fontWeight: 800, mb: 1, display: 'block', color: '#64748b', textTransform: 'uppercase' }}>Documentation</Typography>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', height: '100%' }}>
                <ModernUploadZone as="label" sx={{ flex: 1, height: '40px', py: 0, px: 1.5, borderStyle: 'solid', borderWidth: '1px' }}>
                  <CloudUploadIcon color="primary" sx={{ fontSize: 20 }} />
                  <Typography variant="caption" sx={{ fontWeight: 700, color: uploadedFileName ? '#10b981' : '#475569', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
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
                  sx={{ borderRadius: '8px', height: '40px', textTransform: 'none', fontWeight: 800, backgroundColor: '#10b981', px: 2, '&:hover': { backgroundColor: '#059669' } }}
                >
                  Submit
                </Button>
              </Box>
            </Box>
          </Grid>

          {/* 3. ASSIGNMENT */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Box sx={{ height: '100%', p: 2, borderRadius: '12px', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
              <Typography variant="caption" sx={{ fontWeight: 800, mb: 1, display: 'block', color: '#64748b', textTransform: 'uppercase' }}>Staff Assignment</Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  select
                  size="small"
                  fullWidth
                  value={selectedAssignee}
                  onChange={(e) => setSelectedAssignee(e.target.value)}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px', backgroundColor: '#fff' } }}
                >
                  <MenuItem value="All">Select User</MenuItem>
                  <MenuItem value="Naga">Naga Kiran</MenuItem>
                  <MenuItem value="Lavanya">Lavanya S</MenuItem>
                </TextField>
                <Button
                  variant="contained"
                  disabled={selectedAssignee === 'All'}
                  onClick={() => alert(`Transaction ${selectedTxNo} assigned to ${selectedAssignee}`)}
                  color="primary"
                  sx={{ textTransform: 'none', borderRadius: '8px', fontWeight: 800, px: 3, boxShadow: 'none' }}
                >
                  Assign
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>

        {/* Reusable Sectioned Content */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* BAI SECTION */}
          <Box sx={{ display: 'flex', borderRadius: '16px', overflow: 'hidden', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
            <SectionSidebar bgColor="#fef3c7">
              <Typography variant="caption" sx={{ fontWeight: 900, color: '#92400e', textTransform: 'uppercase', letterSpacing: '0.1em' }}>BAI</Typography>
            </SectionSidebar>
            <PopupTable
              headers={['File Received Date', 'Assigned User', 'Amount', 'Payor', 'Location', 'File Name']}
              rows={[['06/05/2025', 'Naga Kiran', '$292.88', 'SELF PAY', 'Ohio', '2025_SET5PROD.pdf']]}
              onCellClick={() => setBaiDataOpen(true)}
            />
          </Box>

          {/* REMIT SECTION */}
          <Box sx={{ display: 'flex', borderRadius: '16px', overflow: 'hidden', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
            <SectionSidebar bgColor="#dcfce7">
              <Typography variant="caption" sx={{ fontWeight: 900, color: '#166534', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Remit</Typography>
            </SectionSidebar>
            <PopupTable
              headers={['File Received Date', 'Assigned User', 'Amount', 'Payor', 'File Name']}
              rows={[['06/28/2025', 'Lavanya S', '$1,240.20', 'Blue Cross Blue Shield', 'REMIT_AUG_22.pdf']]}
              onCellClick={() => setPdfPreviewOpen(true)}
            />
          </Box>

          {/* CASH POSTING SECTION */}
          <Box sx={{ display: 'flex', borderRadius: '16px', overflow: 'hidden', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
            <SectionSidebar bgColor="#f3e8ff">
              <Typography variant="caption" sx={{ fontWeight: 900, color: '#6b21a8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Cash Posting</Typography>
            </SectionSidebar>
            <PopupTable
              headers={['File Received Date', 'Assigned User', 'Amount', 'Batch Id', 'Batch Owner', 'File Name']}
              rows={[['06/30/2025', 'Lavanya S', '$292.88', '778945', 'ICAN', 'POST_82775.pdf']]}
            />
          </Box>
        </Box>

        {/* History of Uploaded Documentation */}
        <Box sx={{ mt: 5 }}>
          <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 900, color: '#1e293b', display: 'flex', alignItems: 'center', gap: 1 }}>
            <CheckCircleOutlineIcon sx={{ fontSize: 18, color: '#10b981' }} />
            Document Submission History
          </Typography>
          <PopupTable
            headers={['File Name', 'Uploaded By', 'Action']}
            rows={[['payment-variance-analysis.pdf', 'ICAN_SYSTEM', 'View File']]}
            onCellClick={() => setPdfPreviewOpen(true)}
          />
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default EftDetailsDialog;
