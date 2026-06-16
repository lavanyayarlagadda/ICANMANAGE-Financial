import { styled } from '@mui/material/styles';
import { Drawer, Box, Typography, IconButton, Divider } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { themeConfig } from '@/theme/themeConfig';

export const StyledDrawer = styled(Drawer)(({ theme }) => ({
  zIndex: theme.zIndex.drawer,
  '& .MuiBackdrop-root': {
    top: '56px',
    [theme.breakpoints.up('md')]: {
      top: '64px',
    },
  },
  '& .MuiDrawer-paper': {
    width: '100%',
    top: '56px',
    height: 'calc(100% - 56px)',
    boxShadow: themeConfig.shadows.dropdown,
    [theme.breakpoints.up('sm')]: {
      width: 400,
    },
    [theme.breakpoints.up('md')]: {
      top: '64px',
      height: 'calc(100% - 64px)',
    },
  },
}));

export const DrawerContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2.5),
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(4),
  },
}));

export const HeaderBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: theme.spacing(3),
  flexShrink: 0,
  paddingBottom: theme.spacing(1),
  borderBottom: `1px solid ${themeConfig.colors.dictionaryDrawer.bgAlt}`,
  [theme.breakpoints.up('sm')]: {
    borderBottom: 'none',
  },
}));

export const TitleTypography = styled(Typography)(() => ({
  fontWeight: 800,
  color: themeConfig.colors.dictionaryDrawer.textHeading,
  fontSize: '1.2rem',
}));

export const CloseIconButton = styled(IconButton)(() => ({
  backgroundColor: themeConfig.colors.dictionaryDrawer.bgAlt,
  color: themeConfig.colors.dictionaryDrawer.textMuted,
  '&:hover': {
    backgroundColor: themeConfig.colors.dictionaryDrawer.bgHover,
    color: themeConfig.colors.dictionaryDrawer.textHeading,
  },
  width: 36,
  height: 36,
}));

export const CloseIconStyled = styled(CloseIcon)(() => ({
  fontSize: 20,
}));

export const ContentBox = styled(Box)(({ theme }) => ({
  flex: 1,
  overflowY: 'auto',
  paddingRight: theme.spacing(1),
  marginRight: -theme.spacing(1),
  '&::-webkit-scrollbar': { width: 6 },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: themeConfig.colors.dictionaryDrawer.bgHover,
    borderRadius: 3,
  },
}));

export const CardBox = styled(Box)(({ theme }) => ({
  backgroundColor: themeConfig.colors.dictionaryDrawer.bg,
  padding: theme.spacing(4),
  borderRadius: '40px',
  border: `1px solid ${themeConfig.colors.dictionaryDrawer.border}`,
  position: 'relative',
  marginBottom: theme.spacing(4),
}));

export const HeadingTypography = styled(Typography)(({ theme }) => ({
  color: themeConfig.colors.dictionaryDrawer.textAccent,
  fontWeight: 800,
  letterSpacing: '0.05em',
  textTransform: 'uppercase',
  fontSize: '0.85rem',
  marginBottom: theme.spacing(2.5),
}));

export const StyledDivider = styled(Divider)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  borderColor: themeConfig.colors.dictionaryDrawer.bgAlt,
  borderBottomWidth: '1px',
}));

export const DescriptionTypography = styled(Typography)(({ theme }) => ({
  color: themeConfig.colors.dictionaryDrawer.textBody,
  lineHeight: 1.7,
  fontSize: '0.95rem',
  marginBottom: theme.spacing(3),
}));

export const TipBox = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(4),
  padding: theme.spacing(3),
  backgroundColor: themeConfig.colors.dictionaryDrawer.bgTip,
  borderRadius: '24px',
}));

export const TipTitle = styled(Typography)(({ theme }) => ({
  fontSize: '0.85rem',
  fontWeight: 700,
  color: themeConfig.colors.dictionaryDrawer.textAccent,
  marginBottom: theme.spacing(0.5),
}));

export const TipDescription = styled(Typography)(() => ({
  fontSize: '0.85rem',
  color: themeConfig.colors.dictionaryDrawer.textAccent,
  lineHeight: 1.5,
}));

export const StatusContainer = styled(Box)(({ theme }) => ({
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2),
}));

export const StatusSectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 800,
  letterSpacing: '0.05em',
  color: themeConfig.colors.dictionaryDrawer.textHeading,
  marginBottom: theme.spacing(3),
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
}));

export const StatusIndicatorBar = styled('span')(() => ({
  width: 4,
  height: 16,
  backgroundColor: themeConfig.colors.dictionaryDrawer.textAccent,
  borderRadius: 1,
  display: 'inline-block',
}));

export const StatusRow = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  paddingLeft: theme.spacing(1.5),
}));

export const StatusLabel = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  color: themeConfig.colors.dictionaryDrawer.textNavy,
  marginBottom: theme.spacing(0.5),
}));

export const StatusExplanation = styled(Typography)(() => ({
  color: themeConfig.colors.dictionaryDrawer.textMuted,
  lineHeight: 1.6,
}));

export const FooterBox = styled(Box)(({ theme }) => ({
  marginTop: 'auto',
  textAlign: 'center',
  paddingTop: theme.spacing(3),
  paddingBottom: theme.spacing(2),
  paddingLeft: theme.spacing(4),
  paddingRight: theme.spacing(4),
  flexShrink: 0,
  borderTop: `1px solid ${themeConfig.colors.dictionaryDrawer.bgAlt}`,
  backgroundColor: themeConfig.colors.dictionaryDrawer.bgFooter,
  marginLeft: -theme.spacing(4),
  marginRight: -theme.spacing(4),
  marginBottom: -theme.spacing(4),
}));

export const FooterHelpText = styled(Typography)(({ theme }) => ({
  color: themeConfig.colors.dictionaryDrawer.textLight,
  display: 'block',
  marginBottom: theme.spacing(1),
  fontWeight: 500,
}));

export const FooterBadge = styled(Box)(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2),
  paddingTop: theme.spacing(0.5),
  paddingBottom: theme.spacing(0.5),
  backgroundColor: themeConfig.colors.dictionaryDrawer.bg,
  borderRadius: '12px',
  border: `1px solid ${themeConfig.colors.dictionaryDrawer.border}`,
}));

export const FooterBadgeDot = styled(Box)(() => ({
  width: 6,
  height: 6,
  backgroundColor: themeConfig.colors.dictionaryDrawer.textAccent,
  borderRadius: '50%',
}));

export const FooterBadgeText = styled(Typography)(() => ({
  color: themeConfig.colors.dictionaryDrawer.textMuted,
  fontWeight: 600,
}));
