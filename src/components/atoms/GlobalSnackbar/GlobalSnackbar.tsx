import React from 'react';
import { Snackbar, Alert, Box, IconButton, Slide, SlideProps } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useAppDispatch, useAppSelector } from '@/store';
import { closeSnackbar } from '@/store/slices/uiSlice';

function TransitionUp(props: SlideProps) {
  return <Slide {...props} direction="up" />;
}

/**
 * GlobalSnackbar component that listens to the UI state in Redux
 * and displays messages across the entire application.
 */
export const GlobalSnackbar: React.FC = () => {
  const dispatch = useAppDispatch();
  const { snackbarOpen, snackbarMessage, snackbarSeverity } = useAppSelector((state) => state.ui);

  const handleClose = (_event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    dispatch(closeSnackbar());
  };

  return (
    <Snackbar
      open={snackbarOpen}
      autoHideDuration={6000}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      TransitionComponent={TransitionUp}
      sx={{
        bottom: { xs: 16, sm: 24 },
      }}
    >
      <Alert
        onClose={handleClose}
        severity={snackbarSeverity}
        variant="filled"
        elevation={6}
        sx={{
          width: '100%',
          minWidth: { xs: '90vw', sm: '400px' },
          borderRadius: 2,
          fontWeight: 500,
          '& .MuiAlert-icon': {
            fontSize: 24,
          },
        }}
        action={
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={handleClose}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
        }
      >
        {snackbarMessage}
      </Alert>
    </Snackbar>
  );
};

export default GlobalSnackbar;
