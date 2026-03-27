import React, { useCallback } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@mui/material';
import * as styles from './ConfirmDeleteDialog.styles';

interface ConfirmDeleteDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemType: string;
}

const ConfirmDeleteDialog: React.FC<ConfirmDeleteDialogProps> = ({ open, onClose, onConfirm, itemType }) => {
  const handleConfirm = useCallback(() => {
    onConfirm();
  }, [onConfirm]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={styles.dialogTitleStyles}>Confirm Delete</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to delete this {itemType}? This action cannot be undone.
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={styles.dialogActionsStyles}>
        <Button onClick={onClose} variant="outlined" size="small">Cancel</Button>
        <Button onClick={handleConfirm} variant="contained" color="error" size="small">Delete</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDeleteDialog;
