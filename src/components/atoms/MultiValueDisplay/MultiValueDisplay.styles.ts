import { SxProps, Theme } from '@mui/material';

export const containerStyles: SxProps<Theme> = {
  py: 0.5,
};

export const chipStyles = (maxWidth: number | string): SxProps<Theme> => ({
  height: 22,
  fontSize: 11,
  bgcolor: 'action.hover',
  borderColor: 'divider',
  '&:hover': { bgcolor: 'action.selected' },
  maxWidth,
  '& .MuiChip-label': {
    px: 1,
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  }
});

export const moreChipStyles: SxProps<Theme> = {
  height: 22,
  fontSize: 10,
  fontWeight: 600,
  color: 'primary.main',
  bgcolor: '#eff6ff',
  border: theme => `1px solid ${theme.palette.primary.light}`,
  '&:hover': { bgcolor: '#dbeafe' }
};

export const popoverPaperProps: SxProps<Theme> = {
  width: 280,
  maxHeight: 400,
  borderRadius: 2,
  boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column'
};

export const listStyles: SxProps<Theme> = {
  pt: 0,
  overflowY: 'auto',
  flex: 1,
  p: 0.5,
};
