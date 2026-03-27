import React, { useMemo } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Divider,
  IconButton,
  useTheme,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import * as styles from './ViewDialog.styles';

interface ViewDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  data: Record<string, unknown> | null;
}

const ViewDialog: React.FC<ViewDialogProps> = ({ open, onClose, title, data }) => {
  const theme = useTheme();

  const entries = useMemo(() => {
    if (!data) return [];
    return Object.entries(data).filter(([key]) => key !== 'id');
  }, [data]);

  if (!data) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={styles.dialogTitleStyles}>
        <Typography variant="h6" sx={styles.titleTextStyles}>{title}</Typography>
        <IconButton onClick={onClose} size="small"><CloseIcon /></IconButton>
      </DialogTitle>
      <Divider />
      <DialogContent sx={styles.dialogContentStyles}>
        {entries.map(([key, value]) => (
          <Box key={key} sx={styles.rowBoxStyles(theme)}>
            <Typography variant="body2" color="text.secondary" sx={styles.labelStyles}>
              {key.replace(/([A-Z])/g, ' $1').trim()}
            </Typography>
            <Typography variant="body2" sx={styles.valueStyles}>
              {String(value ?? 'N/A')}
            </Typography>
          </Box>
        ))}
      </DialogContent>
      <DialogActions sx={styles.dialogActionsStyles}>
        <Button onClick={onClose} variant="outlined" size="small">Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ViewDialog;
