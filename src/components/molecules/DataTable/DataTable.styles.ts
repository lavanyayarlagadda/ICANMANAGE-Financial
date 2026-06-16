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
  TablePagination,
  Table,
  TableSortLabel,
  Card,
  CardContent,
  Divider,
  FormControl,
  MenuItem,
  ListItemIcon,
  Checkbox,
} from '@mui/material';
import MenuBookIcon from '@mui/icons-material/MenuBook';

/* MAIN CONTAINER */
export const MainContainer = styled(Paper)(() => ({
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
  },
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
  overscrollBehavior: 'auto',

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
  scrollbarWidth: 'thin',
  scrollbarColor: `${theme.palette.grey[400]} ${theme.palette.grey[50]}`,
}));

/* ROW */
export const StyledTableRow = styled(TableRow, {
  shouldForwardProp: (prop) => prop !== 'isSelected' && prop !== 'clickable',
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
export const StyledTableCell = styled(TableCell, {
  shouldForwardProp: (prop) => prop !== 'showDivider' && prop !== 'isRowSpan',
})<{ showDivider?: boolean; isRowSpan?: boolean }>(({ theme, showDivider, isRowSpan }) => ({
  padding: '6px 12px',
  fontSize: '0.8125rem',
  color: theme.palette.text.primary,
  borderBottom: `1px solid ${theme.palette.divider}`,
  ...(showDivider && {
    borderLeft: `1px dotted ${theme.palette.divider}`,
  }),
  ...(isRowSpan && {
    verticalAlign: 'middle',
  }),
}));

/* HEADER CELL */
export const HeaderTableCell = styled(TableCell, {
  shouldForwardProp: (prop) => prop !== 'minWidth' && prop !== 'showDivider',
})<{ minWidth?: number | string; showDivider?: boolean }>(({ theme, minWidth, showDivider }) => ({
  padding: '4px 12px',
  backgroundColor: theme.palette.grey[100],
  color: theme.palette.text.secondary,
  fontWeight: 700,
  fontSize: '0.75rem',
  textTransform: 'uppercase',
  borderBottom: `1px solid ${theme.palette.divider}`,
  whiteSpace: 'nowrap',
  minWidth: minWidth,
  ...(showDivider && {
    borderLeft: `1px dotted ${theme.palette.divider}`,
  }),
}));

export const StyledTable = styled('table')(() => ({
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

export const FilterButtonBox = styled(Box)(() => ({
  display: 'flex',
  gap: 8,
}));

export const StyledTablePagination = styled(TablePagination)(({ theme }) => ({
  flexShrink: 0,
  borderTop: `1px solid ${theme.palette.divider}`,
  '& .MuiTablePagination-toolbar': {
    minHeight: 40,
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
})) as typeof TablePagination;

/* TABLE COMPONENT STYLES */
export const StyledMuiTable = styled(Table, {
  shouldForwardProp: (prop) => prop !== 'dense',
})<{ dense?: boolean }>(({ dense }) => ({
  minWidth: 'max-content',
  '& .MuiTableCell-root': {
    padding: dense ? '4px' : '8px',
    minHeight: dense ? 32 : 40,
  },
  '& .MuiTableHead-root .MuiTableCell-root': {
    paddingTop: dense ? '4px' : '8px',
    paddingBottom: dense ? '4px' : '8px',
    minHeight: dense ? 40 : 48,
  },
}));

export const StyledTableSortLabel = styled(TableSortLabel, {
  shouldForwardProp: (prop) => prop !== 'align' && prop !== 'isActive',
})<{ align?: 'left' | 'center' | 'right'; isActive?: boolean }>(({ align, isActive }) => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent:
    align === 'center' || !align ? 'center' : align === 'right' ? 'flex-end' : 'flex-start',
  '& .MuiTableSortLabel-icon': {
    opacity: isActive ? 1 : 0.3,
    marginLeft: '4px',
    marginRight: 0,
    order: 1,
  },
}));

export const LabelIconContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'align',
})<{ align?: 'left' | 'center' | 'right' }>(({ align }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  justifyContent:
    align === 'center' || !align ? 'center' : align === 'right' ? 'flex-end' : 'flex-start',
}));

export const StyledBookButton = styled(IconButton)(() => ({
  padding: '1.6px',
  marginLeft: '4px',
}));

export const StyledBookIcon = styled(MenuBookIcon)(({ theme }) => ({
  fontSize: 13,
  color: theme.palette.primary.main,
  opacity: 0.7,
}));

export const EmptyStateCell = styled(TableCell)(() => ({
  padding: 0,
}));

export const ExpandedCell = styled(TableCell)(() => ({
  padding: 0,
  border: 0,
}));

export const ExpandedContentBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: theme.palette.action.hover,
}));

/* MOBILE STYLES */
export const MobileOuterContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1.5),
}));

