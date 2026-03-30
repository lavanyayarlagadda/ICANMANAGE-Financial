import { SxProps, Theme } from '@mui/material';

export const dialogTitleStyles: SxProps<Theme> = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  pb: 1,
};

export const titleTextStyles: SxProps<Theme> = {
  fontWeight: 700,
};

export const dialogContentStyles: SxProps<Theme> = {
  pt: 2,
};

export const rowBoxStyles = (theme: Theme): SxProps<Theme> => ({
  display: 'flex',
  justifyContent: 'space-between',
  py: 1,
  borderBottom: `1px solid ${theme.palette.divider}`,
});

export const labelStyles: SxProps<Theme> = {
  fontWeight: 600,
  textTransform: 'capitalize',
};

export const valueStyles: SxProps<Theme> = {
  fontWeight: 500,
  textAlign: 'right',
  maxWidth: '60%',
};

export const dialogActionsStyles: SxProps<Theme> = {
  px: 3,
  pb: 2,
};
