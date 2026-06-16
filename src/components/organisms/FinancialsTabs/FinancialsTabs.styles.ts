import { styled } from '@mui/material/styles';
import { Box, Typography, Select, Tabs } from '@mui/material';
import Button from '@/components/atoms/Button/Button';
import { themeConfig } from '@/theme/themeConfig';

export const Container = styled(Box)({
  marginBottom: '8px',
});

export const MainTabsRow = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isTablet',
})<{ isTablet: boolean }>(({ theme, isTablet }) => ({
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2),
  paddingTop: theme.spacing(1.5),
  paddingBottom: theme.spacing(1.5),
  display: 'flex',
  flexDirection: isTablet ? 'column' : 'row',
  alignItems: isTablet ? 'flex-start' : 'center',
  backgroundColor: themeConfig.colors.tabs.mainBg,
  borderBottom: `1px solid ${theme.palette.divider}`,
  gap: isTablet ? theme.spacing(1.5) : 0,
}));

export const MainTitle = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'isTablet',
})<{ isTablet: boolean }>(({ theme, isTablet }) => ({
  fontWeight: 700,
  fontSize: '20px',
  color: themeConfig.colors.tabs.textTitle,
  marginRight: isTablet ? 0 : theme.spacing(4),
  marginBottom: isTablet ? theme.spacing(0.5) : 0,
  flexShrink: 0,
}));

export const TabsWrapper = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isTablet',
})<{ isTablet: boolean }>(({ theme, isTablet }) => ({
  flex: 1,
  minWidth: 0,
  overflow: 'hidden',
  display: 'flex',
  alignItems: 'center',
  marginLeft: isTablet ? 0 : theme.spacing(2),
}));

export const TabletSelect = styled(Select)(({ theme }) => ({
  backgroundColor: themeConfig.colors.tabs.inactiveBg,
  borderRadius: '8px',
  fontWeight: 600,
  fontSize: '14px',
  '& .MuiOutlinedInput-notchedOutline': { borderColor: theme.palette.divider },
})) as unknown as typeof Select;

export const StyledTabs = styled(Tabs)({
  width: '100%',
  minHeight: '40px',
  '& .MuiTabs-indicator': { display: 'none' },
  '& .MuiTabs-flexContainer': { gap: '4px' },
  '& .MuiTabs-scroller': { overflow: 'hidden !important' },
  '& .MuiTabs-scrollButtons': {
    width: '32px',
    borderRadius: '4px',
    backgroundColor: themeConfig.colors.slate[100],
    marginLeft: '4px',
    marginRight: '4px',
    color: themeConfig.colors.primary,
    transition: 'all 0.2s',
    '&:hover': { backgroundColor: themeConfig.colors.slate[200] },
    '&.Mui-disabled': { display: 'none' },
  },
  '& .MuiTab-root': {
    minHeight: '40px',
    minWidth: 'auto',
    padding: 0,
    textTransform: 'none',
    opacity: 1,
  },
});

export const MainTabItem = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isActive' && prop !== 'isDisabled',
})<{ isActive: boolean; isDisabled?: boolean }>(({ isActive, isDisabled }) => ({
  paddingLeft: '16px',
  paddingRight: '16px',
  paddingTop: '8px',
  paddingBottom: '8px',
  borderRadius: '6px',
  cursor: isDisabled ? 'not-allowed' : 'pointer',
  backgroundColor: isDisabled
    ? themeConfig.colors.slate[50]
    : isActive
      ? themeConfig.colors.tabs.activeBg
      : themeConfig.colors.tabs.inactiveBg,
  color: isDisabled
    ? themeConfig.colors.slate[300]
    : isActive
      ? themeConfig.colors.tabs.textActive
      : themeConfig.colors.tabs.textInactive,
  fontWeight: isActive ? 600 : 500,
  fontSize: '13px',
  whiteSpace: 'nowrap',
  transition: 'all 0.2s',
  opacity: isDisabled ? 0.6 : 1,
  '&:hover': {
    backgroundColor: isDisabled
      ? themeConfig.colors.slate[50]
      : isActive
        ? themeConfig.colors.tabs.activeBgHover
        : themeConfig.colors.tabs.inactiveBgHover,
  },
}));

export const SubTabsRow = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isMobile',
})<{ isMobile: boolean }>(({ isMobile }) => ({
  paddingLeft: '16px',
  paddingRight: '16px',
  paddingTop: '12px',
  paddingBottom: '12px',
  display: 'flex',
  flexDirection: isMobile ? 'column' : 'row',
  justifyContent: isMobile ? 'flex-start' : 'space-between',
  alignItems: isMobile ? 'stretch' : 'center',
  backgroundColor: themeConfig.colors.tabs.subBg,
  gap: '16px',
}));

