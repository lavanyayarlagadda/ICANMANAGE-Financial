import { SxProps, Theme } from '@mui/material';

export const appBarStyles = (theme: Theme): SxProps<Theme> => ({
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
  zIndex: theme.zIndex.drawer + 1,
});

export const toolbarStyles: SxProps<Theme> = {
  justifyContent: 'space-between',
  minHeight: { xs: 56, md: 64 },
  px: { xs: 1.5, md: 3 },
};

export const tenantSelectStyles = (theme: Theme): SxProps<Theme> => ({
  borderRadius: 2,
  fontSize: '0.85rem',
  fontWeight: 600,
  bgcolor: 'rgba(25, 118, 210, 0.04)',
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: 'rgba(25, 118, 210, 0.2)',
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: 'rgba(25, 118, 210, 0.4)',
  },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: theme.palette.primary.main,
  },
});

export const userProfileBoxStyles = (theme: Theme): SxProps<Theme> => ({
  display: 'flex',
  alignItems: 'center',
  gap: 1,
  ml: 2,
  cursor: 'pointer',
  p: 0.5,
  borderRadius: 1,
  '&:hover': { backgroundColor: `${theme.palette.action.hover}` },
});

export const menuPaperStyles: SxProps<Theme> = {
  minWidth: 260,
  mt: 1,
  borderRadius: 2,
};
