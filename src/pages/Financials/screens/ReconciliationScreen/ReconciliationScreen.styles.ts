import { styled, Box, Paper } from '@mui/material';

export const ScreenWrapper = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
  },
}));

export const HeaderSection = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  flexWrap: 'wrap',
  gap: theme.spacing(2),
}));

export const FilterContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(3),
  backgroundColor: theme.palette.background.paper,
  border: 'none',
  boxShadow: theme.shadows[1],
  borderRadius: theme.shape.borderRadius,
}));

export const ToggleWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  backgroundColor: theme.palette.grey[100],
  borderRadius: '8px',
  padding: '4px',
  width: 'fit-content',
}));

export const ToggleButton = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'active',
})<{ active?: boolean }>(({ theme, active }) => ({
  padding: '6px 20px',
  borderRadius: '6px',
  cursor: 'pointer',
  fontSize: '13px',
  fontWeight: 600,
  transition: 'all 0.2s ease',
  backgroundColor: active ? theme.palette.background.paper : 'transparent',
  color: active ? theme.palette.primary.main : theme.palette.text.secondary,
  boxShadow: active ? theme.shadows[1] : 'none',
  '&:hover': {
    color: active ? theme.palette.primary.main : theme.palette.primary.dark,
  },
}));

export const LocationTabWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: '4px',
  marginBottom: theme.spacing(2),
  flexWrap: 'wrap',
}));

export const LocationTab = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'active',
})<{ active?: boolean }>(({ theme, active }) => ({
  padding: '6px 16px',
  backgroundColor: active ? theme.palette.primary.main : theme.palette.grey[100],
  color: active ? theme.palette.common.white : theme.palette.text.primary,
  borderRadius: '4px',
  fontSize: '12px',
  fontWeight: 700,
  cursor: 'pointer',
  minWidth: '50px',
  textAlign: 'center',
  '&:hover': {
    backgroundColor: active ? theme.palette.primary.dark : theme.palette.grey[200],
  },
}));

export const TotalsBar = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'stretch',
  backgroundColor: theme.palette.grey[50],
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: '4px',
  marginBottom: theme.spacing(3),
  overflow: 'hidden',
}));

export const TotalItem = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'bgColor' && prop !== 'textColor',
})<{ bgColor?: string; textColor?: string }>(({ theme, bgColor, textColor }) => ({
  flex: 1,
  padding: '6px 10px',
  backgroundColor: bgColor || 'transparent',
  color: textColor || theme.palette.text.primary,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '4px',
  fontSize: '11px',
  fontWeight: 700,
  borderRight: `1px solid ${theme.palette.divider}`,
  whiteSpace: 'nowrap',
  '&:last-child': {
    borderRight: 'none',
  },
}));

export const HighlightCell = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.warning.main,
  color: theme.palette.common.white,
  padding: '4px 8px',
  borderRadius: '4px',
  fontWeight: 700,
  fontSize: '12px',
  textAlign: 'center',
  width: '100%',
}));
export const DayStripContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: '12px',
  overflowX: 'auto',
  padding: '12px 4px',
  marginBottom: theme.spacing(3),
  scrollbarWidth: 'none',
  '&::-webkit-scrollbar': {
    display: 'none',
  },
}));

export const DayCard = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'active' && prop !== 'today',
})<{ active?: boolean; today?: boolean }>(({ theme, active }) => ({
  flexShrink: 0,
  minWidth: '54px',
  height: '64px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: active ? theme.palette.primary.main : theme.palette.background.paper,
  color: active ? theme.palette.common.white : theme.palette.text.primary,
  borderRadius: '12px',
  border: active ? 'none' : `1px solid ${theme.palette.divider}`,
  cursor: 'pointer',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  boxShadow: active ? theme.shadows[4] : 'none',
  '&:hover': {
    borderColor: theme.palette.primary.main,
    transform: 'translateY(-2px)',
    boxShadow: active ? theme.shadows[6] : theme.shadows[1],
  },
}));

export const GlassDialog = styled(Paper)(({ theme }) => ({
  background: theme.palette.background.paper,
  backdropFilter: 'blur(10px)',
  borderRadius: '16px',
  boxShadow: theme.shadows[24],
  overflow: 'hidden',
  border: `1px solid ${theme.palette.divider}`,
}));

export const SectionSidebar = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'bgColor',
})<{ bgColor?: string }>(({ theme, bgColor }) => ({
  width: '120px',
  backgroundColor: bgColor || theme.palette.grey[100],
  padding: '16px 12px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  borderRight: `1px solid ${theme.palette.divider}`,
  position: 'relative',
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    padding: '8px 12px',
    flexDirection: 'row',
    borderRight: 'none',
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    right: 0,
    top: '20%',
    height: '60%',
    width: '2px',
    backgroundColor: theme.palette.divider,
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    }
  }
}));

export const ModernUploadZone = styled(Box)(({ theme }) => ({
  border: `2px dashed ${theme.palette.divider}`,
  borderRadius: '12px',
  padding: '12px 24px',
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  backgroundColor: theme.palette.grey[50],
  transition: 'all 0.2s ease',
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: theme.palette.grey[100],
    borderColor: theme.palette.primary.main,
  }
}));

export const DynamicTableContainer = styled(Box)(({ theme }) => ({
  flex: 1,
  overflowX: 'auto',
  WebkitOverflowScrolling: 'touch',
  '& table': {
    width: '100%',
    borderCollapse: 'collapse',
    '& th': {
      backgroundColor: theme.palette.grey[50],
      padding: '12px 16px',
      textAlign: 'left',
      fontSize: '11px',
      fontWeight: 800,
      color: theme.palette.text.secondary,
      borderBottom: `2px solid ${theme.palette.divider}`,
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
    },
    '& tr': {
      transition: 'all 0.2s ease',
      '&:nth-of-type(even)': {
        backgroundColor: theme.palette.grey[50],
      },
      '&:hover': {
        backgroundColor: theme.palette.grey[100],
      }
    },
    '& td': {
      padding: '14px 16px',
      fontSize: '12px',
      color: theme.palette.text.primary,
      borderBottom: `1px solid ${theme.palette.divider}`,
    }
  }
}));
