import React, { useCallback, useMemo } from 'react';
import { Dialog, Divider, IconButton, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { DialogData } from '@/interfaces/financials';
import * as styles from './EditDialog.styles';

interface EditDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
  title: string;
  data: DialogData | null;
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
      <styles.StyledDialogTitle>
        <styles.TitleText variant="h6">Edit {title}</styles.TitleText>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </styles.StyledDialogTitle>
      <Divider />
      <styles.StyledDialogContent>
        <styles.FormBox>
          {editableEntries.map(([key, value]) => (
            <styles.StyledTextField
              key={key}
              label={key.replace(/([A-Z])/g, ' $1').trim()}
              defaultValue={String(value ?? '')}
              size="small"
              fullWidth
              variant="outlined"
            />
          ))}
        </styles.FormBox>
      </styles.StyledDialogContent>
      <styles.StyledDialogActions>
        <Button onClick={onClose} variant="outlined" size="small">
          Cancel
        </Button>
        <Button onClick={handleSave} variant="contained" size="small">
          Save Changes
        </Button>
      </styles.StyledDialogActions>
    </Dialog>
  );
};

export default EditDialog;
