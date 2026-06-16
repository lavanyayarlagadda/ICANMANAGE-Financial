import { styled } from '@mui/material/styles';
import {
  Box,
  Typography,
  TextField,
  Select,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  FormControl,
  MenuItem,
  CircularProgress,
  Button,
  Switch,
} from '@mui/material';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import SecurityOutlinedIcon from '@mui/icons-material/SecurityOutlined';
import SearchIcon from '@mui/icons-material/Search';
import SettingsIcon from '@mui/icons-material/Settings';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import { themeConfig } from '@/theme/themeConfig';

export const StyledDialog = styled(Dialog)(() => ({
  '& .MuiDialog-paper': {
    borderRadius: 8,
    padding: 8,
  },
}));

export const StyledDialogTitle = styled(DialogTitle)(() => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  paddingBottom: 8,
}));

export const HeaderTitleContainer = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  marginBottom: 8,
}));

export const CloseIconButton = styled(IconButton)(() => ({
  marginTop: -8,
  marginRight: -8,
}));

export const StyledDialogContent = styled(DialogContent)(() => ({
  paddingTop: 16,
  paddingBottom: 16,
}));

export const StyledDialogActions = styled(DialogActions)(({ theme }) => ({
  paddingLeft: 24,
  paddingRight: 24,
  paddingBottom: 16,
  justifyContent: 'space-between',
  [theme.breakpoints.down('sm')]: {
    paddingLeft: 16,
    paddingRight: 16,
  },
}));

export const LogoImage = styled('img')(({ theme }) => ({
  height: 45,
  display: 'block',
  [theme.breakpoints.down('sm')]: {
    display: 'none',
  },
}));

export const ConfigureUserBox = styled(Box)(() => ({
  border: `1px solid ${themeConfig.colors.primaryLight}40`,
  borderRadius: 8,
  padding: 16,
  marginBottom: 24,
  backgroundColor: `${themeConfig.colors.primaryLight}10`,
}));

export const IconHeaderBox = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  marginBottom: 16,
}));

export const SectionTitle = styled(Typography)(() => ({
  color: themeConfig.colors.primary,
  fontWeight: 600,
}));

export const FormRow = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  gap: 16,
  marginBottom: 8,
}));

export const LabelTypography = styled(Typography)(() => ({
  minWidth: 80,
  fontWeight: 500,
}));

export const PanelContainer = styled(Box)(() => ({
  border: `1px solid ${themeConfig.colors.border}`,
  borderRadius: 8,
  padding: 16,
}));

export const FormFieldWrapper = styled(Box)(() => ({
  marginBottom: 24,
}));

export const FormFieldLabel = styled(Typography)(() => ({
  fontWeight: 600,
  marginBottom: 8,
}));

export const SearchField = styled(TextField)(({ theme }) => ({
  width: 250,
  backgroundColor: themeConfig.colors.surfaceSubtle,
  '& .MuiOutlinedInput-root': {
    borderRadius: 8,
  },
  [theme.breakpoints.down('sm')]: {
    width: '100%',
  },
}));

export const AccordionList = styled(Box)(() => ({
  border: `1px solid ${themeConfig.colors.border}`,
  borderRadius: 8,
  overflow: 'hidden',
}));

export const EmptyStateContainer = styled(Box)(() => ({
  padding: 32,
  textAlign: 'center',
  opacity: 0.6,
}));

export const TreeItemContainer = styled(Box, {
  shouldForwardProp: (prop) =>
    prop !== '_level' && prop !== 'isLevel0' && prop !== 'isLevel1' && prop !== 'isParentDisabled',
})<{
  _level: number;
  isLevel0: boolean;
  isLevel1: boolean;
  isParentDisabled: boolean;
}>(({ _level, isLevel0, isLevel1, isParentDisabled }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: 12,
  paddingLeft: isLevel0 ? 32 : isLevel1 ? 56 : 80,
  borderBottom: `1px solid ${themeConfig.colors.border}`,
  backgroundColor: isLevel0
    ? 'transparent'
    : isLevel1
      ? themeConfig.colors.slate[50]
      : themeConfig.colors.slate[100],
  transition: 'background-color 0.2s',
  opacity: isParentDisabled ? 0.7 : 1,
  cursor: isParentDisabled ? 'not-allowed' : 'default',
  '&:hover': {
    backgroundColor: isParentDisabled ? 'transparent' : themeConfig.colors.slate[200],
  },
  '& .MuiInputBase-root': {
    height: isLevel0 ? 32 : 28,
    fontSize: isLevel0 ? '0.85rem' : '0.8rem',
  },
}));

export const TreeText = styled(Typography, {
  shouldForwardProp: (prop) =>
    prop !== 'isLevel0' && prop !== 'isLevel1' && prop !== 'isParentDisabled',
})<{
  isLevel0: boolean;
  isLevel1: boolean;
  isParentDisabled: boolean;
}>(({ isLevel0, isLevel1, isParentDisabled }) => ({
  color: isParentDisabled
    ? 'text.disabled'
    : isLevel0
      ? themeConfig.colors.primary
      : isLevel1
        ? 'text.primary'
        : 'text.secondary',
  fontSize: isLevel0 ? '0.9rem' : isLevel1 ? '0.825rem' : '0.775rem',
  fontWeight: isLevel0 ? 700 : isLevel1 ? 600 : 500,
  wordBreak: 'break-word',
  letterSpacing: isLevel0 ? '0.01em' : 'normal',
  fontStyle: isParentDisabled ? 'italic' : 'normal',
}));

