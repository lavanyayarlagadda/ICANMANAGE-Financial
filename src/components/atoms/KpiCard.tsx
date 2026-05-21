import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';

interface KpiCardProps {
  label: string;
  value: string;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon?: React.ReactNode;
}

const KpiCard: React.FC<KpiCardProps> = ({ label, value, change, changeType = 'neutral', icon }) => {
  const theme = useTheme();

  const changeColor =
    changeType === 'positive'
      ? theme.palette.success.main
      : changeType === 'negative'
      ? theme.palette.error.main
      : theme.palette.text.secondary;

  return (
    <Card
      sx={{
        height: '100%',
        transition: 'box-shadow 0.2s ease',
        '&:hover': {
          boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
        },
      }}
    >
      <CardContent sx={{ p: { xs: 2, md: 3 }, '&:last-child': { pb: { xs: 2, md: 3 } } }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
            {label}
          </Typography>
          {icon && (
            <Box sx={{ color: theme.palette.primary.main, opacity: 0.7 }}>{icon}</Box>
          )}
        </Box>
        <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette.text.primary, mb: 0.5 }}>
          {value}
        </Typography>
        {change && (
          <Typography variant="caption" sx={{ color: changeColor, fontWeight: 500 }}>
            {change}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default KpiCard;
