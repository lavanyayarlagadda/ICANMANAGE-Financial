import { styled } from '@mui/material/styles';
import React from 'react';
import { Card, Typography, Box, BoxProps } from '@mui/material';

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
})) as React.ComponentType<BoxProps & { component?: React.ElementType }>;

export const TableHeaderCell = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'align' && prop !== 'showBorderLeft',
})<{ align?: 'left' | 'right'; showBorderLeft?: boolean }>(({ theme, align, showBorderLeft }) => ({
  padding: theme.spacing(1),
  textAlign: align || 'left',
  color: theme.palette.text.secondary,
  borderBottom: `1px solid ${theme.palette.divider}`,
  borderLeft: showBorderLeft ? `1px dashed ${theme.palette.divider}` : 'none',
  fontSize: 12,
  whiteSpace: 'nowrap',
  fontWeight: 700,
})) as React.ComponentType<
  BoxProps & { align?: 'left' | 'right'; showBorderLeft?: boolean; component?: React.ElementType }
>;

export const TableRowElement = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isBoldRow',
})<{ isBoldRow?: boolean }>(({ theme, isBoldRow }) => ({
  backgroundColor: isBoldRow ? theme.palette.action.hover : 'transparent',
})) as React.ComponentType<BoxProps & { isBoldRow?: boolean; component?: React.ElementType }>;

export const TableCell = styled(Box, {
  shouldForwardProp: (prop) =>
    prop !== 'align' &&
    prop !== 'showBorderLeft' &&
    prop !== 'color' &&
    prop !== 'fontStyle' &&
    prop !== 'fontWeight' &&
    prop !== 'pl',
})<{
  align?: 'left' | 'right';
  showBorderLeft?: boolean;
  color?: string;
  fontStyle?: 'italic' | 'normal';
  fontWeight?: number | string;
  pl?: number | string;
}>(({ theme, align, showBorderLeft, color, fontStyle, fontWeight, pl }) => ({
  padding: theme.spacing(1),
  borderBottom: `1px solid ${theme.palette.divider}`,
  textAlign: align || 'left',
  borderLeft: showBorderLeft ? `1px dashed ${theme.palette.divider}` : 'none',
  color: color || 'inherit',
  fontStyle: fontStyle || 'normal',
  fontWeight: fontWeight || 'inherit',
  whiteSpace: 'nowrap',
  ...(pl !== undefined && {
    paddingLeft: theme.spacing(typeof pl === 'number' ? pl : parseFloat(pl)),
  }),
})) as React.ComponentType<
  BoxProps & {
    align?: 'left' | 'right';
    showBorderLeft?: boolean;
    color?: string;
    fontStyle?: 'italic' | 'normal';
    fontWeight?: number | string;
    pl?: number | string;
    component?: React.ElementType;
    colSpan?: number;
  }
>;
