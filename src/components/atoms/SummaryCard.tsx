import React from 'react';
import { Card, CardContent, Typography, Box, useTheme } from '@mui/material';

interface SummaryCardProps {
  title: string;
  value: string;
  variant?: 'default' | 'highlight' | 'negative';
}

const SummaryCard: React.FC<SummaryCardProps> = ({ title, value, variant = 'default' }) => {
  const theme = useTheme();

  const bgColor =
    variant === 'highlight'
      ? `${theme.palette.primary.main}08`
      : variant === 'negative'
      ? `${theme.palette.error.main}08`
      : theme.palette.background.paper;

  const valueColor =
    variant === 'negative' ? theme.palette.error.main : theme.palette.text.primary;

  return (
    <Card sx={{ backgroundColor: bgColor, height: '100%' }}>
      <CardContent sx={{ p: { xs: 2, md: 3 }, '&:last-child': { pb: { xs: 2, md: 3 } }, textAlign: 'center' }}>
        <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600, mb: 1, display: 'block' }}>
          {title}
        </Typography>
        <Typography variant="h5" sx={{ fontWeight: 700, color: valueColor }}>
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default SummaryCard;
