import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';
import { themeConfig } from '@/theme/themeConfig';

export const FooterContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'drawerWidth',
})<{ drawerWidth: number; component?: React.ElementType }>(({ theme, drawerWidth }) => ({
  paddingTop: theme.spacing(1.5),
  paddingBottom: theme.spacing(1.5),
  paddingRight: theme.spacing(3),
  paddingLeft: `calc(${drawerWidth}px + ${theme.spacing(3)})`,
  borderTop: `1px solid ${theme.palette.divider}`,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: theme.spacing(1),
  backgroundColor: themeConfig.colors.footerBg,
  flexShrink: 0,
  position: 'fixed',
  bottom: 0,
  right: 0,
  left: 0,
  zIndex: theme.zIndex.appBar,
  pointerEvents: 'none',
  '& > *': { pointerEvents: 'auto' },
}));