export const TreeBullet = styled(Box)(() => ({
  width: 6,
  height: 6,
  borderRadius: '50%',
  backgroundColor: themeConfig.colors.slate[300],
  flexShrink: 0,
}));

export const StyledFormControl = styled(FormControl)(({ theme }) => ({
  width: 110,
  flexShrink: 0,
  [theme.breakpoints.down('sm')]: {
    width: 100,
  },
}));

export const StatusSelect = styled(Select)(() => ({
  backgroundColor: themeConfig.colors.surface,
  '& .MuiSelect-select': {
    display: 'flex',
    alignItems: 'center',
    paddingRight: '28px !important',
  },
})) as unknown as typeof Select;

export const UserSelect = styled(Select)(() => ({
  backgroundColor: themeConfig.colors.surface,
  borderRadius: 4,
})) as unknown as typeof Select;

export const StyledPersonIcon = styled(PersonOutlineIcon)(() => ({
  color: themeConfig.colors.primary,
}));

export const StyledSecurityIcon = styled(SecurityOutlinedIcon)(() => ({
  color: themeConfig.colors.text.primary,
}));

export const StyledSearchIcon = styled(SearchIcon)(() => ({
  color: themeConfig.colors.text.secondary,
  marginRight: 8,
}));

export const CaptionSecondaryText = styled(Typography)(() => ({
  display: 'block',
}));

export const FormFieldWrapperNoMargin = styled(Box)(() => ({
  marginBottom: 0,
}));

export const StyledSettingsIcon = styled(SettingsIcon)(() => ({
  color: themeConfig.colors.text.primary,
}));

export const StyledCloseIcon = styled(CloseIcon)(() => ({
  color: themeConfig.colors.text.primary,
}));

export const StatusMenuItem = styled(MenuItem)(() => ({
  fontSize: '0.85rem',
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  '&.Mui-selected': {
    backgroundColor: themeConfig.colors.warning,
    color: '#000',
    '&:hover': {
      backgroundColor: themeConfig.colors.warning,
    },
  },
}));

export const StyledCheckIcon = styled(CheckIcon)(() => ({
  fontSize: 14,
}));

export const PanelTitle = styled(Typography)(() => ({
  fontWeight: 600,
}));

export const StyledTextField = styled(TextField)(() => ({
  marginBottom: 8,
}));

export const StyledFullWidthFormControl = styled(FormControl)(() => ({
  marginBottom: 8,
}));

export const TreeItemLabelBox = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  flex: 1,
  paddingRight: 8,
}));

export const StatusSpacer = styled(Box)(() => ({
  width: 14,
}));

export const CaptionHelperText = styled(Typography)(() => ({
  color: themeConfig.colors.primary,
  display: 'block',
}));

export const LoaderWrapper = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 16,
  paddingTop: 32,
  paddingBottom: 32,
}));

export const StyledCircularProgress = styled(CircularProgress)(() => ({
  color: 'text.secondary',
}));

export const ButtonRow = styled(Box)(() => ({
  display: 'flex',
  gap: 8,
}));

export const CancelButton = styled(Button)(() => ({
  borderColor: 'divider',
  color: 'text.primary',
}));

export const SaveButton = styled(Button)(() => ({
  backgroundColor: 'primary.main',
  '&:disabled': {
    opacity: 0.5,
    backgroundColor: 'primary.main',
  },
}));

export const ModulePanelTitle = styled(Typography)(() => ({
  fontWeight: 600,
  marginBottom: 8,
}));

export const EnableSelectionRow = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: 24,
}));

export const StyledSwitch = styled(Switch)(() => ({
  marginRight: 8,
}));

export const BoldCaptionSpan = styled(Typography)(() => ({
  fontWeight: 600,
})) as typeof Typography;

export const NavItemsHeaderBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  gap: 8,
  marginBottom: 16,
  [theme.breakpoints.up('sm')]: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
}));

export const AccordionItemRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: 12,
  paddingLeft: 16,
  [theme.breakpoints.up('sm')]: {
    padding: 16,
    paddingLeft: 40,
  },
}));

export const ModuleNameTypography = styled(Typography)(() => ({
  color: themeConfig.colors.primary,
  fontSize: '0.85rem',
  flex: 1,
  paddingRight: 8,
  wordBreak: 'break-word',
}));

export const StatusFormControl = styled(FormControl)(({ theme }) => ({
  width: 110,
  flexShrink: 0,
  [theme.breakpoints.up('sm')]: {
    width: 120,
  },
}));

export const ModuleStatusSelect = styled(Select)(() => ({
  height: 32,
  fontSize: '0.8rem',
  backgroundColor: themeConfig.colors.surface,
  '& .MuiSelect-select': {
    display: 'flex',
    alignItems: 'center',
    paddingRight: '28px !important',
  },
})) as unknown as typeof Select;

export const CheckSpacer = styled(Box)(() => ({
  width: 20,
}));

export const SubModuleRow = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'hasBorderBottom',
})<{ hasBorderBottom: boolean }>(({ theme, hasBorderBottom }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: 12,
  paddingLeft: 24,
  borderBottom: hasBorderBottom ? `1px solid ${themeConfig.colors.border}` : 'none',
  [theme.breakpoints.up('sm')]: {
    padding: 16,
    paddingLeft: 40,
  },
}));
