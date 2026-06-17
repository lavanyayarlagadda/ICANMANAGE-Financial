import React from 'react';
import { Dialog, DialogContent, Typography } from '@mui/material';
import * as styles from './SubmitConfirmDialog.styles';

interface SubmitConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const SubmitConfirmDialog: React.FC<SubmitConfirmDialogProps> = ({ open, onClose, onConfirm }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <styles.StyledDialogTitle>Confirm Submission</styles.StyledDialogTitle>
      <DialogContent>
        <Typography variant="body2">
          Are you sure you want to submit this file? This action cannot be undone.
        </Typography>
      </DialogContent>
      <styles.StyledDialogActions>
        <styles.LowercaseButton onClick={onClose}>cancel</styles.LowercaseButton>
        <styles.LowercaseButton variant="contained" onClick={onConfirm}>
          confirm
        </styles.LowercaseButton>
      </styles.StyledDialogActions>
    </Dialog>
  );
};

export default SubmitConfirmDialog;
