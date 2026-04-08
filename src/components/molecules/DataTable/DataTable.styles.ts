import { styled } from '@mui/material/styles';
import {
  Paper,
  Box,
  TableContainer,
  TableRow,
  TableCell,
  Typography,
  TextField,
  IconButton,
  Button,
  Link,
} from '@mui/material';

/* MAIN CONTAINER */
export const MainContainer = styled(Paper)(({ theme }) => ({
  width: '100%',
  maxWidth: '100%',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
}));

export const ToolbarRow = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isMobile',
})<{ isMobile?: boolean }>(({ isMobile }) => ({
  display: 'flex',
  flexDirection: isMobile ? 'column' : 'row',
  alignItems: isMobile ? 'flex-start' : 'center',
  gap: 12,
  width: '100%',
  justifyContent: 'space-between',
  paddingBottom: 4,
}));

/* LEFT SECTION */
export const ToolbarLeft = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  flexShrink: 0,
}));

/* RIGHT SECTION */
export const ToolbarRight = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isMobile',
})<{ isMobile?: boolean }>(({ isMobile }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  marginLeft: isMobile ? 0 : 'auto',
  width: isMobile ? '100%' : 'auto',
  flexWrap: 'nowrap', // Force single line
  justifyContent: isMobile ? 'flex-start' : 'flex-end',
}));

/* SELECTION BAR */
export const SelectionBar = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  marginBottom: 8,
  flexWrap: 'wrap',
}));

/* RECORD TEXT */
export const RecordsText = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  whiteSpace: 'nowrap',
}));

/* LINK */
export const ActionLink = styled(Link)(() => ({
  marginLeft: 8,
  cursor: 'pointer',
  textDecoration: 'none',
}));

/* SEARCH FIELD */
export const SearchField = styled(TextField, {
  shouldForwardProp: (prop) => prop !== 'isMobile',
})<{ isMobile?: boolean }>(({ isMobile }) => ({
  minWidth: isMobile ? '100%' : 200,
  maxWidth: isMobile ? '100%' : 300,
  flex: isMobile ? 1 : 'unset',
  order: isMobile ? 1 : 0,
  '& .MuiInputBase-root': {
    height: 32,
    fontSize: '0.8125rem',
  }
}));

/* ICON BUTTON (FILTER) */
export const FilterButton = styled(IconButton)(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: 6,
  height: 32,
  width: 32,
}));

/* ACTION GROUP */
export const ActionGroup = styled(Box)(() => ({
  display: 'flex',
  gap: 8,
  flexShrink: 0,
}));

/* EXPORT BUTTON */
export const ExportButton = styled(Button)(() => ({
  textTransform: 'none',
  height: 32,
  fontSize: '0.8125rem',
}));

/* FILTER WRAPPER */
export const FilterWrapper = styled(Box)(() => ({
  display: 'flex',
  gap: 12,
  flexWrap: 'wrap',
  paddingTop: 8,
  paddingBottom: 8,
}));

/* FORM CONTROL WRAPPER */
export const FilterControl = styled(Box)(() => ({
  minWidth: 140,
}));

/* TOOLBAR CONTAINER */
export const ToolbarContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(0.75, 1.5),
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(0.5),
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

/* TABLE SCROLL */
export const ScrollableTableContainer = styled(TableContainer)(({ theme }) => ({
  flex: 1,
  minHeight: 0,
  maxHeight: 'calc(100vh - 240px)',
  overflowX: 'auto',
  overflowY: 'auto',
  overscrollBehavior: 'contain',

  '&::-webkit-scrollbar': {
    width: '6px',
    height: '6px',
  },
  '&::-webkit-scrollbar-track': {
    background: 'transparent',
  },
  '&::-webkit-scrollbar-thumb': {
    background: theme.palette.grey[300],
    borderRadius: '10px',
    '&:hover': {
      background: theme.palette.grey[400],
    },
  },
}));

/* ROW */
export const StyledTableRow = styled(TableRow, {
  shouldForwardProp: (prop) =>
    prop !== 'isSelected' && prop !== 'clickable',
})<{
  isSelected?: boolean;
  clickable?: boolean;
}>(({ theme, isSelected, clickable }) => ({
  cursor: clickable ? 'pointer' : 'default',
  height: '32px',

  ...(isSelected && {
    backgroundColor: theme.palette.action.selected + ' !important',
  }),
}));

/* CELL */
export const StyledTableCell = styled(TableCell)(({ theme }) => ({
  padding: '6px 12px',
  fontSize: '0.8125rem',
  color: theme.palette.text.primary,
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

/* HEADER CELL */
export const HeaderTableCell = styled(TableCell)(({ theme }) => ({
  padding: '4px 12px',
  backgroundColor: theme.palette.grey[100],
  color: theme.palette.text.secondary,
  fontWeight: 700,
  fontSize: '0.75rem',
  textTransform: 'uppercase',
  borderBottom: `1px solid ${theme.palette.divider}`,
  whiteSpace: 'nowrap',
}));

export const StyledTable = styled('table')(({ theme }) => ({
  width: '100%',
  borderCollapse: 'collapse',
}));

/* PAGINATION WRAPPER */
export const PaginationContainer = styled(Box)(({ theme }) => ({
  flexShrink: 0,
  borderTop: `1px solid ${theme.palette.divider}`,
}));

/* CARD (MOBILE) */
export const MobileCard = styled(Paper)(({ theme }) => ({
  marginBottom: theme.spacing(1.5),
  border: `1px solid ${theme.palette.divider}`,
  boxShadow: 'none',
}));

export const FilterButtonBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: 8,
}));