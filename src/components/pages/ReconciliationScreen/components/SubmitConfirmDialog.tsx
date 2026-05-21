import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Typography, Button } from '@mui/material';

interface SubmitConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const SubmitConfirmDialog: React.FC<SubmitConfirmDialogProps> = ({ open, onClose, onConfirm }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle sx={{ fontWeight: 800 }}>Confirm Submission</DialogTitle>
      <DialogContent>
        <Typography variant="body2">Are you sure you want to submit this file? This action cannot be undone.</Typography>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} sx={{ textTransform: 'lowercase' }}>cancel</Button>
        <Button
          variant="contained"
          onClick={onConfirm}
          sx={{ textTransform: 'lowercase' }}
        >
          confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SubmitConfirmDialog;
