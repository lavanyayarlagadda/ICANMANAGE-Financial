import { Theme } from '@mui/material';
import { themeConfig } from '@/theme/themeConfig';

export const accordionStyles = (hideBorderTop: boolean): any => ({
    borderTop: hideBorderTop ? 'none' : `1px solid ${themeConfig.colors.border}`,
    '&:before': { display: 'none' },
});

export const summaryStyles: any = {
    backgroundColor: '#FAFBFC',
    flexDirection: 'row-reverse',
    gap: 1,
    minHeight: 48,
    '& .MuiAccordionSummary-content': { my: 1 },
};

export const typographyStyles: any = {
    fontSize: '0.9rem',
    color: themeConfig.colors.text.secondary,
};

export const detailsStyles: any = {
    p: 0,
};
