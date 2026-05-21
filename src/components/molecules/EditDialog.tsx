import React from 'react';
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

interface EditDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
  title: string;
  data: Record<string, unknown> | null;
}

const EditDialog: React.FC<EditDialogProps> = ({ open, onClose, onSave, title, data }) => {
  if (!data) return null;

  const editableEntries = Object.entries(data).filter(([key]) => key !== 'id');

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>Edit {title}</Typography>
        <IconButton onClick={onClose} size="small"><CloseIcon /></IconButton>
      </DialogTitle>
      <Divider />
      <DialogContent sx={{ pt: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          {editableEntries.map(([key, value]) => (
            <TextField
              key={key}
              label={key.replace(/([A-Z])/g, ' $1').trim()}
              defaultValue={String(value ?? '')}
              size="small"
              fullWidth
              variant="outlined"
              sx={{ '& .MuiInputLabel-root': { textTransform: 'capitalize' } }}
            />
          ))}
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} variant="outlined" size="small">Cancel</Button>
        <Button onClick={onSave} variant="contained" size="small">Save Changes</Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditDialog;
