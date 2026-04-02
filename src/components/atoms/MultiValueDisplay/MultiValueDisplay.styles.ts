import { SxProps, Theme } from '@mui/material';
import { themeConfig } from '@/theme/themeConfig';

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
  bgcolor: themeConfig.colors.surfaceInfo,
  border: theme => `1px solid ${theme.palette.primary.light}`,
  '&:hover': { bgcolor: themeConfig.colors.surfaceInfoHover }
};

export const popoverPaperProps: SxProps<Theme> = {
  width: 280,
  maxHeight: 400,
  borderRadius: 2,
  boxShadow: themeConfig.shadows.dropdown,
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
