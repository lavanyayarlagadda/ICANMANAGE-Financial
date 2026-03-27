import React, { useMemo } from 'react';
import { Card, CardContent, Typography, Box, useTheme } from '@mui/material';
import * as styles from './KpiCard.styles';

interface KpiCardProps {
  label: string;
  value: string;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon?: React.ReactNode;
}

const KpiCard: React.FC<KpiCardProps> = ({ label, value, change, changeType = 'neutral', icon }) => {
  const theme = useTheme();

  const changeColor = useMemo(() => {
    switch (changeType) {
      case 'positive': return theme.palette.success.main;
      case 'negative': return theme.palette.error.main;
      default: return theme.palette.text.secondary;
    }
  }, [changeType, theme]);

  return (
    <Card sx={styles.cardStyles}>
      <CardContent sx={styles.cardContentStyles}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Typography variant="caption" color="text.secondary" sx={styles.labelStyles}>
            {label}
          </Typography>
          {icon && (
            <Box sx={{ color: theme.palette.primary.main, opacity: 0.7 }}>{icon}</Box>
          )}
        </Box>
        <Typography variant="h4" color="text.primary" sx={styles.valueStyles}>
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
