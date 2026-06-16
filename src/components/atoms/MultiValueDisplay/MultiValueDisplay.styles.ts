import { styled } from '@mui/material/styles';
import {
  Box,
  Chip,
  List,
  Stack,
  Typography,
  TextField,
  IconButton,
  ListItemText,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import SearchIcon from '@mui/icons-material/Search';
import { themeConfig } from '@/theme/themeConfig';

export const ContainerBox = styled(Box)(() => ({
  paddingTop: '4px',
  paddingBottom: '4px',
}));

export const StyledStack = styled(Stack)(() => ({
  gap: '4px', // gap: 0.5
}));

export const StyledChip = styled(Chip, {
  shouldForwardProp: (prop) => prop !== 'maxwidth',
})<{ maxwidth: number | string }>(({ theme, maxwidth }) => ({
  height: 22,
  fontSize: 11,
  backgroundColor: theme.palette.action.hover,
  borderColor: theme.palette.divider,
  '&:hover': { backgroundColor: theme.palette.action.selected },
  maxWidth: maxwidth,
  '& .MuiChip-label': {
    paddingLeft: '8px',
    paddingRight: '8px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
}));

export const CopyIconSmall = styled(ContentCopyIcon)(() => ({
  fontSize: '10px !important',
}));

export const InlineFlexBox = styled(Box)(() => ({
  display: 'inline-flex',
}));

export const MoreChip = styled(Chip)(({ theme }) => ({
  height: 22,
  fontSize: 10,
  fontWeight: 600,
  color: theme.palette.primary.main,
  backgroundColor: themeConfig.colors.surfaceInfo,
  border: `1px solid ${theme.palette.primary.light}`,
  '&:hover': { backgroundColor: themeConfig.colors.surfaceInfoHover },
}));

export const PopoverPaperProps = {
  width: 280,
  maxHeight: 400,
  borderRadius: 8, // borderRadius: 2 in theme is usually 8px
  boxShadow: themeConfig.shadows.dropdown,
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
};

export const PopoverHeader = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1.5),
  backgroundColor:
    (theme.palette.primary as unknown as Record<number, string | undefined>)[50] || '#f0f7ff',
  borderBottom: '1px solid',
  borderColor: theme.palette.divider,
}));

export const PopoverTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  marginBottom: theme.spacing(1),
  color: theme.palette.primary.main,
  fontSize: 13,
}));

export const SearchTextField = styled(TextField)(({ theme }) => ({
  '& .MuiInputBase-root': {
    height: 32,
    fontSize: 13,
    backgroundColor: theme.palette.background.paper,
  },
}));

export const SearchIconStyled = styled(SearchIcon)(({ theme }) => ({
  fontSize: 16,
  color: theme.palette.text.secondary,
}));

export const StyledList = styled(List)(() => ({
  paddingTop: 0,
  overflowY: 'auto',
  flex: 1,
  padding: '4px', // p: 0.5
}));

export const CopyIconButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.text.secondary,
  '&:hover': {
    color: theme.palette.primary.main,
  },
}));

export const CopyIconNormal = styled(ContentCopyIcon)(() => ({
  fontSize: 16,
}));

export const ListItemTextStyled = styled(ListItemText)(({ theme }) => ({
  '& .MuiListItemText-primary': {
    fontSize: 13,
    fontWeight: 500,
    fontFamily: 'monospace',
    paddingTop: theme.spacing(0.5),
    paddingBottom: theme.spacing(0.5),
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
  },
}));

export const EmptyStateBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  textAlign: 'center',
}));
