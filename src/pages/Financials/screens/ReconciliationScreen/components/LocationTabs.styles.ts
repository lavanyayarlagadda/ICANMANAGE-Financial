import { styled } from '@mui/material/styles';
import { Box, Tabs, Tab } from '@mui/material';
import { LocationTabWrapper } from '../ReconciliationScreen.styles';

export const StyledLocationTabWrapper = styled(LocationTabWrapper, {
  shouldForwardProp: (prop) => prop !== 'isMobile',
})<{ isMobile?: boolean }>(({ theme, isMobile }) => ({
  marginBottom: theme.spacing(2),
  display: 'flex',
  flexDirection: isMobile ? 'column' : 'row',
  alignItems: isMobile ? 'flex-start' : 'center',
  flexWrap: 'nowrap',
  gap: theme.spacing(2),
}));

export const TabsContainer = styled(Box)(() => ({
  width: '100%',
  minWidth: 0,
  overflow: 'hidden',
}));

export const StyledTabs = styled(Tabs)(({ theme }) => ({
  width: '100%',
  minHeight: 'auto',
  '& .MuiTabs-indicator': { display: 'none' },
  '& .MuiTabs-flexContainer': { gap: '4px' },
  '& .MuiTabs-scrollButtons': {
    width: '32px',
    borderRadius: '4px',
    backgroundColor: theme.palette.grey[100],
    marginLeft: theme.spacing(0.5),
    marginRight: theme.spacing(0.5),
    transition: 'all 0.2s',
    '&:hover': { backgroundColor: theme.palette.grey[200] },
    '&.Mui-disabled': { display: 'none' },
  },
}));

export const StyledTab = styled(Tab, {
  shouldForwardProp: (prop) => prop !== 'active',
})<{ active?: boolean }>(({ theme, active }) => ({
  minHeight: 'auto',
  minWidth: 'auto',
  padding: '6px 16px',
  backgroundColor: active ? theme.palette.primary.main : theme.palette.grey[100],
  color: active ? theme.palette.common.white : theme.palette.text.primary,
  borderRadius: '4px',
  fontSize: '12px',
  fontWeight: 700,
  textTransform: 'none',
  transition: 'all 0.2s',
  opacity: 1,
  '&.Mui-selected': {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
  },
  '&:hover': {
    backgroundColor: active ? theme.palette.primary.dark : theme.palette.grey[200],
  },
}));

export const SpacerBox = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isMobile',
})<{ isMobile?: boolean }>(({ isMobile }) => ({
  flex: isMobile ? 'none' : 1,
}));
