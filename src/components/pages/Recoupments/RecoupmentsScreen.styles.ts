import { SxProps, Theme, Box, TextField } from '@mui/material';
import { styled } from '@mui/material/styles';
import { themeConfig } from '@/theme/themeConfig';

export const monospaceStyles: SxProps<Theme> = {
  fontFamily: 'monospace',
};

export const amountStyles = (theme: Theme): SxProps<Theme> => ({
  fontFamily: 'monospace',
  fontWeight: 600,
  color: theme.palette.error.main,
});

export const reasonStyles: SxProps<Theme> = {
  fontSize: '0.8rem',
  color: themeConfig.colors.text.secondary,
};

export const boldStyles: SxProps<Theme> = {
  fontWeight: 600,
  color: themeConfig.colors.text.primary,
};

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
