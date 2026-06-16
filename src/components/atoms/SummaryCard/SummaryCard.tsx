import React, { useMemo } from 'react';
import { useTheme } from '@mui/material';
import * as styles from './SummaryCard.styles';

interface SummaryCardProps {
  title: string;
  value: string;
  subtitle?: string;
  variant?: 'default' | 'highlight' | 'negative' | 'positive';
  backgroundColor?: string;
}

const SummaryCard: React.FC<SummaryCardProps> = ({
  title,
  value,
  subtitle,
  variant = 'default',
  backgroundColor,
}) => {
  const theme = useTheme();

  const defaultBg = useMemo(() => {
    switch (variant) {
      case 'highlight':
        return theme.palette.grey[50];
      case 'negative':
        return theme.palette.error.light;
      case 'positive':
        return theme.palette.success.light;
      default:
        return theme.palette.background.paper;
    }
  }, [variant, theme]);

  const valueColor = useMemo(
    () =>
      variant === 'negative'
        ? theme.palette.error.main
        : variant === 'positive'
          ? theme.palette.success.main
          : theme.palette.text.primary,
    [variant, theme],
  );

  return (
    <styles.StyledCard customBg={backgroundColor} defaultBg={defaultBg}>
      <styles.StyledCardContent>
        <styles.TitleTypography variant="caption" color="text.secondary">
          {title}
        </styles.TitleTypography>
        <styles.ValueTypography variant="h5" valueColor={valueColor} hasSubtitle={!!subtitle}>
          {value}
        </styles.ValueTypography>
        {subtitle && (
          <styles.SubtitleTypography variant="caption" color="text.secondary">
            {subtitle}
          </styles.SubtitleTypography>
        )}
      </styles.StyledCardContent>
    </styles.StyledCard>
  );
};

export default SummaryCard;