export const StyledMobileCard = styled(Card, {
  shouldForwardProp: (prop) => prop !== 'isSelected' && prop !== 'clickable',
})<{ isSelected?: boolean; clickable?: boolean }>(({ theme, isSelected, clickable }) => ({
  marginBottom: theme.spacing(1.5),
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: '8px',
  boxShadow: isSelected ? `0 0 0 2px ${theme.palette.primary.main}` : 'none',
  backgroundColor: isSelected ? theme.palette.grey[50] : theme.palette.background.paper,
  transition: 'all 0.2s ease',
  cursor: clickable ? 'pointer' : 'default',
}));

export const MobileCardContent = styled(CardContent)(({ theme }) => ({
  padding: theme.spacing(2),
  '&:last-child': {
    paddingBottom: theme.spacing(2),
  },
}));

export const MobileActionRow = styled(Box)(() => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '8px',
}));

export const MobileItemRow = styled(Box)(() => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  paddingTop: '6px',
  paddingBottom: '6px',
  gap: '16px',
}));

export const MobileLabelBox = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  minWidth: 100,
}));

export const MobileLabelText = styled(Typography)(() => ({
  fontWeight: 600,
}));

export const MobileValueBox = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'align',
})<{ align?: 'left' | 'center' | 'right' | 'inherit' | 'justify' }>(({ align }) => ({
  textAlign: align || 'center',
  flex: 1,
}));

export const MobileDivider = styled(Divider)(() => ({
  opacity: 0.5,
  marginTop: '2px',
  marginBottom: '2px',
}));

export const MobileExpandedContainer = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(1.5),
  paddingTop: theme.spacing(1.5),
  borderTop: `1px dashed ${theme.palette.divider}`,
}));

/* TOOLBAR EXTRAS */
export const SelectionDivider = styled(Divider)(({ theme }) => ({
  marginLeft: theme.spacing(1),
  marginRight: theme.spacing(1),
  height: 16,
  alignSelf: 'center',
}));

export const TableTitleText = styled(Typography)(() => ({
  fontWeight: 700,
}));

export const SearchBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
  alignItems: 'center',
  flexShrink: 0,
}));

export const ColumnsButton = styled(ExportButton)(() => ({
  minWidth: 0,
  paddingLeft: '8px',
  paddingRight: '8px',
}));

export const ColumnMenuPaperStyles = {
  maxHeight: 450,
  width: 260,
  display: 'flex',
  flexDirection: 'column' as const,
  borderRadius: 8,
  boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
  scrollbarWidth: 'thin' as const,
};

export const ColumnMenuHeaderBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  paddingBottom: theme.spacing(1),
  borderBottom: '1px solid',
  borderColor: theme.palette.divider,
}));

export const ColumnMenuListContainer = styled(Box)(() => ({
  flex: 1,
  overflowY: 'auto',
  paddingTop: '8px',
  paddingBottom: '8px',
  scrollbarWidth: 'thin',
  '&::-webkit-scrollbar': { width: '6px' },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: 'rgba(0,0,0,.2)',
    borderRadius: '4px',
  },
}));

export const ColumnMenuItem = styled(MenuItem)(() => ({
  paddingTop: '4px',
  paddingBottom: '4px',
  paddingLeft: '16px',
  paddingRight: '16px',
  minHeight: 36,
}));

export const ColumnListItemIcon = styled(ListItemIcon)(() => ({
  minWidth: 32,
}));

export const ColumnCheckbox = styled(Checkbox)(() => ({
  padding: '4px',
}));

export const ColumnMenuFooterBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1.5),
  borderTop: '1px solid',
  borderColor: theme.palette.divider,
  backgroundColor: theme.palette.background.default,
}));

export const ColumnMenuUpdateButton = styled(Button)(({ theme }) => ({
  textTransform: 'none',
  fontWeight: 600,
  paddingTop: theme.spacing(0.75),
  paddingBottom: theme.spacing(0.75),
}));

export const FilterContainerBox = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'customFilterContent',
})<{ customFilterContent?: boolean }>(({ theme, customFilterContent }) => ({
  display: 'flex',
  gap: theme.spacing(1.5),
  flexWrap: customFilterContent ? 'nowrap' : 'wrap',
  alignItems: 'center',
  width: '100%',
  overflowX: customFilterContent ? 'auto' : 'visible',
  paddingTop: customFilterContent ? theme.spacing(2) : 0,
  paddingBottom: customFilterContent ? theme.spacing(1) : 0,
}));

export const FilterFormControl = styled(FormControl)(() => ({
  minWidth: 160,
  maxWidth: 200,
  flexShrink: 0,
}));

export const AutocompleteListboxStyles = {
  maxHeight: 200,
  overflowY: 'auto' as const,
  scrollbarWidth: 'thin' as const,
};
