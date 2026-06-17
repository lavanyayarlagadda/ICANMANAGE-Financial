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
  marginBottom: theme.spacing(0.6 / 8), // mb: 0.6 is 0.6 * 8px = 4.8px
}));

export const HeadlineText = styled(Typography)(() => ({
  fontWeight: 700,
}));

export const TableContainer = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(2),
  overflowX: 'auto',
}));

export const TableElement = styled(Box)(() => ({
  width: '100%',
  borderCollapse: 'collapse',
  minWidth: 700,
})) as typeof Box;

export const TableHeaderCell = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'align',
})<{ align?: 'left' | 'right' }>(({ theme, align }) => ({
  padding: theme.spacing(1),
  textAlign: align || 'left',
  color: theme.palette.text.secondary,
  borderBottom: `1px solid ${theme.palette.divider}`,
  fontSize: 12,
  fontWeight: 700,
})) as typeof Box;

export const TableCell = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'align',
})<{ align?: 'left' | 'right' }>(({ theme, align }) => ({
  padding: theme.spacing(1),
  textAlign: align || 'left',
  borderBottom: `1px solid ${theme.palette.divider}`,
})) as typeof Box;

export const ProgressBarContainer = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.action.hover,
  borderRadius: theme.spacing(0.25), // borderRadius: 2 is 8px
  height: 10,
}));

export const ProgressBar = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'percent' && prop !== 'barColor',
})<{ percent: number; barColor: string }>(({ theme, percent, barColor }) => ({
  width: `${Math.max(8, percent)}%`,
  height: '100%',
  borderRadius: theme.spacing(0.25),
  backgroundColor: barColor,
}));
