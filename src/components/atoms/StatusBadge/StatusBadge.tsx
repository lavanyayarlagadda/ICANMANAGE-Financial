import React, { useMemo } from 'react';
import { type ChipProps } from '@mui/material';
import { getStatusKey } from '@/utils/formatters';
import { themeConfig } from '@/theme/themeConfig';
import * as styles from './StatusBadge.styles';

interface StatusBadgeProps {
  status: string | null | undefined;
  size?: ChipProps['size'];
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'small' }) => {
  const colors = useMemo(() => {
    const key = getStatusKey(status);
    return (
      styles.statusColorMap[key] || {
        bg: themeConfig.colors.slate[100],
        text: themeConfig.colors.slate[500],
      }
    );
  }, [status]);

  if (!status) return null;

  return (
    <styles.StyledChip label={status} size={size} customBg={colors.bg} customColor={colors.text} />
  );
};

export default StatusBadge;
