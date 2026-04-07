import { styled, Box, Paper } from '@mui/material';
import { themeConfig } from '@/theme/themeConfig';

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
  backgroundColor: themeConfig.colors.surface,
  border: 'none',
  boxShadow: themeConfig.shadows.card,
  borderRadius: theme.shape.borderRadius,
}));

export const ToggleWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  backgroundColor: themeConfig.colors.slate[100],
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
  backgroundColor: active ? themeConfig.colors.surface : 'transparent',
  color: active ? themeConfig.colors.primary : themeConfig.colors.text.muted,
  boxShadow: active ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
  '&:hover': {
    color: active ? themeConfig.colors.primary : themeConfig.colors.primaryDark,
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
  backgroundColor: active ? themeConfig.colors.primary : themeConfig.colors.slate[100],
  color: active ? themeConfig.colors.surface : themeConfig.colors.slate[700],
  borderRadius: '4px',
  fontSize: '12px',
  fontWeight: 700,
  cursor: 'pointer',
  minWidth: '50px',
  textAlign: 'center',
  '&:hover': {
    backgroundColor: active ? themeConfig.colors.primaryDark : themeConfig.colors.slate[200],
  },
}));

export const TotalsBar = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'stretch',
  backgroundColor: themeConfig.colors.slate[50],
  border: `1px solid ${themeConfig.colors.slate[200]}`,
  borderRadius: '4px',
  marginBottom: theme.spacing(3),
  overflow: 'hidden',
}));

export const TotalItem = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'bgColor' && prop !== 'textColor',
})<{ bgColor?: string; textColor?: string }>(({ bgColor, textColor }) => ({
  flex: 1,
  padding: '6px 10px',
  backgroundColor: bgColor || 'transparent',
  color: textColor || themeConfig.colors.slate[800],
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '4px',
  fontSize: '11px',
  fontWeight: 700,
  borderRight: `1px solid ${themeConfig.colors.slate[200]}`,
  whiteSpace: 'nowrap',
  '&:last-child': {
    borderRight: 'none',
  },
}));

export const HighlightCell = styled(Box)(({ theme }) => ({
  backgroundColor: themeConfig.colors.accent,
  color: themeConfig.colors.surface,
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
})<{ active?: boolean; today?: boolean }>(({ theme, active, today }) => ({
  flexShrink: 0,
  minWidth: '54px',
  height: '64px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: active ? themeConfig.colors.primary : themeConfig.colors.surface,
  color: active ? themeConfig.colors.surface : themeConfig.colors.slate[700],
  borderRadius: '12px',
  border: active ? 'none' : `1px solid ${themeConfig.colors.slate[200]}`,
  cursor: 'pointer',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  boxShadow: active ? '0 10px 15px -3px rgba(59, 130, 246, 0.3)' : 'none',
  '&:hover': {
    borderColor: themeConfig.colors.primary,
    transform: 'translateY(-2px)',
    boxShadow: active ? '0 10px 15px -3px rgba(59, 130, 246, 0.3)' : '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
  },
}));

export const GlassDialog = styled(Paper)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(10px)',
  borderRadius: '16px',
  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  overflow: 'hidden',
  border: '1px solid rgba(255, 255, 255, 0.3)',
}));

export const SectionSidebar = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'bgColor',
})<{ bgColor?: string }>(({ theme, bgColor }) => ({
  width: '120px',
  backgroundColor: bgColor || themeConfig.colors.slate[100],
  padding: '16px 12px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  borderRight: `1px solid ${themeConfig.colors.slate[200]}`,
  position: 'relative',
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    padding: '8px 12px',
    flexDirection: 'row',
    borderRight: 'none',
    borderBottom: `1px solid ${themeConfig.colors.slate[200]}`,
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    right: 0,
    top: '20%',
    height: '60%',
    width: '2px',
    backgroundColor: themeConfig.colors.slate[200],
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    }
  }
}));

export const ModernUploadZone = styled(Box)(({ theme }) => ({
  border: `2px dashed ${themeConfig.colors.slate[300]}`,
  borderRadius: '12px',
  padding: '12px 24px',
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  backgroundColor: themeConfig.colors.slate[50],
  transition: 'all 0.2s ease',
  cursor: 'pointer',
  '&:hover': {
     backgroundColor: themeConfig.colors.slate[100],
     borderColor: themeConfig.colors.primary,
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
         backgroundColor: themeConfig.colors.slate[50],
         padding: '12px 16px',
         textAlign: 'left',
         fontSize: '11px',
         fontWeight: 800,
         color: themeConfig.colors.slate[500],
         borderBottom: `2px solid ${themeConfig.colors.slate[100]}`,
         textTransform: 'uppercase',
         letterSpacing: '0.05em',
      },
      '& tr': {
         transition: 'all 0.2s ease',
         '&:nth-of-type(even)': {
            backgroundColor: themeConfig.colors.slate[50],
         },
         '&:hover': {
            backgroundColor: themeConfig.colors.slate[100],
         }
      },
      '& td': {
         padding: '14px 16px',
         fontSize: '12px',
         color: themeConfig.colors.slate[700],
         borderBottom: `1px solid ${themeConfig.colors.slate[100]}`,
      }
   }
}));
