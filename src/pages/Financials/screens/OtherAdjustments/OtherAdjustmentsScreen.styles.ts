import { SxProps, Theme, Box, TextField } from '@mui/material';
import { styled } from '@mui/material/styles';
import { themeConfig } from '@/theme/themeConfig';

export const adjustmentTypeColors: Record<string, string> = {
  'WRITE-OFF': themeConfig.colors.error,
  'CREDIT': themeConfig.colors.info,
  'INTEREST': themeConfig.colors.accentDark,
  'CONTRACTUAL': themeConfig.colors.primaryDark,
  'REFUND': themeConfig.colors.charts.teal,
  'TRANSFER': themeConfig.colors.accent,
  'RECLASSIFICATION': themeConfig.colors.slate[700],
  'CHARITY': themeConfig.colors.success,
};

export const adjustmentChipStyles = (type: string): SxProps<Theme> => ({
  backgroundColor: `${adjustmentTypeColors[type] || themeConfig.colors.slate[500]}18`,
  color: adjustmentTypeColors[type] || themeConfig.colors.slate[500],
  fontWeight: 600,
  fontSize: '0.7rem',
});

export const amountStyles = (amount: number, theme: Theme): SxProps<Theme> => ({
  fontFamily: 'monospace',
  fontWeight: 600,
  color: amount < 0 ? theme.palette.error.main : amount > 0 ? theme.palette.success.main : theme.palette.text.primary,
});

export const ToolbarWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'stretch',
  backgroundColor: theme.palette.background.default,
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.spacing(1),
  padding: theme.spacing(1.5),
  gap: theme.spacing(2),
  marginBottom: theme.spacing(3),
  [theme.breakpoints.up('md')]: {
    flexDirection: 'row',
    alignItems: 'center',
  },
}));

export const SearchField = styled(TextField)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  flex: '1 1 auto',
  [theme.breakpoints.up('md')]: {
    flex: '0 0 320px',
  },
  '& .MuiOutlinedInput-root': {
    height: 36,
    fontSize: '13px'
  }
}));

