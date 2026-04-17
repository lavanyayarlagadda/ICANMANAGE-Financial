import { SxProps, Theme } from '@mui/material';
import { themeConfig } from '@/theme/themeConfig';

export const footerStyles = (theme: Theme): SxProps<Theme> => ({
  py: 1.5,
  px: 3,
  borderTop: `1px solid ${theme.palette.divider}`,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: 1,
  backgroundColor: themeConfig.colors.footerBg,
  flexShrink: 0,
  position: 'fixed',
  bottom: 0,
  right: 0,
  left: 0,
  zIndex: theme.zIndex.appBar,
  pointerEvents: 'none',
  '& > *': { pointerEvents: 'auto' }
});
