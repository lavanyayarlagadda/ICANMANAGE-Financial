import { styled } from '@mui/material/styles';
import {
  Box,
  TextField,
  Typography,
  Chip,
  Grid,
  Button,
  IconButton,
  DialogTitle,
  DialogContent,
  DialogActions,
  ToggleButtonGroup,
} from '@mui/material';
import { themeConfig } from '@/theme/themeConfig';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SettingsIcon from '@mui/icons-material/Settings';
import SearchIcon from '@mui/icons-material/Search';

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

export const FilterField = styled(TextField)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  flex: '0 0 150px',
  width: 150,
  minWidth: 120,
  '& .MuiOutlinedInput-root': {
    height: 36,
    fontSize: '13px',
  },
}));

export const ModalTitle = styled(DialogTitle)(() => ({
  fontWeight: 700,
  paddingLeft: '24px',
  paddingRight: '24px',
  paddingTop: '24px',
}));

export const ModalContent = styled(DialogContent)(() => ({
  paddingLeft: '24px',
  paddingRight: '24px',
}));

export const ModalInnerWrapper = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(2),
}));

export const ModalHeaderGrid = styled(Box)(() => ({
  display: 'grid',
  gridTemplateColumns: '1.2fr 1.5fr 0.8fr 0.5fr',
  marginBottom: '16px',
  paddingBottom: '8px',
  borderBottom: '1px solid',
  borderBottomColor: 'divider',
}));

export const ModalHeaderText = styled(Typography)(() => ({
  fontWeight: 700,
  color: 'text.secondary',
}));

export const ModalHeaderCenterText = styled(ModalHeaderText)(() => ({
  textAlign: 'center',
}));

export const ModalHeaderRightText = styled(ModalHeaderText)(() => ({
  textAlign: 'right',
}));

export const ModalListContainer = styled(Box)(() => ({
  marginBottom: '32px',
}));

export const ModalRowGrid = styled(Box)(() => ({
  display: 'grid',
  gridTemplateColumns: '1.2fr 1.5fr 0.8fr 0.5fr',
  paddingTop: '12px',
  paddingBottom: '12px',
  borderBottom: '1px solid',
  borderBottomColor: 'divider',
  alignItems: 'center',
}));

export const ModalRowKeyText = styled(Typography)(() => ({
  fontWeight: 600,
  color: 'text.secondary',
  fontSize: '12px',
}));

export const ModalRowLabelText = styled(Typography)(() => ({
  fontWeight: 500,
  color: 'text.primary',
}));

export const ModalRowCenterBox = styled(Box)(() => ({
  display: 'flex',
  justifyContent: 'center',
}));

export const ModalRowChip = styled(Chip, {
  shouldForwardProp: (prop) => prop !== 'bg' && prop !== 'textColor',
})<{ bg: string; textColor: string }>(({ bg, textColor }) => ({
  height: 20,
  fontSize: '10px',
  fontWeight: 700,
  backgroundColor: bg,
  color: textColor,
  border: `1px solid ${textColor}20`,
}));

export const ModalRowActionsBox = styled(Box)(() => ({
  display: 'flex',
  justifyContent: 'flex-end',
  gap: '4px',
}));

export const DisabledIconButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.text.disabled,
}));

export const SmallEditIcon = styled(EditIcon)(() => ({
  fontSize: 16,
}));

export const SmallDeleteIcon = styled(DeleteIcon)(() => ({
  fontSize: 16,
}));

export const SmallSettingsIcon = styled(SettingsIcon)(() => ({
  fontSize: 16,
}));

export const ModalSectionTitleText = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  marginBottom: theme.spacing(2),
  marginTop: theme.spacing(3),
}));

export const ModalActions = styled(DialogActions)(({ theme }) => ({
  paddingLeft: theme.spacing(3),
  paddingRight: theme.spacing(3),
  paddingBottom: theme.spacing(2),
  marginTop: theme.spacing(2),
}));

export const ModalCancelButton = styled(Button)(({ theme }) => ({
  color: theme.palette.text.secondary,
}));

export const AccountChip = styled(Chip, {
  shouldForwardProp: (prop) => prop !== 'bg' && prop !== 'textColor',
})<{ bg?: string; textColor?: string }>(({ bg, textColor }) => ({
  backgroundColor: bg || themeConfig.colors.surfaceAlt,
  color: textColor || themeConfig.colors.text.secondary,
  fontWeight: 600,
  fontSize: '11px',
  width: 'fit-content',
  height: 24,
}));

export const ItemCountText = styled(Typography)(({ theme }) => ({
  fontSize: '12px',
  color: theme.palette.primary.main,
  fontWeight: 600,
}));

export const AmountText = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'isTotal',
})<{ isTotal: boolean }>(({ isTotal }) => ({
  fontSize: '13px',
  fontWeight: isTotal ? 700 : 500,
}));

export const EmptyAmountText = styled(Typography)(({ theme }) => ({
  fontSize: '13px',
  color: theme.palette.text.secondary,
}));

export const NormalText = styled(Typography)(() => ({
  fontSize: '13px',
  fontWeight: 600,
}));

export const ScreenWrapperBox = styled(Box)(() => ({
  padding: 0,
}));

export const SearchWrapper = styled(Box)(() => ({
  display: 'flex',
  gap: '8px',
  alignItems: 'center',
}));

export const StyledSearchIcon = styled(SearchIcon)(({ theme }) => ({
  fontSize: 18,
  color: theme.palette.primary.main,
}));

export const SearchButton = styled(Button)(() => ({
  height: '36px',
  borderRadius: '8px',
  textTransform: 'none',
  fontWeight: 600,
  paddingLeft: '16px',
  paddingRight: '16px',
}));

export const ScreenHeaderBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  marginBottom: theme.spacing(3),
}));

export const ScreenHeaderTitleText = styled(Typography)(() => ({
  fontWeight: 700,
}));

export const ScreenHeaderRightBox = styled(Box)(() => ({
  display: 'flex',
  gap: '16px',
  alignItems: 'center',
}));

export const SummaryGrid = styled(Grid)(({ theme }) => ({
  marginBottom: theme.spacing(4),
}));

export const StyledToggleButtonGroup = styled(ToggleButtonGroup)(() => ({
  '& .MuiToggleButton-root': {
    paddingLeft: '16px',
    paddingRight: '16px',
    paddingTop: '4px',
    paddingBottom: '4px',
    textTransform: 'none',
    fontWeight: 600,
    fontSize: '12px',
    color: themeConfig.colors.text.secondary,
    borderRadius: '6px !important',
    border: `1px solid ${themeConfig.colors.border}`,
    marginLeft: '8px !important',
    '&.Mui-selected': {
      backgroundColor: themeConfig.colors.tabActive,
      color: themeConfig.colors.surface,
      border: 'none',
      '&:hover': { backgroundColor: themeConfig.colors.primaryDark },
    },
  },
}));
