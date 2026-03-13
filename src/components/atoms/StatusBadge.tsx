import React from 'react';
import { Chip, type ChipProps } from '@mui/material';
import { themeConfig } from '@/theme/themeConfig';
import { getStatusKey } from '@/utils/formatters';

interface StatusBadgeProps {
  status: string;
  size?: ChipProps['size'];
}

const statusColorMap: Record<string, { bg: string; text: string }> = {
  posted: themeConfig.status.posted,
  completed: themeConfig.status.completed,
  reconciled: themeConfig.status.reconciled,
  needsreview: themeConfig.status.needsReview,
  pendingreview: themeConfig.status.pendingReview,
  match: themeConfig.status.match,
  improving: themeConfig.status.improving,
  growing: themeConfig.status.growing,
  decreasing: themeConfig.status.decreasing,
  open: { bg: '#FFF3E0', text: '#E65100' },
  closed: { bg: '#E8F5E9', text: '#2E7D32' },
  approved: { bg: '#E3F2FD', text: '#1565C0' },
  disputed: { bg: '#FFEBEE', text: '#C62828' },
  pending: { bg: '#FFF8E1', text: '#F57F17' },
  recovered: { bg: '#E8F5E9', text: '#2E7D32' },
  partial: { bg: '#FFF3E0', text: '#E65100' },
  writtenoff: { bg: '#ECEFF1', text: '#546E7A' },
  applied: { bg: '#E3F2FD', text: '#1565C0' },
  reversed: { bg: '#F3E5F5', text: '#7B1FA2' },
  underreview: { bg: '#FFF8E1', text: '#F57F17' },
  stable: { bg: '#F0FDF4', text: '#166534' },
  critical: { bg: '#FEF2F2', text: '#991B1B' },
};

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'small' }) => {
  const key = getStatusKey(status);
  const colors = statusColorMap[key] || { bg: '#F5F5F5', text: '#616161' };

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
