import React from 'react';
import { Dialog } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { GlassDialog } from '../ReconciliationScreen.styles';
import * as styles from './PdfPreviewDialog.styles';

interface PdfPreviewDialogProps {
  open: boolean;
  onClose: () => void;
  txNo: string;
}

const PdfPreviewDialog: React.FC<PdfPreviewDialogProps> = ({ open, onClose, txNo }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth PaperComponent={GlassDialog}>
      <styles.StyledDialogTitle>
        <styles.HeaderLeftContainer>
          <CloudUploadIcon fontSize="small" color="primary" />
          <styles.HeaderTitle variant="subtitle2">payment-variance-analysis.pdf</styles.HeaderTitle>
        </styles.HeaderLeftContainer>
        <styles.CloseIconButton size="small" onClick={onClose}>
          <CloseIcon />
        </styles.CloseIconButton>
      </styles.StyledDialogTitle>
      <styles.StyledDialogContent>
        <styles.ReceiptPaper>
          <styles.ReceiptHeader>
            <styles.ReceiptTitle variant="h6">TRANSACTION RECEIPT</styles.ReceiptTitle>
            <styles.ReceiptSubtitle variant="caption">
              Date: June 05, 2025 | Ref: {txNo}
            </styles.ReceiptSubtitle>
          </styles.ReceiptHeader>
          <styles.ReceiptBody>
            <styles.FlexRow>
              <div>
                <styles.LabelText variant="caption">Payor</styles.LabelText>
                <styles.ValueText variant="body1">Aetna Insurance</styles.ValueText>
              </div>
              <div>
                <styles.LabelText variant="caption">Amount</styles.LabelText>
                <styles.ValueText variant="body1">$292.88</styles.ValueText>
              </div>
            </styles.FlexRow>
            <styles.PlaceholderDoc />
          </styles.ReceiptBody>
        </styles.ReceiptPaper>
        <styles.FooterText variant="caption">End of PDF Document</styles.FooterText>
      </styles.StyledDialogContent>
    </Dialog>
  );
};

export default PdfPreviewDialog;
