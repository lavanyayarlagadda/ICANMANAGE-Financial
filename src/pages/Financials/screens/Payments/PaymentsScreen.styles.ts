import { styled } from '@mui/material/styles';
import { Box, Typography, TextField } from '@mui/material';

export const ScreenWrapper = styled(Box)(() => ({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  height: '100%',
  minHeight: 0,
}));

export const TransactionNumber = styled(Typography)(({ theme }) => ({
  cursor: 'pointer',
  '&:hover': {
    color: theme.palette.primary.main,
    textDecoration: 'underline'
  }
}));

export const MonospaceBox = styled(Box)(() => ({
  fontFamily: 'monospace',
}));

export const ToolbarWrapper = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    backgroundColor: theme.palette.background.default,
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.spacing(1),
    padding: theme.spacing(1.5),
    gap: theme.spacing(2),
    marginBottom: theme.spacing(3),
    [theme.breakpoints.up('md')]: {
      flexDirection: 'row',
      alignItems: 'center',
    },
  }));
  
  export const SearchField = styled(TextField)(({ theme }) => ({
    backgroundColor: theme.palette.background.paper,
    flex: '1 1 auto',
    [theme.breakpoints.up('md')]: {
      flex: '0 0 320px',
    },
    '& .MuiOutlinedInput-root': {
      height: 36,
      fontSize: '13px'
    }
  }));
