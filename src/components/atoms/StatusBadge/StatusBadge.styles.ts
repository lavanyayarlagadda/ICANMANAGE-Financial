import { styled } from '@mui/material/styles';
import { Chip } from '@mui/material';
import { themeConfig } from '@/theme/themeConfig';
import { ReconStatus, SystemStatus } from '@/constants/statuses';

export const statusColorMap: Record<string, { bg: string; text: string }> = {
  posted: themeConfig.status.posted,
  completed: themeConfig.status.completed,
  reconciled: themeConfig.status[ReconStatus.RECONCILED],
  needsreview: themeConfig.status.needsReview,
  pendingreview: themeConfig.status.pendingReview,
  match: themeConfig.status[ReconStatus.MATCHED],
  improving: themeConfig.status[SystemStatus.IMPROVING],
  growing: themeConfig.status.completed,
  decreasing: themeConfig.status[SystemStatus.CRITICAL],
  open: themeConfig.status.needsReview,
  closed: themeConfig.status.posted,
  approved: themeConfig.status.approved,
  disputed: themeConfig.status.disputed,
  pending: themeConfig.status.pending,
  recovered: themeConfig.status.recovered,
  partial: themeConfig.status.partial,
  writtenoff: themeConfig.status.writtenOff,
  applied: themeConfig.status.applied,
  reversed: themeConfig.status.reversed,
  underreview: themeConfig.status.underReview,
  stable: themeConfig.status[SystemStatus.STABLE],
  critical: themeConfig.status[SystemStatus.CRITICAL],
};

export const StyledChip = styled(Chip, {
  shouldForwardProp: (prop) => prop !== 'customBg' && prop !== 'customColor',
})<{ customBg: string; customColor: string }>(({ customBg, customColor, size }) => ({
  backgroundColor: customBg,
  color: customColor,
  fontWeight: 600,
  fontSize: '0.7rem',
  height: size === 'small' ? 24 : 28,
  borderRadius: '4px',
}));
