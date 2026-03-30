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
import * as styles from './Accordion.styles';

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
                ...styles.accordionStyles(hideBorderTop),
                ...sx,
            }}
            {...rest}
        >
            {summary && (
                <MuiAccordionSummary
                    expandIcon={<ExpandMoreIcon sx={{ color: themeConfig.colors.primary }} />}
                    sx={{
                        ...styles.summaryStyles,
                        ...summarySx,
                    }}
                >
                    {typeof summary === 'string' ? (
                        <Typography sx={styles.typographyStyles}>
                            {summary}
                        </Typography>
                    ) : (
                        summary
                    )}
                </MuiAccordionSummary>
            )}
            <MuiAccordionDetails sx={{ ...styles.detailsStyles, ...detailsSx }}>
                {children}
            </MuiAccordionDetails>
        </MuiAccordion>
    );
};

export default Accordion;
