import { SxProps, Theme, Box, TextField } from '@mui/material';
import { styled } from '@mui/material/styles';
import { themeConfig } from '@/theme/themeConfig';

interface AccountChipConfig {
  color?: string;
  textColor?: string;
}

export const accountChipStyles = (config?: AccountChipConfig): SxProps<Theme> => ({
  bgcolor: config?.color || themeConfig.colors.surfaceAlt,
  color: config?.textColor || themeConfig.colors.text.secondary,
  fontWeight: 600,
  fontSize: '11px',
  width: 'fit-content',
  height: 24,
});

export const tableGridStyles = (cols: string): SxProps<Theme> => ({
  display: 'grid',
  gridTemplateColumns: cols,
  p: 1.5,
  alignItems: 'center',
  backgroundColor: themeConfig.colors.surface,
});

export const headerTypographyStyles = (isRight: boolean): SxProps<Theme> => ({
  fontWeight: 700,
  fontSize: '11px',
  color: themeConfig.colors.text.secondary,
  textAlign: isRight ? 'right' : 'left',
});

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

export const modalTitleStyles: SxProps<Theme> = {
  fontWeight: 700,
  px: 3,
  pt: 3,
};

export const modalContentStyles: SxProps<Theme> = {
  px: 3,
};

export const modalInnerWrapperStyles: SxProps<Theme> = {
  mt: 2,
};

export const modalHeaderGridStyles: SxProps<Theme> = {
  display: 'grid',
  gridTemplateColumns: '1.2fr 1.5fr 0.8fr 0.5fr',
  mb: 2,
  pb: 1,
  borderBottom: '1px solid',
  borderBottomColor: 'divider',
};

export const modalHeaderTextStyles: SxProps<Theme> = {
  fontWeight: 700,
  color: 'text.secondary',
};

export const modalHeaderCenterTextStyles: SxProps<Theme> = {
  ...modalHeaderTextStyles,
  textAlign: 'center',
};

export const modalHeaderRightTextStyles: SxProps<Theme> = {
  ...modalHeaderTextStyles,
  textAlign: 'right',
};

export const modalListContainerStyles: SxProps<Theme> = {
  mb: 4,
};

export const modalRowGridStyles: SxProps<Theme> = {
  display: 'grid',
  gridTemplateColumns: '1.2fr 1.5fr 0.8fr 0.5fr',
  py: 1.5,
  borderBottom: '1px solid',
  borderBottomColor: 'divider',
  alignItems: 'center',
};

export const modalRowKeyStyles: SxProps<Theme> = {
  fontWeight: 600,
  color: 'text.secondary',
  fontSize: '12px',
};

export const modalRowLabelStyles: SxProps<Theme> = {
  fontWeight: 500,
  color: 'text.primary',
};

export const modalRowCenterStyles: SxProps<Theme> = {
  display: 'flex',
  justifyContent: 'center',
};

export const modalRowChipStyles = (color: string, textColor: string): SxProps<Theme> => ({
  height: 20,
  fontSize: '10px',
  fontWeight: 700,
  bgcolor: color,
  color: textColor,
  border: `1px solid ${textColor}20`,
});

export const modalRowActionsStyles: SxProps<Theme> = {
  display: 'flex',
  justifyContent: 'flex-end',
  gap: 0.5,
};

export const disabledIconBtnStyles: SxProps<Theme> = {
  color: 'text.disabled',
};

export const smallIconStyles: SxProps<Theme> = {
  fontSize: 16,
};

export const modalSectionTitleStyles: SxProps<Theme> = {
  fontWeight: 700,
  mb: 2,
  mt: 3,
};

export const modalActionsStyles: SxProps<Theme> = {
  px: 3,
  pb: 2,
  mt: 2,
};

export const modalCancelBtnStyles: SxProps<Theme> = {
  color: 'text.secondary',
};

export const itemCountStyles: SxProps<Theme> = {
  fontSize: '12px',
  color: 'primary.main',
  fontWeight: 600,
};

export const amountTextStyles = (isTotal: boolean): SxProps<Theme> => ({
  fontSize: '13px',
  fontWeight: isTotal ? 700 : 500,
});

export const emptyAmountStyles: SxProps<Theme> = {
  fontSize: '13px',
  color: 'text.secondary',
};

export const normalTextStyles: SxProps<Theme> = {
  fontSize: '13px',
  fontWeight: 600,
};

export const screenWrapperStyles: SxProps<Theme> = {
  p: 0,
};

export const searchWrapperStyles: SxProps<Theme> = {
  display: 'flex',
  gap: 1,
  alignItems: 'center',
};

export const searchIconStyles: SxProps<Theme> = {
  fontSize: 18,
  color: 'primary.main',
};

export const searchButtonStyles: SxProps<Theme> = {
  height: '36px',
  borderRadius: '8px',
  textTransform: 'none',
  fontWeight: 600,
  px: 2,
};

export const screenHeaderStyles: SxProps<Theme> = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  mb: 3,
};

export const screenHeaderTitleStyles: SxProps<Theme> = {
  fontWeight: 700,
};

export const screenHeaderRightStyles: SxProps<Theme> = {
  display: 'flex',
  gap: 2,
  alignItems: 'center',
};

export const summaryGridStyles: SxProps<Theme> = {
  mb: 4,
};
