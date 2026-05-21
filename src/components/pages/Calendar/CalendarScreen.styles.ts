import { SxProps, Theme } from '@mui/material';
import { themeConfig } from '@/theme/themeConfig';

export const legendIconStyles = (bg: string, border: string): SxProps<Theme> => ({
  width: 10,
  height: 10,
  borderRadius: '50%',
  backgroundColor: bg,
  border: `1px solid ${border}`
});

export const calendarCellStyles = (isSelected: boolean, isCurrentMonth: boolean, theme: Theme, isMobile: boolean, isTablet: boolean): SxProps<Theme> => ({
  height: isMobile ? 60 : isTablet ? 100 : 120,
  border: `0.5px solid ${theme.palette.divider}`,
  backgroundColor: isSelected ? `${theme.palette.primary.main}08` : isCurrentMonth ? theme.palette.background.paper : themeConfig.colors.surfaceAlt,
  p: 0.5,
  position: 'relative',
  cursor: 'pointer',
  transition: 'all 0.2s',
  '&:hover': {
    backgroundColor: themeConfig.colors.background,
  },
  ...(isSelected && {
    border: `1.5px solid ${theme.palette.primary.main}`,
    zIndex: 1
  })
});

export const transactionBadgeStyles = (type: string): SxProps<Theme> => {
  const isPayment = type === 'PAYMENT';
  const isRecoupment = type === 'RECOUPMENT';
  
  return {
    fontSize: '9px',
    p: '1px 4px',
    borderRadius: '3px',
    backgroundColor: isPayment ? themeConfig.colors.info + '18' : isRecoupment ? themeConfig.colors.error + '18' : themeConfig.colors.surfaceAlt,
    color: isPayment ? themeConfig.colors.info : isRecoupment ? themeConfig.colors.error : themeConfig.colors.text.secondary,
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    fontWeight: 600,
    border: '1px solid currentColor',
  };
};
