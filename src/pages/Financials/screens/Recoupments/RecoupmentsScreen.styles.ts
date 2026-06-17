import { styled } from '@mui/material/styles';
import { themeConfig } from '@/theme/themeConfig';

import { Box, Typography, Button, TextField } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

export const MonospaceBox = styled(Box)(() => ({
  fontFamily: 'monospace',
}));

export const AmountText = styled(Typography)(({ theme }) => ({
  fontFamily: 'monospace',
  fontWeight: 600,
  color: theme.palette.error.main,
}));

export const ReasonText = styled(Typography)(() => ({
  fontSize: '0.8rem',
  color: themeConfig.colors.text.secondary,
}));

export const BoldText = styled(Typography)(() => ({
  fontWeight: 600,
  color: themeConfig.colors.text.primary,
}));

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
    fontSize: '13px',
  },
}));

export const PageContainer = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  height: '100%',
  minHeight: 0,
}));

export const SearchWrapper = styled(Box)(() => ({
  display: 'flex',
  gap: '8px',
  alignItems: 'center',
}));

export const StyledSearchIcon = styled(SearchIcon)(({ theme }) => ({
  fontSize: 18,
  color: theme.palette.primary.main,
}));

export const SearchButton = styled(Button)(() => ({
  height: '36px',
  borderRadius: '8px',
  textTransform: 'none',
  fontWeight: 600,
  paddingLeft: '16px',
  paddingRight: '16px',
}));
