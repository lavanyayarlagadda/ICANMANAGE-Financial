import React from 'react';
import { Dialog, DialogTitle, DialogContent, Typography, Box, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { GlassDialog } from '../ReconciliationScreen.styles';

interface PdfPreviewDialogProps {
  open: boolean;
  onClose: () => void;
  txNo: string;
}

const PdfPreviewDialog: React.FC<PdfPreviewDialogProps> = ({ open, onClose, txNo }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperComponent={GlassDialog}
    >
      <DialogTitle sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: 'grey.800', color: 'common.white' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CloudUploadIcon sx={{ fontSize: 20, color: 'primary.light' }} />
          <Typography variant="subtitle2" sx={{ fontWeight: 900 }}>payment-variance-analysis.pdf</Typography>
        </Box>
        <IconButton size="small" onClick={onClose} sx={{ color: 'common.white' }}><CloseIcon /></IconButton>
      </DialogTitle>
      <DialogContent sx={{ minHeight: '600px', bgcolor: 'grey.900', p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Box sx={{ width: '100%', maxWidth: '600px', flex: 1, bgcolor: 'background.paper', borderRadius: 1, p: 5, boxShadow: (t) => t.shadows[10] }}>
          <Box sx={{ borderBottom: (t) => `2px solid ${t.palette.divider}`, pb: 2, mb: 3 }}>
            <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 900 }}>TRANSACTION RECEIPT</Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>Date: June 05, 2025 | Ref: {txNo}</Typography>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Box><Typography variant="caption" sx={{ color: 'text.disabled' }}>Payor</Typography><Typography variant="body1" sx={{ fontWeight: 700 }}>Aetna Insurance</Typography></Box>
              <Box><Typography variant="caption" sx={{ color: 'text.disabled' }}>Amount</Typography><Typography variant="body1" sx={{ fontWeight: 700 }}>$292.88</Typography></Box>
            </Box>
            <Box sx={{ 
              height: '300px', 
              width: '100%', 
              background: (t) => `linear-gradient(45deg, ${t.palette.grey[50]} 25%, transparent 25%, transparent 75%, ${t.palette.grey[50]} 75%, ${t.palette.grey[50]}), linear-gradient(45deg, ${t.palette.grey[50]} 25%, transparent 25%, transparent 75%, ${t.palette.grey[50]} 75%, ${t.palette.grey[50]})`,
              backgroundSize: '40px 40px', 
              backgroundPosition: '0 0, 20px 20px', 
              borderRadius: 1, 
              border: (t) => `1px solid ${t.palette.divider}` 
            }} />
          </Box>
        </Box>
        <Typography variant="caption" sx={{ mt: 2, color: 'text.disabled' }}>End of PDF Document</Typography>
      </DialogContent>
    </Dialog>
  );
};

export default PdfPreviewDialog;
