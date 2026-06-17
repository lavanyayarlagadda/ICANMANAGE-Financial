import { styled } from '@mui/material/styles';
import { Box, Chip, TextField, Button, Typography, SxProps, Theme } from '@mui/material';

export const ScreenWrapper = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1, 3, 4, 3),
}));

export const ScreenHeader = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
}));

export const HeaderTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  marginBottom: theme.spacing(0.5),
}));

export const EntityChip = styled(Chip)<{ isSelected: boolean }>(({ theme, isSelected }) => ({
  backgroundColor: isSelected ? theme.palette.primary.main : theme.palette.grey[100],
  color: isSelected ? theme.palette.common.white : theme.palette.text.secondary,
  fontWeight: 600,
  fontSize: '12px',
  marginBottom: theme.spacing(0.5),
  '&:hover': {
    backgroundColor: isSelected ? theme.palette.primary.dark : theme.palette.grey[200],
  },
}));

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

export const SearchContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
  alignItems: 'center',
}));

export const searchIconStyles: SxProps<Theme> = {
  fontSize: 18,
  color: 'primary.main',
};

export const searchButtonStyles: SxProps<Theme> = {
  height: '36px',
  borderRadius: '8px',
  textTransform: 'none',
  fontWeight: 600,
};

export const RefreshButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
  borderColor: theme.palette.divider,
  textTransform: 'none',
  fontWeight: 600,
  flex: 1,
  [theme.breakpoints.up('md')]: {
    flex: 'none',
  },
}));

export const FinalizeButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.white,
  textTransform: 'none',
  fontWeight: 600,
  boxShadow: 'none',
  flex: 1,
  [theme.breakpoints.up('md')]: {
    flex: 'none',
  },
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
    boxShadow: 'none',
  },
}));

export const EntityContainer = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
}));

export const EntitySectionHeader = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1, 2),
  backgroundColor: theme.palette.grey[100],
  borderRadius: '4px 4px 0 0',
  border: `1px solid ${theme.palette.divider}`,
  borderBottom: 'none',
}));

export const EntityTitleText = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  color: theme.palette.text.primary,
}));

export const ExpandedContentBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.spacing(1),
}));

export const SubSectionWrapper = styled(Box)(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.spacing(1),
}));

export const SubSectionHeader = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1, 2),
  borderBottom: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.default,
}));

export const PostingItemBox = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  padding: theme.spacing(1.5),
  backgroundColor: theme.palette.background.default,
  borderRadius: theme.spacing(1),
  border: `1px solid ${theme.palette.grey[100]}`,
}));

export const NoColumnsBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4),
  textAlign: 'center',
  backgroundColor: theme.palette.action.hover,
  borderRadius: theme.spacing(1),
}));

import { Alert, Grid } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import SearchIcon from '@mui/icons-material/Search';

export const StyledSearchIcon = styled(SearchIcon)(({ theme }) => ({
  fontSize: 18,
  color: theme.palette.primary.main,
}));

export const SearchButton = styled(Button)({
  height: '36px',
  borderRadius: '8px',
  textTransform: 'none',
  fontWeight: 600,
});

export const MonospaceText = styled(Typography)(() => ({
  fontFamily: 'monospace',
  fontWeight: 600,
}));

export const PrimaryText = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  color: theme.palette.primary.main,
}));

export const BoldText = styled(Typography)(() => ({
  fontWeight: 600,
}));

export const VarianceText = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'amount',
})<{ amount: number }>(({ theme, amount }) => ({
  fontWeight: 600,
  color: amount < 0 ? theme.palette.error.main : theme.palette.text.primary,
}));

export const StatusChip = styled(Chip, {
  shouldForwardProp: (prop) => prop !== 'bg' && prop !== 'textColor',
})<{ bg: string; textColor: string }>(({ theme, bg, textColor }) => ({
  backgroundColor: bg,
  color: textColor,
  border: `1px solid ${theme.palette.divider}`,
}));

export const CheckCircleIcon = styled(CheckCircleOutlineIcon)(() => ({
  fontSize: '14px !important',
}));

export const ErrorIcon = styled(ErrorOutlineIcon)(() => ({
  fontSize: '14px !important',
}));

export const ReconciledChip = styled(Chip)(({ theme }) => ({
  backgroundColor: '#E8F5E9',
  color: '#2E7D32',
  border: `1px solid ${theme.palette.divider}`,
}));

export const StatusBox = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '2px',
}));

export const Variance1Chip = styled(Chip)(() => ({
  backgroundColor: '#f8fafc',
  color: '#10b981',
  fontWeight: 500,
}));

export const Variance2Chip = styled(Chip)(() => ({
  backgroundColor: '#fee2e2',
  color: '#f59e0b',
  fontWeight: 500,
}));

export const SummaryGrid = styled(Grid)(({ theme }) => ({
  marginBottom: theme.spacing(4),
}));

export const _ErrorAlert = styled(Alert)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  borderRadius: '8px',
}));

export const HoverExpandedContentBox = styled(ExpandedContentBox)(({ theme }) => ({
  backgroundColor: theme.palette.action.hover,
}));

export const LoadingWrapperBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(4),
  gap: theme.spacing(1),
}));

export const FullHeightSubSectionWrapper = styled(SubSectionWrapper)(() => ({
  height: '100%',
}));

export const SubSectionHeaderTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 800,
  color: theme.palette.primary.main,
  letterSpacing: '0.05em',
}));

export const DataRowBox = styled(Box)(({ theme }) => ({
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2),
  paddingTop: theme.spacing(1.5),
  paddingBottom: theme.spacing(1.5),
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

export const RowFlexBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  marginBottom: theme.spacing(0.5),
}));

export const EmptySectionBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4),
  textAlign: 'center',
}));

export const StyledPostingItemBox = styled(PostingItemBox)(({ theme }) => ({
  padding: theme.spacing(1.5),
  borderRadius: '8px',
  borderLeft: `4px solid ${theme.palette.warning.main}`,
  backgroundColor: theme.palette.background.paper,
  boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
}));

export const BoldPrimaryTypography = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  color: theme.palette.primary.main,
}));

export const BoldFlexTypography = styled(Typography)(() => ({
  flex: 1,
  fontWeight: 600,
}));

export const AmountValueTypography = styled(Typography)(() => ({
  width: 100,
  textAlign: 'right',
  fontWeight: 700,
}));

export const BlockCaptionTypography = styled(Typography)(() => ({
  display: 'block',
}));

export const DescTypography = styled(Typography)(({ theme }) => ({
  display: 'inline-block',
  maxWidth: '100%',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  marginTop: theme.spacing(0.5),
  fontStyle: 'italic',
}));

export const NormalSpanBox = styled('span')(({ theme }) => ({
  fontStyle: 'normal',
  fontWeight: 800,
  color: theme.palette.text.primary,
}));

export const BoldCaptionFlexTypography = styled(Typography)(() => ({
  flex: 1,
  fontWeight: 700,
}));

export const PostingListContainerBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1.5),
}));

export const RowFlexAlignCenteredBox = styled(Box)(() => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
}));

export const SemiboldTypography = styled(Typography)(() => ({
  fontWeight: 600,
}));

export const BlockCaptionMarginTypography = styled(Typography)(({ theme }) => ({
  display: 'block',
  marginTop: theme.spacing(0.5),
}));
