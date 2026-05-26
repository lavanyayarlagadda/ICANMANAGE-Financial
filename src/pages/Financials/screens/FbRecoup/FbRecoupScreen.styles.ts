import { SxProps, Theme, Box, TextField } from '@mui/material';
import { styled } from '@mui/material/styles';
import { themeConfig } from '@/theme/themeConfig';

export const offsetChipStyles: SxProps<Theme> = {
  height: 20,
  fontSize: '10px',
  fontWeight: 700,
  bgcolor: themeConfig.colors.accent + '18',
  color: themeConfig.colors.accentDark,
  border: `1px solid ${themeConfig.colors.accent + '33'}`
};

export const offsetGridStyles: SxProps<Theme> = {
  display: "grid",
  gridTemplateColumns: "1.5fr 1fr 1.2fr 1fr",
  minWidth: "100%",
  px: 2,
  py: 1,
};

export const noticeIdStyles: SxProps<Theme> = {
  fontWeight: 700,
  color: themeConfig.colors.primaryDark
};

export const boldStyles: SxProps<Theme> = {
  fontWeight: 700,
};

export const errorAmountStyles: SxProps<Theme> = {
  fontWeight: 700,
  color: 'error.main'
};

export const toggleButtonGroupStyles: SxProps<Theme> = {
  '& .MuiToggleButton-root': {
    px: 2,
    py: 0.5,
    textTransform: 'none',
    fontWeight: 600,
    fontSize: '12px',
    color: themeConfig.colors.text.secondary,
    borderRadius: '6px !important',
    border: `1px solid ${themeConfig.colors.border}`,
    ml: '8px !important',
    '&.Mui-selected': {
      bgcolor: themeConfig.colors.tabActive,
      color: themeConfig.colors.surface,
      border: 'none',
      '&:hover': { bgcolor: themeConfig.colors.primaryDark }
    }
  }
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

export const FilterField = styled(TextField)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  flex: '0 0 150px',
  width: 150,
  minWidth: 120,
  '& .MuiOutlinedInput-root': {
    height: 36,
    fontSize: '13px',
  },
}));

