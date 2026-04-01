import React, { useMemo } from 'react';
import { Chip, type ChipProps } from '@mui/material';
import { getStatusKey } from '@/utils/formatters';
import { statusColorMap } from './StatusBadge.styles';

interface StatusBadgeProps {
  status: string | null | undefined;
  size?: ChipProps['size'];
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'small' }) => {
  const colors = useMemo(() => {
    const key = getStatusKey(status);
    return statusColorMap[key] || { bg: '#F5F5F5', text: '#616161' };
  }, [status]);
        if (!status) return null;

  return (
    <Chip
      label={status}
      size={size}
      sx={{
        backgroundColor: colors.bg,
        color: colors.text,
        fontWeight: 600,
        fontSize: '0.7rem',
        height: size === 'small' ? 24 : 28,
        borderRadius: 1,
      }}
    />
  );
};

export default StatusBadge;
