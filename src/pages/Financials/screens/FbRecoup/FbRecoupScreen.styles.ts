import { SxProps, Theme, Box, TextField } from '@mui/material';
import { styled } from '@mui/material/styles';
import { themeConfig } from '@/theme/themeConfig';

export const offsetChipStyles: SxProps<Theme> = {
  height: 20,
  fontSize: '10px',
  fontWeight: 700,
  bgcolor: themeConfig.colors.accent + '18',
  color: themeConfig.colors.accentDark,
  border: `1px solid ${themeConfig.colors.accent + '33'}`,
};

export const offsetGridStyles: SxProps<Theme> = {
  display: 'grid',
  gridTemplateColumns: '1.5fr 1fr 1.2fr 1fr',
  minWidth: '100%',
  px: 2,
  py: 1,
};

export const noticeIdStyles: SxProps<Theme> = {
  fontWeight: 700,
  color: themeConfig.colors.primaryDark,
};

export const boldStyles: SxProps<Theme> = {
  fontWeight: 700,
};

export const errorAmountStyles: SxProps<Theme> = {
  fontWeight: 700,
  color: 'error.main',
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
      '&:hover': { bgcolor: themeConfig.colors.primaryDark },
    },
  },
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
    fontSize: '13px',
  },
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

// Added style exports for FbRecoupScreen refactoring
export const filesSectionWrapper: SxProps<Theme> = {
  width: '75%',
};

export const filesSectionTitle: SxProps<Theme> = {
  fontWeight: 700,
  mb: 1,
  color: 'text.primary',
  textAlign: 'left',
};

export const filesContainer: SxProps<Theme> = {
  border: `1px solid ${themeConfig.colors.divider}`,
  borderRadius: '4px',
  maxHeight: 250,
  overflowY: 'auto',
  overflowX: 'hidden',
};

export const filesHeaderGrid: SxProps<Theme> = {
  ...offsetGridStyles,
  background: '#e4f0fa',
  borderBottom: `1px solid ${themeConfig.colors.divider}`,
  position: 'sticky',
  top: 0,
  zIndex: 1,
};

export const getFilesRowGridStyles = (isLast: boolean): SxProps<Theme> => ({
  ...offsetGridStyles,
  borderBottom: isLast ? 'none' : `1px solid ${themeConfig.colors.divider}`,
  alignItems: 'center',
});

export const flexCenter: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

export const fileLinkText: SxProps<Theme> = {
  fontWeight: 600,
  display: 'flex',
  alignItems: 'center',
};

export const iconLeftMargin: SxProps<Theme> = {
  fontSize: 16,
  mr: 0.5,
};

export const fontWeight500: SxProps<Theme> = {
  fontWeight: 500,
};

export const boldText: SxProps<Theme> = {
  fontWeight: 700,
};

export const boldText500: SxProps<Theme> = {
  fontWeight: 500,
};

export const getAmountStyles = (amount: number): SxProps<Theme> => ({
  fontWeight: 700,
  color: amount < 0 ? 'error.main' : 'text.primary',
});

export const getSuspenseBalanceStyles = (balance: number): SxProps<Theme> => ({
  fontWeight: 700,
  color: balance > 0 ? 'primary.main' : 'text.secondary',
});

export const getTypeChipStyles = (bg: string, text: string): SxProps<Theme> => ({
  backgroundColor: bg,
  color: text,
  fontWeight: 700,
  fontSize: '10px',
});

export const screenHeader: SxProps<Theme> = {
  mb: 3,
};

export const screenHeaderTitle: SxProps<Theme> = {
  fontWeight: 700,
};

export const summaryGrid: SxProps<Theme> = {
  mb: 4,
};

export const searchWrapper: SxProps<Theme> = {
  display: 'flex',
  gap: 1,
  alignItems: 'center',
};

export const searchIcon: SxProps<Theme> = {
  fontSize: 18,
  color: 'primary.main',
};

export const searchButton: SxProps<Theme> = {
  height: '36px',
  borderRadius: '8px',
  textTransform: 'none',
  fontWeight: 600,
  px: 2,
};

export const emptyEraBox: SxProps<Theme> = {
  p: 2,
  textAlign: 'center',
};

export const filterFormControl: SxProps<Theme> = {
  minWidth: 160,
  maxWidth: 200,
  flexShrink: 0,
};

export const filterIconButton: SxProps<Theme> = {
  p: '4px',
};

export const filterInputProps: SxProps<Theme> = {
  pr: '4px',
  '& .MuiOutlinedInput-input': {
    py: '8.5px',
  },
};
