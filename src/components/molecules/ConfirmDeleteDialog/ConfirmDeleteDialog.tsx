import React, { useCallback } from 'react';
import { Dialog, DialogContent, DialogContentText, Button } from '@mui/material';
import * as styles from './ConfirmDeleteDialog.styles';

interface ConfirmDeleteDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemType: string;
}

const ConfirmDeleteDialog: React.FC<ConfirmDeleteDialogProps> = ({
  open,
  onClose,
  onConfirm,
  itemType,
}) => {
  const handleConfirm = useCallback(() => {
    onConfirm();
  }, [onConfirm]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <styles.StyledDialogTitle>Confirm Delete</styles.StyledDialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to delete this {itemType}? This action cannot be undone.
        </DialogContentText>
      </DialogContent>
      <styles.StyledDialogActions>
        <Button onClick={onClose} variant="outlined" size="small">
          Cancel
        </Button>
        <Button onClick={handleConfirm} variant="contained" color="error" size="small">
          Delete
        </Button>
      </styles.StyledDialogActions>
    </Dialog>
  );
};

export default ConfirmDeleteDialog;
