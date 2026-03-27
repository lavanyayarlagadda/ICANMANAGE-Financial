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
}));

/* LEFT SECTION */
export const ToolbarLeft = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  flexWrap: 'wrap',
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
  flexWrap: 'wrap',
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
  minWidth: isMobile ? '100%' : 240,
}));

/* ICON BUTTON (FILTER) */
export const FilterButton = styled(IconButton)(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: 6,
}));

/* ACTION GROUP */
export const ActionGroup = styled(Box)(() => ({
  display: 'flex',
  gap: 8,
}));

/* EXPORT BUTTON */
export const ExportButton = styled(Button)(() => ({
  textTransform: 'none',
}));

/* FILTER WRAPPER */
export const FilterWrapper = styled(Box)(() => ({
  display: 'flex',
  gap: 12,
  flexWrap: 'wrap',
  paddingTop: 4,
}));

/* FORM CONTROL WRAPPER */
export const FilterControl = styled(Box)(() => ({
  minWidth: 140,
}));
/* TOOLBAR */
export const ToolbarContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(0.5, 1.5),
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(0.5),
  borderBottom: `1px solid ${theme.palette.divider}`, // ✅ FIXED
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
    width: '0px',
    height: '0px',
  },
  '&::-webkit-scrollbar-track': {
    background: 'transparent',
  },
  '&::-webkit-scrollbar-thumb': {
    background: '#bdbdbd',
    borderRadius: '10px',
    '&:hover': {
      background: '#9e9e9e',
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

  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },

  ...(isSelected && {
    backgroundColor: '#F4F9FF !important',
  }),
}));

/* CELL */
export const StyledTableCell = styled(TableCell)(({ theme }) => ({
  padding: '6px 12px',
  fontSize: '0.8125rem',
  color: theme.palette.text.primary,
  borderBottom: `1px solid ${theme.palette.divider}`, // ✅ FIXED
}));

/* HEADER CELL */
export const HeaderTableCell = styled(TableCell)(({ theme }) => ({
  padding: '4px 12px',
  backgroundColor: '#f1f5f9',
  color: '#475569',
  fontWeight: 700,
  fontSize: '0.75rem',
  textTransform: 'uppercase',
  borderBottom: `1px solid ${theme.palette.divider}`, // ✅ FIXED
  whiteSpace: 'nowrap',
}));

/* TABLE (NEW) */
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

/* FILTER BUTTON */
export const FilterButtonBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: 8,
}));