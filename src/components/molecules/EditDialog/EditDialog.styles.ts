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

export const formBoxStyles: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
  mt: 1,
};

export const textFieldStyles: SxProps<Theme> = {
  '& .MuiInputLabel-root': {
    textTransform: 'capitalize',
  },
};

export const dialogActionsStyles: SxProps<Theme> = {
  px: 3,
  pb: 2,
};
