import { styled } from '@mui/material/styles';
import { Box, TableRow } from '@mui/material';

export const FilterCollapseContainer = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  borderTop: `1px solid ${theme.palette.divider}`,
  padding: theme.spacing(2),
}));

export const MainContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${theme.palette.cardBorder}`,
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
}));

export const ToolbarContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: theme.spacing(2),
  flexWrap: 'wrap',
  backgroundColor: theme.palette.background.paper,
}));

export const ScrollableTableContainer = styled(Box)(({ theme }) => ({
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
    background: theme.palette.divider,
    borderRadius: '10px',
    '&:hover': {
      background: theme.palette.text.disabled,
    },
  },
}));

export const CustomTableRow = styled(TableRow, {
  shouldForwardProp: (prop) => prop !== 'clickable' && prop !== 'isSelected',
})<{ clickable?: boolean; isSelected?: boolean }>(({ theme, clickable, isSelected }) => ({
  cursor: clickable ? 'pointer' : 'default',
  transition: theme.transitions.create('background-color', { duration: theme.transitions.duration.shortest }),
  ...(isSelected && { backgroundColor: `${theme.palette.selectionBackground} !important` }),
}));

export const MobileCardContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
});
