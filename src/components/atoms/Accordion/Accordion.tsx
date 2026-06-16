import React from 'react';
import { AccordionProps as MuiAccordionProps } from '@mui/material';
import * as styles from './Accordion.styles';

export interface AccordionProps extends Omit<MuiAccordionProps, 'children'> {
  summary?: React.ReactNode;
  children: React.ReactNode;
  hideBorderTop?: boolean;
}

const Accordion: React.FC<AccordionProps> = ({
  summary,
  children,
  hideBorderTop = false,
  defaultExpanded = true,
  disableGutters = true,
  elevation = 0,
  ...rest
}) => {
  return (
    <styles.StyledAccordion
      defaultExpanded={defaultExpanded}
      disableGutters={disableGutters}
      elevation={elevation}
      hideBorderTop={hideBorderTop}
      {...rest}
    >
      {summary && (
        <styles.StyledAccordionSummary expandIcon={<styles.StyledExpandMoreIcon />}>
          {typeof summary === 'string' ? (
            <styles.SummaryTypography>{summary}</styles.SummaryTypography>
          ) : (
            summary
          )}
        </styles.StyledAccordionSummary>
      )}
      <styles.StyledAccordionDetails>{children}</styles.StyledAccordionDetails>
    </styles.StyledAccordion>
  );
};

export default Accordion;
