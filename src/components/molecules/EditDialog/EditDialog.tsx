import React, { useCallback, useMemo } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Divider,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import * as styles from './EditDialog.styles';

interface EditDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
  title: string;
  data: Record<string, unknown> | null;
}

const EditDialog: React.FC<EditDialogProps> = ({ open, onClose, onSave, title, data }) => {
  const editableEntries = useMemo(() => {
    if (!data) return [];
    return Object.entries(data).filter(([key]) => key !== 'id');
  }, [data]);

  const handleSave = useCallback(() => {
    onSave();
  }, [onSave]);

  if (!data) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={styles.dialogTitleStyles}>
        <Typography variant="h6" sx={styles.titleTextStyles}>Edit {title}</Typography>
        <IconButton onClick={onClose} size="small"><CloseIcon /></IconButton>
      </DialogTitle>
      <Divider />
      <DialogContent sx={styles.dialogContentStyles}>
        <Box sx={styles.formBoxStyles}>
          {editableEntries.map(([key, value]) => (
            <TextField
              key={key}
              label={key.replace(/([A-Z])/g, ' $1').trim()}
              defaultValue={String(value ?? '')}
              size="small"
              fullWidth
              variant="outlined"
              sx={styles.textFieldStyles}
            />
          ))}
        </Box>
      </DialogContent>
      <DialogActions sx={styles.dialogActionsStyles}>
        <Button onClick={onClose} variant="outlined" size="small">Cancel</Button>
        <Button onClick={handleSave} variant="contained" size="small">Save Changes</Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditDialog;
