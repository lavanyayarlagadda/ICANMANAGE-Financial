import React, { useMemo } from 'react';
import { Card, CardContent, Typography, useTheme } from '@mui/material';
import * as styles from './SummaryCard.styles';

interface SummaryCardProps {
  title: string;
  value: string;
  subtitle?: string;
  variant?: 'default' | 'highlight' | 'negative' | 'positive';
  backgroundColor?: string;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ title, value, subtitle, variant = 'default', backgroundColor }) => {
  const theme = useTheme();

  const defaultBg = useMemo(() => {
    switch (variant) {
      case 'highlight': return `${theme.palette.primary.main}08`;
      case 'negative': return `${theme.palette.error.main}08`;
      case 'positive': return  `#f0fdf4`;
      
      default: return theme.palette.background.paper;
    }
  }, [variant, theme]);

  const valueColor = useMemo(() => 
    variant === 'negative' ? theme.palette.error.main  : variant === 'positive'
      ? `#f0fdf4` : theme.palette.text.primary,
    [variant, theme]
  );


  return (
    <Card sx={styles.cardStyles(backgroundColor, defaultBg)}>
      <CardContent sx={styles.cardContentStyles}>
        <Typography variant="caption" color="text.secondary" sx={styles.titleStyles}>
          {title}
        </Typography>
        <Typography variant="h5" sx={styles.valueStyles(valueColor, !!subtitle)}>
          {value}
        </Typography>
        {subtitle && (
          <Typography variant="caption" color="text.secondary" sx={styles.subtitleStyles}>
            {subtitle}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default SummaryCard;
