import React from 'react';
import { Dialog, DialogTitle, DialogContent, Typography, Box, IconButton, Divider } from '@mui/material';
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
      <DialogTitle sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#334155', color: '#fff' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CloudUploadIcon sx={{ fontSize: 20, color: '#60a5fa' }} />
          <Typography variant="subtitle2" sx={{ fontWeight: 900 }}>payment-variance-analysis.pdf</Typography>
        </Box>
        <IconButton size="small" onClick={onClose} sx={{ color: '#fff' }}><CloseIcon /></IconButton>
      </DialogTitle>
      <DialogContent sx={{ minHeight: '600px', backgroundColor: '#1e293b', p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Box sx={{ width: '100%', maxWidth: '600px', flex: 1, backgroundColor: '#fff', borderRadius: '4px', p: 5, boxShadow: '0 20px 25px -5px rgba(0,0,0,0.2)' }}>
          <Box sx={{ borderBottom: '2px solid #e2e8f0', pb: 2, mb: 3 }}>
            <Typography variant="h6" sx={{ color: '#334155', fontWeight: 900 }}>TRANSACTION RECEIPT</Typography>
            <Typography variant="caption" sx={{ color: '#64748b' }}>Date: June 05, 2025 | Ref: {txNo}</Typography>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Box><Typography variant="caption" sx={{ color: '#94a3b8' }}>Payor</Typography><Typography variant="body1" sx={{ fontWeight: 700 }}>Aetna Insurance</Typography></Box>
              <Box><Typography variant="caption" sx={{ color: '#94a3b8' }}>Amount</Typography><Typography variant="body1" sx={{ fontWeight: 700 }}>$292.88</Typography></Box>
            </Box>
            <Box sx={{ height: '300px', width: '100%', background: 'linear-gradient(45deg, #f8fafc 25%, transparent 25%, transparent 75%, #f8fafc 75%, #f8fafc), linear-gradient(45deg, #f8fafc 25%, transparent 25%, transparent 75%, #f8fafc 75%, #f8fafc)', backgroundSize: '40px 40px', backgroundPosition: '0 0, 20px 20px', borderRadius: '4px', border: '1px solid #f1f5f9' }} />
          </Box>
        </Box>
        <Typography variant="caption" sx={{ mt: 2, color: '#94a3b8' }}>End of PDF Document</Typography>
      </DialogContent>
    </Dialog>
  );
};

export default PdfPreviewDialog;
