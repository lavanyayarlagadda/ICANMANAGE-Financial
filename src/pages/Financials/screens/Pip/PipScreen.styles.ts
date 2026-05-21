import { styled } from '@mui/material/styles';
import { Box, TextField } from '@mui/material';

export const NpiSectionWrapper = styled(Box)(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  borderTop: 'none',
  overflowX: 'auto',
  backgroundColor: theme.palette.background.paper,
}));

export const NpiHeaderRow = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '1.2fr 2fr 1fr 1fr',
  minWidth: 500,
  padding: theme.spacing(1, 2),
  backgroundColor: theme.palette.background.default,
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

export const NpiDataRow = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '1.2fr 2fr 1fr 1fr',
  minWidth: 500,
  padding: theme.spacing(1, 2),
  borderBottom: `1px solid ${theme.palette.divider}`,
  '&:last-of-type': {
    borderBottom: 'none',
  },
}));

/** Sits next to Status in DataTable filter row (sibling flex items, not a full-width row) */
export const SearchField = styled(TextField)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  flex: '0 0 150px',
  width: 150,
  minWidth: 120,
  '& .MuiOutlinedInput-root': {
    height: 36,
    fontSize: '13px',
  },
}));
