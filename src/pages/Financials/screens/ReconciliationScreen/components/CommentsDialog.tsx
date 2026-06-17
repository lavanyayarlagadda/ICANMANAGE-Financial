import React from 'react';
import { Dialog, IconButton, Divider } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { ReconciliationRow } from '@/interfaces/financials';
import * as styles from './CommentsDialog.styles';

interface CommentsDialogProps {
  open: boolean;
  onClose: () => void;
  row: ReconciliationRow | null;
}

const CommentsDialog: React.FC<CommentsDialogProps> = ({ open, onClose }) => {
  // Mock comments history
  const history = [
    { text: 'Gl Amount updated to 123.0', user: 'Naga Kiran', date: '04/06/2026' },
    { text: 'ada', user: 'Naga Kiran', date: '04/06/2026' },
  ];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <styles.StyledDialogTitle>
        <styles.DialogTitleText variant="h6">Comments</styles.DialogTitleText>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </styles.StyledDialogTitle>
      <Divider />
      <styles.StyledDialogContent>
        <styles.CommentsContainer>
          {history.map((item, index) => (
            <styles.CommentHistoryBox key={index}>
              <styles.CommentText variant="body2">{item.text}</styles.CommentText>
              <styles.CommentMeta variant="caption">
                ,updated By {item.user} ,created on {item.date}
              </styles.CommentMeta>
            </styles.CommentHistoryBox>
          ))}
          {!history.length && (
            <styles.EmptyCommentsText variant="body2">
              No comments available for this transaction.
            </styles.EmptyCommentsText>
          )}
        </styles.CommentsContainer>
      </styles.StyledDialogContent>
      <styles.StyledDialogActions>
        <styles.CloseButton onClick={onClose} variant="contained">
          Close
        </styles.CloseButton>
      </styles.StyledDialogActions>
    </Dialog>
  );
};

export default CommentsDialog;
