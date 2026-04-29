import { SxProps, Theme } from '@mui/material';
import { themeConfig } from '@/theme/themeConfig';

export const containerStyles: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  gap: 1.5,
  flexWrap: 'nowrap',
};

export const rangeBoxStyles: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  gap: 1,
};

export const labelStyles: SxProps<Theme> = {
  fontWeight: 500,
  fontSize: '0.75rem',
  color: themeConfig.colors.slate[500],
};

export const selectStyles: SxProps<Theme> = {
  height: 32,
  minWidth: 100,
  fontSize: '0.8rem',
  backgroundColor: themeConfig.colors.surface,
  borderRadius: 1.5,
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: themeConfig.colors.border,
  },
};

export const datePickersContainerStyles = (): SxProps<Theme> => ({
  display: 'flex',
  alignItems: 'center',
  gap: 1,
  flexDirection: 'row', // Force row for compact view
  width: 'auto'
});

export const datePickerItemStyles = (): SxProps<Theme> => ({
  display: 'flex',
  alignItems: 'center',
  gap: 0.5,
  width: 'auto'
});

export const dateLabelStyles: SxProps<Theme> = {
  fontWeight: 600,
  fontSize: '0.7rem',
  minWidth: 'auto',
  color: themeConfig.colors.slate[400],
};

export const getDatePickerSx = (): SxProps<Theme> => ({
  '& .MuiInputBase-root': {
    height: 32,
    fontSize: '0.75rem',
    borderRadius: 1.5,
    width: 120, // Smaller width
    backgroundColor: themeConfig.colors.surface,
  },
  '& .MuiOutlinedInput-notchedOutline': { borderColor: themeConfig.colors.border },
  flex: 'unset',
});

export const slotProps = (isMobile: boolean) => ({
  textField: { size: 'small' as const, sx: getDatePickerSx(isMobile) },
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
        }
      }
    }
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
      }
    }
  }
});
