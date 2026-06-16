import { styled } from '@mui/material/styles';
import {
  Accordion as MuiAccordion,
  AccordionSummary as MuiAccordionSummary,
  AccordionDetails as MuiAccordionDetails,
  Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { themeConfig } from '@/theme/themeConfig';

export const StyledAccordion = styled(MuiAccordion, {
  shouldForwardProp: (prop) => prop !== 'hideBorderTop',
})<{ hideBorderTop?: boolean }>(({ hideBorderTop }) => ({
  borderTop: hideBorderTop ? 'none' : `1px solid ${themeConfig.colors.border}`,
  '&:before': { display: 'none' },
}));

export const StyledAccordionSummary = styled(MuiAccordionSummary)(() => ({
  backgroundColor: themeConfig.colors.surfaceSubtle,
  flexDirection: 'row-reverse',
  gap: '8px', // gap: 1
  minHeight: 48,
  '& .MuiAccordionSummary-content': {
    marginTop: '8px', // my: 1
    marginBottom: '8px',
  },
}));

export const StyledExpandMoreIcon = styled(ExpandMoreIcon)(() => ({
  color: themeConfig.colors.primary,
}));

export const SummaryTypography = styled(Typography)(() => ({
  fontSize: '0.9rem',
  color: themeConfig.colors.text.secondary,
}));

export const StyledAccordionDetails = styled(MuiAccordionDetails)(() => ({
  padding: 0,
}));