export const SubTabsWrapper = styled(Box)({
  flex: 1,
  minWidth: 0,
  overflow: 'hidden',
});

export const StyledSubTabs = styled(Tabs)({
  width: '100%',
  minHeight: 'auto',
  '& .MuiTabs-indicator': { display: 'none' },
  '& .MuiTabs-flexContainer': { gap: '8px' },
  '& .MuiTabs-scrollButtons': {
    width: '28px',
    borderRadius: '4px',
    backgroundColor: themeConfig.colors.slate[100],
    transition: 'all 0.2s',
    '&.Mui-disabled': { display: 'none' },
  },
  '& .MuiTab-root': {
    minHeight: 'auto',
    minWidth: 'auto',
    padding: 0,
    textTransform: 'none',
    opacity: 1,
  },
});

export const SubTabItem = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isActive' && prop !== 'isDisabled',
})<{ isActive: boolean; isDisabled?: boolean }>(({ isActive, isDisabled }) => ({
  paddingLeft: '12px',
  paddingRight: '12px',
  paddingTop: '4px',
  paddingBottom: '4px',
  borderRadius: '16px',
  cursor: isDisabled ? 'not-allowed' : 'pointer',
  backgroundColor: isDisabled
    ? themeConfig.colors.slate[100]
    : isActive
      ? themeConfig.colors.tabs.activeBgHover
      : 'transparent',
  color: isDisabled
    ? themeConfig.colors.slate[300]
    : isActive
      ? themeConfig.colors.tabs.textActive
      : themeConfig.colors.tabs.textInactive,
  fontWeight: 500,
  fontSize: '13px',
  whiteSpace: 'nowrap',
  transition: 'all 0.2s',
  border: isDisabled ? `1px dashed ${themeConfig.colors.slate[200]}` : 'none',
  '&:hover': {
    backgroundColor: isDisabled
      ? themeConfig.colors.slate[100]
      : isActive
        ? themeConfig.colors.primary
        : themeConfig.colors.tabs.subBg,
  },
}));

export const ActionsGroup = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isMobile',
})<{ isMobile: boolean }>(({ isMobile }) => ({
  display: 'flex',
  gap: '12px',
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: isMobile ? 'flex-start' : 'flex-end',
}));

export const PrintButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'isMobile',
})<{ isMobile: boolean }>(({ isMobile }) => ({
  color: themeConfig.colors.slate[600],
  borderColor: themeConfig.colors.slate[200],
  borderRadius: '6px',
  textTransform: 'none',
  paddingLeft: '16px',
  paddingRight: '16px',
  paddingTop: '5.6px',
  paddingBottom: '5.6px',
  fontSize: '13px',
  fontWeight: 500,
  backgroundColor: themeConfig.colors.surface,
  flex: isMobile ? 1 : 'unset',
  minWidth: isMobile ? 'calc(50% - 12px)' : 'unset',
  '&:hover': {
    borderColor: themeConfig.colors.slate[300],
    backgroundColor: themeConfig.colors.slate[50],
  },
}));

export const ReloadButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'isMobile',
})<{ isMobile: boolean }>(({ isMobile }) => ({
  color: themeConfig.colors.text.primary,
  borderColor: themeConfig.colors.text.primary,
  borderWidth: 1.5,
  borderRadius: '6px',
  textTransform: 'none',
  paddingLeft: '16px',
  paddingRight: '16px',
  paddingTop: '5.6px',
  paddingBottom: '5.6px',
  fontSize: '13px',
  fontWeight: 700,
  flex: isMobile ? 1 : 'unset',
  minWidth: isMobile ? 'calc(50% - 12px)' : 'unset',
  '&:hover': { borderWidth: 1.5, backgroundColor: themeConfig.colors.slate[50] },
}));

export const ExportButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'isMobile',
})<{ isMobile: boolean }>(({ isMobile }) => ({
  bgcolor: themeConfig.colors.amber,
  color: themeConfig.colors.surface,
  borderRadius: '6px',
  textTransform: 'none',
  paddingLeft: '24px',
  paddingRight: '24px',
  paddingTop: '5.6px',
  paddingBottom: '5.6px',
  fontSize: '13px',
  fontWeight: 600,
  width: isMobile ? '100%' : 'unset',
  '&:hover': { backgroundColor: themeConfig.colors.amberDark },
}));
