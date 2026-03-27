import { styled } from '@mui/material/styles';
import { Box, Paper, TableContainer, TableRow, TableCell } from '@mui/material';

export const MainContainer = styled(Paper)(({ theme }) => ({
  width: '100%',
  maxWidth: '100%',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
}));

export const ToolbarContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(0.5, 1.5),
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(0.5),
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

export const SelectionToolbar = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  marginBottom: theme.spacing(1),
  flexWrap: 'wrap',
}));

export const MainToolbarActions = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isMobile',
})<{ isMobile?: boolean }>(({ theme, isMobile }) => ({
  display: 'flex',
  flexDirection: isMobile ? 'column' : 'row',
  alignItems: isMobile ? 'flex-start' : 'center',
  gap: theme.spacing(1.5),
  width: '100%',
  justifyContent: 'space-between',
}));

export const SearchFieldContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isMobile',
})<{ isMobile?: boolean }>(({ theme, isMobile }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  marginLeft: isMobile ? 0 : 'auto',
  width: isMobile ? '100%' : 'auto',
  flexWrap: 'wrap',
}));

export const ScrollableTableContainer = styled(TableContainer)({
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
});

export const StickyHeaderCell = styled(TableCell)(({ theme }) => ({
  whiteSpace: 'nowrap',
}));

export const CustomTableRow = styled(TableRow, {
  shouldForwardProp: (prop) => prop !== 'clickable' && prop !== 'isSelected',
})<{ clickable?: boolean; isSelected?: boolean }>(({ theme, clickable, isSelected }) => ({
  cursor: clickable ? 'pointer' : 'default',
  ...(isSelected && { backgroundColor: `${theme.palette.selectionBackground} !important` }),
}));

export const MobileCardContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
});

export const FilterCollapseContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1.5),
  flexWrap: 'wrap',
  paddingTop: theme.spacing(0.5),
}));
