import { SxProps, Theme } from '@mui/material';
import { themeConfig } from '@/theme/themeConfig';

interface AccountChipConfig {
  color?: string;
  textColor?: string;
}

export const accountChipStyles = (config?: AccountChipConfig): SxProps<Theme> => ({
  bgcolor: config?.color || themeConfig.colors.surfaceAlt,
  color: config?.textColor || themeConfig.colors.text.secondary,
  fontWeight: 600,
  fontSize: '11px',
  width: 'fit-content',
  height: 24
});

export const tableGridStyles = (cols: string): SxProps<Theme> => ({
  display: 'grid',
  gridTemplateColumns: cols,
  p: 1.5,
  alignItems: 'center',
  backgroundColor: themeConfig.colors.surface,
});

export const headerTypographyStyles = (isRight: boolean): SxProps<Theme> => ({
  fontWeight: 700,
  fontSize: '11px',
  color: themeConfig.colors.text.secondary,
  textAlign: isRight ? 'right' : 'left'
});

export const toggleButtonGroupStyles: SxProps<Theme> = {
  '& .MuiToggleButton-root': {
    px: 2,
    py: 0.5,
    textTransform: 'none',
    fontWeight: 600,
    fontSize: '12px',
    color: themeConfig.colors.text.secondary,
    borderRadius: '6px !important',
    border: `1px solid ${themeConfig.colors.border}`,
    ml: '8px !important',
    '&.Mui-selected': {
      bgcolor: themeConfig.colors.tabActive,
      color: themeConfig.colors.surface,
      border: 'none',
      '&:hover': { bgcolor: themeConfig.colors.primaryDark }
    }
  }
};
