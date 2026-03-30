import { SxProps, Theme } from '@mui/material';

export const footerStyles = (theme: Theme): SxProps<Theme> => ({
  py: 1.5,
  px: 3,
  borderTop: `1px solid ${theme.palette.divider}`,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: 1,
  backgroundColor: '#0A1929',
  flexShrink: 0,
});
