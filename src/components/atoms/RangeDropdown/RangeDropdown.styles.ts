import { styled } from '@mui/material/styles';
import { Box, Typography, Select, Snackbar, Alert, MenuItem } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { themeConfig } from '@/theme/themeConfig';

export const ContainerBox = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  gap: '12px', // gap: 1.5
  flexWrap: 'nowrap',
}));

export const RangeBox = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  gap: '8px', // gap: 1
}));

export const LabelTypography = styled(Typography)(() => ({
  fontWeight: 500,
  fontSize: '0.75rem',
  color: themeConfig.colors.slate[500],
}));

export const StyledSelect = styled(Select)(() => ({
  height: 32,
  minWidth: 100,
  fontSize: '0.8rem',
  backgroundColor: themeConfig.colors.surface,
  borderRadius: '6px', // 1.5 * 4
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: themeConfig.colors.border,
  },
})) as unknown as typeof Select;

export const DatePickersContainer = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  gap: '8px', // gap: 1
  flexDirection: 'row',
  width: 'auto',
}));

export const DatePickerItem = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  gap: '4px', // gap: 0.5
  width: 'auto',
}));

export const DateLabelTypography = styled(Typography)(() => ({
  fontWeight: 600,
  fontSize: '0.7rem',
  minWidth: 'auto',
  color: themeConfig.colors.slate[400],
}));

export const StyledDatePicker = styled(DatePicker)(() => ({
  '& .MuiInputBase-root': {
    height: 32,
    fontSize: '0.75rem',
    borderRadius: '6px',
    width: 120,
    backgroundColor: themeConfig.colors.surface,
  },
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: themeConfig.colors.border,
  },
  flex: 'unset',
}));

export const StyledSnackbar = styled(Snackbar)(({ theme }) => ({
  zIndex: Math.max(theme.zIndex.snackbar, 9999),
  marginTop: '64px',
}));

export const StyledAlert = styled(Alert)(() => ({
  width: '100%',
}));

export const StyledMenuItem = styled(MenuItem)(() => ({
  fontSize: '0.85rem',
}));

export const slotProps = (_isMobile: boolean) => ({
  textField: { size: 'small' as const },
  desktopPaper: {
    sx: {
      '& .MuiPickersLayout-root': {
        backgroundColor: themeConfig.colors.surface,
      },
      '& .MuiPickersToolbar-root': {
        backgroundColor: themeConfig.colors.accent,
        color: themeConfig.colors.surface,
      },
      '& .MuiDateCalendar-root': {
        '& .MuiPickersDay-root.Mui-selected': {
          backgroundColor: themeConfig.colors.accent,
        },
      },
    },
  },
  mobilePaper: {
    sx: {
      '& .MuiPickersToolbar-root': {
        backgroundColor: themeConfig.colors.accent,
        color: themeConfig.colors.surface,
      },
      '& .MuiPickersDay-root.Mui-selected': {
        backgroundColor: themeConfig.colors.accent,
      },
      '& .MuiButtonBase-root': {
        color: themeConfig.colors.accent,
      },
    },
  },
});
