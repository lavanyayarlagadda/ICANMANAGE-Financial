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
  gridTemplateColumns: '1.2fr 2fr 1fr',
  minWidth: 500,
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

export const offsetWrapperStyles: SxProps<Theme> = {
  mb: 1,
};

export const offsetSummaryStyles: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '100%',
  gap: 2,
};

export const offsetTitleStyles: SxProps<Theme> = {
  fontWeight: 600,
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  gap: 1,
};

export const offsetAmountStyles: SxProps<Theme> = {
  fontWeight: 700,
  textAlign: 'center',
};

export const offsetDetailsContainerStyles: SxProps<Theme> = {
  border: `1px solid ${themeConfig.colors.divider}`,
  borderTop: 'none',
  overflowX: 'auto',
};

export const offsetHeaderGridStyles: SxProps<Theme> = {
  ...offsetGridStyles,
  background: themeConfig.colors.surfaceAlt,
  borderBottom: `1px solid ${themeConfig.colors.divider}`,
};

export const offsetRowGridStyles: SxProps<Theme> = {
  ...offsetGridStyles,
  borderBottom: `1px solid ${themeConfig.colors.divider}`,
};

export const claimIdStyles: SxProps<Theme> = {
  fontWeight: 500,
};

export const patientNameStyles: SxProps<Theme> = {
  fontWeight: 500,
};

export const deductedAmountStyles: SxProps<Theme> = {
  fontWeight: 700,
  color: 'error.main',
};

export const noticeIdTextStyles: SxProps<Theme> = {
  fontWeight: 700,
  color: themeConfig.colors.amberDark,
};

export const boldTextStyles: SxProps<Theme> = {
  fontWeight: 700,
};

export const providerNameWrapperStyles: SxProps<Theme> = {
  textAlign: 'center',
};

export const providerNameStyles: SxProps<Theme> = {
  fontWeight: 700,
};

export const screenHeaderStyles: SxProps<Theme> = {
  mb: 3,
};

export const screenHeaderTitleStyles: SxProps<Theme> = {
  fontWeight: 700,
};

export const summaryGridStyles: SxProps<Theme> = {
  mb: 4,
};

export const loadingWrapperStyles: SxProps<Theme> = {
  p: 3,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: 2,
};

export const emptyDetailsWrapperStyles: SxProps<Theme> = {
  p: 2,
  textAlign: 'center',
};

export const detailsWrapperStyles: SxProps<Theme> = {
  p: 1,
};
