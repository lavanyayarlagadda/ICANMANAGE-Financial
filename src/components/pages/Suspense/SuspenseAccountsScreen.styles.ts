import { themeConfig } from '@/theme/themeConfig';

export const accountChipStyles = (config: any): any => ({
  bgcolor: config?.color || themeConfig.colors.surfaceAlt,
  color: config?.textColor || themeConfig.colors.text.secondary,
  fontWeight: 600,
  fontSize: '11px',
  width: 'fit-content',
  height: 24
});

export const tableGridStyles = (cols: string): any => ({
  display: 'grid',
  gridTemplateColumns: cols,
  p: 1.5,
  alignItems: 'center'
});

export const headerTypographyStyles = (isRight: boolean): any => ({
  fontWeight: 700,
  fontSize: '11px',
  color: themeConfig.colors.text.secondary,
  textAlign: isRight ? 'right' : 'left'
});

export const toggleButtonGroupStyles: any = {
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
      color: '#fff',
      border: 'none',
      '&:hover': { bgcolor: themeConfig.colors.primaryDark }
    }
  }
};
