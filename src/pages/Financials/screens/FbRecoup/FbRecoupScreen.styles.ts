import { SxProps, Theme } from '@mui/material';
import { styled } from '@mui/material/styles';
import { themeConfig } from '@/theme/themeConfig';

import {
  Box,
  Typography,
  Chip,
  Alert,
  Grid,
  Button,
  FormControl,
  IconButton,
  InputAdornment,
  TextField,
} from '@mui/material';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import SearchIcon from '@mui/icons-material/Search';

export const offsetChipStyles: SxProps<Theme> = {
  height: 20,
  fontSize: '10px',
  fontWeight: 700,
  bgcolor: themeConfig.colors.accent + '18',
  color: themeConfig.colors.accentDark,
  border: `1px solid ${themeConfig.colors.accent + '33'}`,
};

export const noticeIdStyles: SxProps<Theme> = {
  fontWeight: 700,
  color: themeConfig.colors.primaryDark,
};

export const boldStyles: SxProps<Theme> = {
  fontWeight: 700,
};

export const errorAmountStyles: SxProps<Theme> = {
  fontWeight: 700,
  color: 'error.main',
};

export const toggleButtonGroupStyles: SxProps<Theme> = {
  '& .MuiToggleButton-root': {
    px: 2,
    py: 0.5,
    textTransform: 'none',
    fontWeight: 600,
    fontSize: '12px',
    color: themeConfig.colors.text.secondary,
    borderRadius: '6px !important',
    border: `1px solid ${themeConfig.colors.border}`,
    ml: '8px !important',
    '&.Mui-selected': {
      bgcolor: themeConfig.colors.tabActive,
      color: themeConfig.colors.surface,
      border: 'none',
      '&:hover': { bgcolor: themeConfig.colors.primaryDark },
    },
  },
};

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

export const OffsetGridRow = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '1.5fr 1fr 1.2fr 1fr',
  minWidth: '100%',
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2),
  paddingTop: theme.spacing(1),
  paddingBottom: theme.spacing(1),
}));

export const FilesSectionWrapperBox = styled(Box)(() => ({
  width: '75%',
}));

export const FilesSectionTitleText = styled(Typography)(() => ({
  fontWeight: 700,
  marginBottom: '8px',
  color: 'text.primary',
  textAlign: 'left',
}));

export const FilesContainerBox = styled(Box)(() => ({
  border: `1px solid ${themeConfig.colors.divider}`,
  borderRadius: '4px',
  maxHeight: 250,
  overflowY: 'auto',
  overflowX: 'hidden',
}));

export const FilesHeaderGridBox = styled(OffsetGridRow)(() => ({
  background: '#e4f0fa',
  borderBottom: `1px solid ${themeConfig.colors.divider}`,
  position: 'sticky',
  top: 0,
  zIndex: 1,
}));

export const FilesRowGridBox = styled(OffsetGridRow, {
  shouldForwardProp: (prop) => prop !== 'isLast',
})<{ isLast: boolean }>(({ isLast }) => ({
  borderBottom: isLast ? 'none' : `1px solid ${themeConfig.colors.divider}`,
  alignItems: 'center',
}));

export const FlexCenterBox = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

export const FileLinkTextTypography = styled(Typography)(() => ({
  fontWeight: 600,
  display: 'flex',
  alignItems: 'center',
}));

export const LeftMarginFileIcon = styled(InsertDriveFileOutlinedIcon)(() => ({
  fontSize: 16,
  marginRight: '4px',
}));

export const FontWeight500Typography = styled(Typography)(() => ({
  fontWeight: 500,
}));

export const BoldTextTypography = styled(Typography)(() => ({
  fontWeight: 700,
}));

export const BoldText500Typography = styled(Typography)(() => ({
  fontWeight: 500,
}));

export const AmountTypography = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'amount',
})<{ amount: number }>(({ theme, amount }) => ({
  fontWeight: 700,
  color: amount < 0 ? theme.palette.error.main : theme.palette.text.primary,
}));

export const SuspenseBalanceTypography = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'balance',
})<{ balance: number }>(({ theme, balance }) => ({
  fontWeight: 700,
  color: balance > 0 ? theme.palette.primary.main : theme.palette.text.secondary,
}));

export const TypeChip = styled(Chip, {
  shouldForwardProp: (prop) => prop !== 'bg' && prop !== 'textColor',
})<{ bg: string; textColor: string }>(({ bg, textColor }) => ({
  backgroundColor: bg,
  color: textColor,
  fontWeight: 700,
  fontSize: '10px',
}));

export const ScreenHeaderBox = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(3),
}));

export const ScreenHeaderTitleText = styled(Typography)(() => ({
  fontWeight: 700,
}));

export const SummaryGrid = styled(Grid)(({ theme }) => ({
  marginBottom: theme.spacing(4),
}));

export const SearchWrapper = styled(Box)(() => ({
  display: 'flex',
  gap: '8px',
  alignItems: 'center',
}));

export const SearchIconStyled = styled(SearchIcon)(({ theme }) => ({
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

export const EmptyEraBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  textAlign: 'center',
}));

export const FilterFormControl = styled(FormControl)(() => ({
  minWidth: 160,
  maxWidth: 200,
  flexShrink: 0,
}));

export const FilterIconButton = styled(IconButton)(() => ({
  padding: '4px',
}));

export const FilterTextField = styled(TextField)(() => ({
  '& .MuiOutlinedInput-root': {
    paddingRight: '4px',
    '& .MuiOutlinedInput-input': {
      paddingTop: '8.5px',
      paddingBottom: '8.5px',
    },
  },
}));

export const _ErrorAlert = styled(Alert)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  borderRadius: '8px',
}));

export const AdornmentBox = styled(InputAdornment)(() => ({
  margin: 0,
  padding: 0,
}));
