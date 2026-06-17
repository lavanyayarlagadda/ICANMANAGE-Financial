import React from 'react';
import { Dialog, Divider, Grid, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import { GlassDialog } from '../ReconciliationScreen.styles';
import { ReconciliationRow } from '@/interfaces/financials';
import * as styles from './EditDialog.styles';

interface EftDetailsDialogProps {
  open: boolean;
  onClose: () => void;
  selectedRow: ReconciliationRow | null;
}

const ReconciliationField: React.FC<{
  label: string;
  value: string | number;
  editable?: boolean;
  onChange?: (val: string) => void;
}> = ({ label, value, editable = false, onChange }) => (
  <Grid size={{ xs: 12, sm: 6, md: 2 }}>
    <styles.OuterContainer editable={editable}>
      <styles.LabelBox editable={editable}>
        <styles.LabelText variant="caption">{label}</styles.LabelText>
      </styles.LabelBox>
      <styles.ValueBox>
        <styles.StyledTextField
          variant="standard"
          fullWidth
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          disabled={!editable}
        />
      </styles.ValueBox>
    </styles.OuterContainer>
  </Grid>
);

const EditDetailsDialog: React.FC<EftDetailsDialogProps> = ({ open, onClose, selectedRow }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth PaperComponent={GlassDialog}>
      <styles.StyledDialogTitle>
        <styles.DialogTitleText variant="h6">
          Reconciliation Details - {selectedRow?.transactionNo || '840841565'}
        </styles.DialogTitleText>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </styles.StyledDialogTitle>
      <Divider />
      <styles.StyledDialogContent>
        <styles.GridContainer container spacing={1}>
          <ReconciliationField
            label="Transaction Type"
            value={selectedRow?.transactionType || 'EFT CRE'}
          />
          <ReconciliationField label="Tax Id" value="2041495" />
          <ReconciliationField label="Account Name" value="Metro De" />
          <ReconciliationField label="Payor" value="PAY PLU" />
          <ReconciliationField
            label="Bank Deposit"
            value={`$ ${selectedRow?.bankDeposit || '134.22'}`}
          />
          <ReconciliationField label="Remittance" value="$ 0.00" />

          <ReconciliationField label="AMD" value="$ 0.00" editable={true} />
          <ReconciliationField label="Legacy" value="$ 0.00" editable={true} />
          <ReconciliationField label="GL" value="$ 0.00" editable={true} />
        </styles.GridContainer>

        <styles.MainSplitBox>
          <styles.LeftSplit>
            <styles.SplitHeader>
              <styles.StyledHistoryIcon />
              <styles.HeaderText variant="caption">History</styles.HeaderText>
            </styles.SplitHeader>
            <styles.HistoryContent>
              <styles.EmptyHistoryText variant="body2">No Data Available</styles.EmptyHistoryText>
            </styles.HistoryContent>
          </styles.LeftSplit>
          <styles.RightSplit>
            <styles.SplitHeader>
              <styles.StyledChatIcon />
              <styles.HeaderText variant="caption">Comments</styles.HeaderText>
            </styles.SplitHeader>
            <styles.CommentContent>
              <styles.CommentField
                multiline
                fullWidth
                rows={4}
                variant="outlined"
                placeholder="Enter comments here..."
              />
            </styles.CommentContent>
          </styles.RightSplit>
        </styles.MainSplitBox>

        <styles.ActionRow>
          <styles.SubmitButton
            variant="contained"
            color="secondary"
            startIcon={<AssignmentTurnedInIcon />}
          >
            Submit
          </styles.SubmitButton>
        </styles.ActionRow>
      </styles.StyledDialogContent>
    </Dialog>
  );
};

export default EditDetailsDialog;
