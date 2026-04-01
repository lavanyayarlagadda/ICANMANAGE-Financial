import React from 'react';
import {
    Accordion as MuiAccordion,
    AccordionSummary as MuiAccordionSummary,
    AccordionDetails as MuiAccordionDetails,
    AccordionProps as MuiAccordionProps,
    Typography,
    SxProps,
    Theme,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { themeConfig } from '@/theme/themeConfig';
import * as styles from './Accordion.styles';

export interface AccordionProps extends Omit<MuiAccordionProps, 'children'> {
    summary?: React.ReactNode;
    children: React.ReactNode;
    hideBorderTop?: boolean;
    summarySx?: SxProps<Theme>;
    detailsSx?: SxProps<Theme>;
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
            sx={[
                styles.accordionStyles(hideBorderTop),
                ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
            ]}
            {...rest}
        >
            {summary && (
                <MuiAccordionSummary
                    expandIcon={<ExpandMoreIcon sx={{ color: themeConfig.colors.primary }} />}
                    sx={[
                        styles.summaryStyles,
                        ...(Array.isArray(summarySx) ? summarySx : summarySx ? [summarySx] : []),
                    ]}
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
            <MuiAccordionDetails sx={[
                styles.detailsStyles,
                ...(Array.isArray(detailsSx) ? detailsSx : detailsSx ? [detailsSx] : []),
            ]}>
                {children}
            </MuiAccordionDetails>
        </MuiAccordion>
    );
};

export default Accordion;
