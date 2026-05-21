import React from 'react';
import {
    Accordion as MuiAccordion,
    AccordionSummary as MuiAccordionSummary,
    AccordionDetails as MuiAccordionDetails,
    AccordionProps as MuiAccordionProps,
    Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { themeConfig } from '@/theme/themeConfig';

export interface AccordionProps extends Omit<MuiAccordionProps, 'children'> {
    summary?: React.ReactNode;
    children: React.ReactNode;
    hideBorderTop?: boolean;
    summarySx?: object;
    detailsSx?: object;
}

const Accordion: React.FC<AccordionProps> = ({
    summary,
    children,
    hideBorderTop = false,
    sx,
    summarySx,
    detailsSx,
    defaultExpanded = true,
    disableGutters = true,
    elevation = 0,
    ...rest
}) => {
    return (
        <MuiAccordion
            defaultExpanded={defaultExpanded}
            disableGutters={disableGutters}
            elevation={elevation}
            sx={{
                borderTop: hideBorderTop ? 'none' : `1px solid ${themeConfig.colors.border}`,
                '&:before': { display: 'none' },
                ...sx,
            }}
            {...rest}
        >
            {summary && (
                <MuiAccordionSummary
                    expandIcon={<ExpandMoreIcon sx={{ color: themeConfig.colors.primary }} />}
                    sx={{
                        backgroundColor: '#FAFBFC',
                        flexDirection: 'row-reverse',
                        gap: 1,
                        minHeight: 48,
                        '& .MuiAccordionSummary-content': { my: 1 },
                        ...summarySx,
                    }}
                >
                    {typeof summary === 'string' ? (
                        <Typography sx={{ fontSize: '0.9rem', color: themeConfig.colors.text.secondary }}>
                            {summary}
                        </Typography>
                    ) : (
                        summary
                    )}
                </MuiAccordionSummary>
            )}
            <MuiAccordionDetails sx={{ p: 0, ...detailsSx }}>
                {children}
            </MuiAccordionDetails>
        </MuiAccordion>
    );
};

export default Accordion;
