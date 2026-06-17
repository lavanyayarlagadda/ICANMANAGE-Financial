import { styled } from '@mui/material/styles';
import { Card, Typography, Box } from '@mui/material';

export const StyledCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  border: `1px solid ${theme.palette.divider}`,
}));

export const TitleText = styled(Typography)(() => ({
  fontWeight: 700,
}));

export const DescriptionText = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

export const TableContainer = styled(Box)(({ theme }) => ({
  overflowX: 'auto',
  maxWidth: '100%',
  '&::-webkit-scrollbar': { height: '8px' },
  '&::-webkit-scrollbar-track': { background: 'transparent' },
  '&::-webkit-scrollbar-thumb': {
    background: theme.palette.grey[300],
    borderRadius: '10px',
    '&:hover': { background: theme.palette.grey[400] },
  },
  scrollbarWidth: 'thin',
  scrollbarColor: `${theme.palette.grey[300]} transparent`,
}));

export const TableElement = styled(Box)(() => ({
  width: '100%',
  borderCollapse: 'collapse',
  minWidth: 'max-content',
})) as typeof Box;

export const TableHeaderCell = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'align',
})<{ align?: 'left' | 'right' }>(({ theme, align }) => ({
  padding: theme.spacing(1),
  textAlign: align || 'left',
  color: theme.palette.text.secondary,
  borderBottom: `1px solid ${theme.palette.divider}`,
  fontSize: 12,
  whiteSpace: 'nowrap',
  fontWeight: 700,
})) as typeof Box;

export const TableCell = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'align' && prop !== 'color' && prop !== 'fontWeight',
})<{ align?: 'left' | 'right'; color?: string; fontWeight?: number | string }>(
  ({ theme, align, color, fontWeight }) => ({
    padding: theme.spacing(1),
    textAlign: align || 'left',
    borderBottom: `1px solid ${theme.palette.divider}`,
    whiteSpace: 'nowrap',
    color: color || 'inherit',
    fontWeight: fontWeight || 'inherit',
  }),
) as typeof Box;
