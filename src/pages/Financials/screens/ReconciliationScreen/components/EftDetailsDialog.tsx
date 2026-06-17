import React from 'react';
import { Dialog, Grid, Box, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import DeleteIcon from '@mui/icons-material/Delete';
import { GlassDialog, SectionSidebar, DynamicTableContainer } from '../ReconciliationScreen.styles';
import { ReconciliationRow, ReconciliationStatus } from '../ReconciliationScreen.hook';
import { formatDate } from '@/utils/formatters';
import * as styles from './EftDetailsDialog.styles';

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
          {headers.map((h, i) => (
            <th key={i}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.length > 0 ? (
          rows.map((row, ri) => (
            <tr key={ri}>
              {row.map((cell, ci) => (
                <td
                  key={ci}
                  style={
                    typeof cell === 'string' && cell.endsWith('.pdf')
                      ? {
                          color: '#1976d2', // standard primary.main color
                          textDecoration: 'underline',
                          cursor: 'pointer',
                          fontWeight: 700,
                        }
                      : {}
                  }
                  onClick={() =>
                    typeof cell === 'string' && cell.endsWith('.pdf') ? onCellClick?.(cell) : null
                  }
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
          ))
        ) : (
          <tr>
            <td colSpan={headers.length} style={{ textAlign: 'center', opacity: 0.5 }}>
              No Data Available
            </td>
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
  setPdfPreviewOpen,
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth PaperComponent={GlassDialog}>
      <styles.StyledDialogTitle>
        <styles.HeaderLeftBox>
          <styles.IconWrapper>
            <CalendarMonthIcon fontSize="small" />
          </styles.IconWrapper>
          <Box>
            <styles.HeaderTitleText variant="subtitle1">
              EFT Transaction Details
            </styles.HeaderTitleText>
            <styles.HeaderSubtitleText variant="caption">
              {selectedRow ? (
                <styles.SubtitleRow>
                  <span>{selectedRow.transactionNo}</span>
                  {selectedRow.reconcileDate && (
                    <styles.ReconcileSpan>
                      Reconcile Date: {formatDate(selectedRow.reconcileDate)}
                    </styles.ReconcileSpan>
                  )}
                </styles.SubtitleRow>
              ) : (
                'No Selection'
              )}
            </styles.HeaderSubtitleText>
          </Box>
        </styles.HeaderLeftBox>
        <styles.CloseButton onClick={onClose} size="small">
          <CloseIcon />
        </styles.CloseButton>
      </styles.StyledDialogTitle>
      <styles.StyledDivider />

      <styles.StyledDialogContent>
        {/* Actions Row - Reorganized */}
        <styles.ActionsRowGrid container spacing={{ xs: 2, md: 2 }}>
          {/* 1. TRANSACTION SEARCH */}
          <Grid size={{ xs: 12, md: 6 }}>
            <styles.SearchBoxWrapper>
              <styles.LabelText variant="caption">Scan/Search Transaction</styles.LabelText>
              <styles.ActionRow>
                <styles.SearchTextField
                  size="small"
                  fullWidth
                  value={selectedTxNo}
                  onChange={(e) => setSelectedTxNo(e.target.value)}
                  placeholder="Enter ID..."
                />
                <styles.StyledSearchButton variant="contained" disabled={!selectedTxNo}>
                  Search
                </styles.StyledSearchButton>
              </styles.ActionRow>
            </styles.SearchBoxWrapper>
          </Grid>

          {/* 2. UPLOAD ZONE */}
          <Grid size={{ xs: 12, md: 6 }}>
            <styles.SearchBoxWrapper>
              <styles.LabelText variant="caption">Documentation</styles.LabelText>
              <styles.ActionRow>
                <styles.UploadZoneWrapper as="label">
                  <styles.StyledCloudUploadIcon color="primary" />
                  <styles.UploadedFileNameTypography variant="caption" hasFile={!!uploadedFileName}>
                    {uploadedFileName || 'Choose PDF...'}
                  </styles.UploadedFileNameTypography>
                  <input
                    type="file"
                    hidden
                    accept=".pdf"
                    onChange={(e) => {
                      if (e.target.files?.[0]) setUploadedFileName(e.target.files[0].name);
                    }}
                  />
                </styles.UploadZoneWrapper>
                <styles.StyledSubmitButton
                  variant="contained"
                  disabled={!uploadedFileName}
                  onClick={() => setSubmitConfirmOpen(true)}
                  color="success"
                >
                  Submit
                </styles.StyledSubmitButton>
              </styles.ActionRow>
            </styles.SearchBoxWrapper>
          </Grid>
        </styles.ActionsRowGrid>

        {/* Reusable Sectioned Content */}
        <styles.SectionsContainer>
          {/* BAI SECTION */}
          <styles.SectionWrapper>
            <SectionSidebar bgColor="warning.light">
              <styles.SectionSidebarTitle variant="caption" darkColor="warning.dark">
                BAI
              </styles.SectionSidebarTitle>
            </SectionSidebar>
            <PopupTable
              headers={['File Received Date', 'Amount', 'Payor', 'Location', 'File Name']}
              rows={[
                [formatDate('06/05/2025'), '$292.88', 'SELF PAY', 'Ohio', '2025_SET5PROD.pdf'],
              ]}
              onCellClick={(val) =>
                val.endsWith('.pdf') ? setPdfPreviewOpen(true) : setBaiDataOpen(true)
              }
            />
          </styles.SectionWrapper>

          {/* REMIT SECTION */}
          <styles.SectionWrapper>
            <SectionSidebar bgColor="success.light">
              <styles.SectionSidebarTitle variant="caption" darkColor="success.dark">
                Remit
              </styles.SectionSidebarTitle>
            </SectionSidebar>
            <PopupTable
              headers={['File Received Date', 'Amount', 'Payor', 'File Name']}
              rows={[
                [
                  formatDate('06/28/2025'),
                  '$1,240.20',
                  'Blue Cross Blue Shield',
                  'REMIT_AUG_22.pdf',
                ],
              ]}
              onCellClick={(val) => (val.endsWith('.pdf') ? setPdfPreviewOpen(true) : null)}
            />
          </styles.SectionWrapper>

          {/* CASH POSTING SECTION */}
          <styles.SectionWrapper>
            <SectionSidebar bgColor="secondary.light">
              <styles.SectionSidebarTitle variant="caption" darkColor="secondary.dark">
                Cash Posting
              </styles.SectionSidebarTitle>
            </SectionSidebar>
            <PopupTable
              headers={['File Received Date', 'Amount', 'Batch Id', 'Batch Owner', 'File Name']}
              rows={[[formatDate('06/30/2025'), '$292.88', '778945', 'ICAN', 'POST_82775.pdf']]}
              onCellClick={(val) => (val.endsWith('.pdf') ? setPdfPreviewOpen(true) : null)}
            />
          </styles.SectionWrapper>
        </styles.SectionsContainer>

        {/* History of Uploaded Documentation */}
        <styles.HistoryContainer>
          <styles.HistoryTitle variant="subtitle2">
            <styles.StyledDescriptionIcon />
            Document Submission History
          </styles.HistoryTitle>
          <PopupTable
            headers={['File Name', 'Uploaded By', 'Action']}
            rows={[['payment-variance-analysis.pdf', 'ICAN_SYSTEM', 'Delete']]}
            onCellClick={(val) => (val.endsWith('.pdf') ? setPdfPreviewOpen(true) : null)}
            onDeleteClick={() => alert('Document deleted')}
          />
        </styles.HistoryContainer>
      </styles.StyledDialogContent>
    </Dialog>
  );
};

export default EftDetailsDialog;
