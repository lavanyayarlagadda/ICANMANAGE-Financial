import React, { useMemo } from 'react';
import { Dialog, Button, Divider, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { DialogData } from '@/interfaces/financials';
import {
  StyledDialogTitle,
  TitleText,
  StyledDialogContent,
  RowBox,
  LabelTypography,
  ValueTypography,
  StyledDialogActions,
} from './ViewDialog.styles';

interface ViewDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  data: DialogData | null;
}

const ViewDialog: React.FC<ViewDialogProps> = ({ open, onClose, title, data }) => {
  const entries = useMemo(() => {
    if (!data) return [];
    return Object.entries(data).filter(([key]) => key !== 'id');
  }, [data]);

  if (!data) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <StyledDialogTitle>
        <TitleText variant="h6">{title}</TitleText>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </StyledDialogTitle>
      <Divider />
      <StyledDialogContent>
        {entries.map(([key, value]) => (
          <RowBox key={key}>
            <LabelTypography variant="body2" color="text.secondary">
              {key.replace(/([A-Z])/g, ' $1').trim()}
            </LabelTypography>
            <ValueTypography variant="body2">{String(value ?? 'N/A')}</ValueTypography>
          </RowBox>
        ))}
      </StyledDialogContent>
      <StyledDialogActions>
        <Button onClick={onClose} variant="outlined" size="small">
          Close
        </Button>
      </StyledDialogActions>
    </Dialog>
  );
};

export default ViewDialog;
