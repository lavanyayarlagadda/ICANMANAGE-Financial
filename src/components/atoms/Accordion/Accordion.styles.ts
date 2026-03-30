import { SxProps, Theme } from '@mui/material';
import { themeConfig } from '@/theme/themeConfig';

export const accordionStyles = (hideBorderTop: boolean): SxProps<Theme> => ({
    borderTop: hideBorderTop ? 'none' : `1px solid ${themeConfig.colors.border}`,
    '&:before': { display: 'none' },
});

export const summaryStyles: SxProps<Theme> = {
    backgroundColor: '#FAFBFC',
    flexDirection: 'row-reverse',
    gap: 1,
    minHeight: 48,
    '& .MuiAccordionSummary-content': { my: 1 },
};

export const typographyStyles: SxProps<Theme> = {
    fontSize: '0.9rem',
    color: themeConfig.colors.text.secondary,
};

export const detailsStyles: SxProps<Theme> = {
    p: 0,
};
