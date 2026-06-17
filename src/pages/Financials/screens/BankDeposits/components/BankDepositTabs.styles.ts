import { styled } from '@mui/material/styles';
import { Box, Typography, Tabs, Tab } from '@mui/material';
import { themeConfig } from '@/theme/themeConfig';

export const ContainerBox = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(3),
}));

export const LabelText = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  color: theme.palette.text.secondary,
  textTransform: 'uppercase',
  marginBottom: theme.spacing(1.5),
  display: 'block',
  letterSpacing: '0.05em',
}));

export const StyledTabs = styled(Tabs)(({ theme }) => ({
  minHeight: 'auto',
  '& .MuiTabs-indicator': {
    display: 'none',
  },
  '& .MuiTabs-flexContainer': {
    gap: theme.spacing(1),
  },
  '& .MuiTabs-scrollButtons': {
    width: 28,
    borderRadius: '4px',
    backgroundColor: theme.palette.action.hover,
    '&.Mui-disabled': {
      opacity: 0,
    },
  },
}));

export const StyledTab = styled(Tab, {
  shouldForwardProp: (prop) => prop !== 'active',
})<{ active?: boolean }>(({ theme, active }) => ({
  textTransform: 'none',
  fontWeight: 500,
  fontSize: '13px',
  minHeight: 'auto',
  padding: 0,
  opacity: 1,
  '& .MuiBox-root': {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    paddingTop: theme.spacing(0.6),
    paddingBottom: theme.spacing(0.6),
    borderRadius: '16px',
    transition: 'all 0.2s',
    backgroundColor: active ? theme.palette.primary.main : 'transparent',
    color: active ? themeConfig.colors.tabs.textActive : themeConfig.colors.tabs.textInactive,
    '&:hover': {
      backgroundColor: active ? theme.palette.primary.dark : theme.palette.action.hover,
    },
  },
}));
