import { Box, TextField, Typography, Chip, Grid } from '@mui/material';
import { styled } from '@mui/material/styles';
import { themeConfig } from '@/theme/themeConfig';

export const ToolbarWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'stretch',
  backgroundColor: theme.palette.background.default,
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.spacing(1),
  padding: theme.spacing(1.5),
  gap: theme.spacing(2),
  marginBottom: theme.spacing(3),
  [theme.breakpoints.up('md')]: {
    flexDirection: 'row',
    alignItems: 'center',
  },
}));

export const SearchField = styled(TextField)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  flex: '1 1 auto',
  [theme.breakpoints.up('md')]: {
    flex: '0 0 320px',
  },
  '& .MuiOutlinedInput-root': {
    height: 36,
    fontSize: '13px',
  },
}));

export const OffsetWrapperBox = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(1),
}));

export const OffsetSummaryBox = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '100%',
  gap: '16px',
}));

export const OffsetTitleTypography = styled(Typography)(() => ({
  fontWeight: 600,
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
}));

export const OffsetAmountTypography = styled(Typography)(() => ({
  fontWeight: 700,
  textAlign: 'center',
}));

export const OffsetChip = styled(Chip)(() => ({
  height: 20,
  fontSize: '10px',
  fontWeight: 700,
  backgroundColor: themeConfig.colors.accent + '18',
  color: themeConfig.colors.accentDark,
  border: `1px solid ${themeConfig.colors.accent + '33'}`,
}));

export const OffsetDetailsContainerBox = styled(Box)(() => ({
  border: `1px solid ${themeConfig.colors.divider}`,
  borderTop: 'none',
  overflowX: 'auto',
}));

export const OffsetHeaderGridBox = styled(Box)(() => ({
  display: 'grid',
  gridTemplateColumns: '1.2fr 2fr 1fr',
  minWidth: 500,
  paddingLeft: '16px',
  paddingRight: '16px',
  paddingTop: '8px',
  paddingBottom: '8px',
  backgroundColor: themeConfig.colors.surfaceAlt,
  borderBottom: `1px solid ${themeConfig.colors.divider}`,
}));

export const OffsetRowGridBox = styled(Box)(() => ({
  display: 'grid',
  gridTemplateColumns: '1.2fr 2fr 1fr',
  minWidth: 500,
  paddingLeft: '16px',
  paddingRight: '16px',
  paddingTop: '8px',
  paddingBottom: '8px',
  borderBottom: `1px solid ${themeConfig.colors.divider}`,
}));

export const ClaimIdTypography = styled(Typography)(() => ({
  fontWeight: 500,
}));

export const PatientNameTypography = styled(Typography)(() => ({
  fontWeight: 500,
}));

export const DeductedAmountTypography = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  color: theme.palette.error.main,
}));

export const NoticeIdTypography = styled(Typography)(() => ({
  fontWeight: 700,
  color: themeConfig.colors.amberDark,
}));

export const BoldTextTypography = styled(Typography)(() => ({
  fontWeight: 700,
}));

export const ProviderNameWrapperBox = styled(Box)(() => ({
  textAlign: 'center',
}));

export const ProviderNameTypography = styled(Typography)(() => ({
  fontWeight: 700,
}));

export const ErrorAmountTypography = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  color: theme.palette.error.main,
}));

export const ScreenHeaderBox = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(3),
}));

export const ScreenHeaderTitleTypography = styled(Typography)(() => ({
  fontWeight: 700,
}));

export const SummaryGridContainer = styled(Grid)(({ theme }) => ({
  marginBottom: theme.spacing(4),
}));

export const LoadingWrapperBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: theme.spacing(2),
}));

export const EmptyDetailsWrapperBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  textAlign: 'center',
}));

export const DetailsWrapperBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1),
}));
