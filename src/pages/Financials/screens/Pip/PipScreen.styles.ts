import { styled } from '@mui/material/styles';
import { Box, TextField, Typography, SxProps, Theme } from '@mui/material';

export const ScreenWrapper = styled(Box)(() => ({
  position: 'relative',
}));

export const NpiSectionWrapper = styled(Box)(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  borderTop: 'none',
  overflowX: 'auto',
  overflowY: 'auto',
  maxHeight: 300,
  backgroundColor: theme.palette.background.paper,
  '&::-webkit-scrollbar': {
    width: '6px',
    height: '6px',
  },
  '&::-webkit-scrollbar-track': {
    background: theme.palette.background.default,
  },
  '&::-webkit-scrollbar-thumb': {
    background: theme.palette.divider,
    borderRadius: '4px',
    '&:hover': {
      background: theme.palette.text.secondary,
    },
  },
  scrollbarWidth: 'thin',
}));

export const NpiHeaderRow = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '1.2fr 2fr 1fr 1fr',
  minWidth: 500,
  padding: theme.spacing(1, 2),
  backgroundColor: theme.palette.background.default,
  borderBottom: `1px solid ${theme.palette.divider}`,
  position: 'sticky',
  top: 0,
  zIndex: 1,
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

// Added styled components for NPI section and layout clean up
export const NpiSectionContainer = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(1),
}));

export const SummaryRowBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  width: '100%',
  gap: theme.spacing(1),
  [theme.breakpoints.up('sm')]: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing(2),
  },
}));

export const PayerNameText = styled(Typography)(() => ({
  fontSize: 13,
  fontWeight: 600,
  flex: 1,
  wordBreak: 'break-word',
}));

export const PaymentDetailsBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  justifyContent: 'space-between',
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    justifyContent: 'flex-end',
    width: 'auto',
  },
}));

export const NpiHeaderColText = styled(Typography)(() => ({
  fontSize: 12,
  fontWeight: 600,
  textAlign: 'center',
}));

export const ClaimIdText = styled(Typography)(({ theme }) => ({
  fontSize: 13,
  color: theme.palette.primary.main,
  textAlign: 'center',
}));

export const NpiDataText = styled(Typography)(() => ({
  fontSize: 13,
  textAlign: 'center',
}));

export const AppliedBalanceText = styled(Typography)(({ theme }) => ({
  fontSize: 13,
  textAlign: 'center',
  color: theme.palette.success.main,
}));

export const CenteredLoadingBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  paddingTop: theme.spacing(2),
  paddingBottom: theme.spacing(2),
}));

export const NoDetailsText = styled(Typography)(({ theme }) => ({
  paddingTop: theme.spacing(1),
  paddingBottom: theme.spacing(1),
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2),
}));

export const FilterActionsWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
  alignItems: 'center',
  flexShrink: 0,
}));

export const chipContainerStyles: SxProps<Theme> = {
  textAlign: 'right',
  pr: 1,
};

export const filterButtonStyles: SxProps<Theme> = {
  height: '36px',
  borderRadius: '8px',
  textTransform: 'none',
  fontWeight: 600,
  px: 2,
};

export const gridContainerStyles: SxProps<Theme> = {
  mb: 3,
};
