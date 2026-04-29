import { SxProps, Theme } from '@mui/material';

export const appBarStyles = (theme: Theme): SxProps<Theme> => ({
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
  zIndex: theme.zIndex.drawer + 1,
  pointerEvents: 'none',
});

export const toolbarStyles: SxProps<Theme> = {
  justifyContent: 'space-between',
  minHeight: { xs: 56, md: 64 },
  px: { xs: 1.5, md: 3 },
  pointerEvents: 'none',
};

export const tenantSelectStyles = (theme: Theme): SxProps<Theme> => ({
  borderRadius: 2,
  fontSize: '0.85rem',
  fontWeight: 600,
  bgcolor: theme.palette.action.hover,
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: theme.palette.divider,
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: theme.palette.primary.light,
  },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: theme.palette.primary.main,
  },
  pointerEvents: 'auto', // Explicitly enable for the select
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
  pointerEvents: 'auto', // Explicitly enable for profile box
});

export const menuPaperStyles: SxProps<Theme> = {
  minWidth: 260,
  mt: 1,
  borderRadius: 2,
};
