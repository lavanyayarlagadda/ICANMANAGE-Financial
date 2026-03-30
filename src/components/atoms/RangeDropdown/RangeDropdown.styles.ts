import { themeConfig } from '@/theme/themeConfig';

export const containerStyles: any = {
  display: 'flex',
  alignItems: 'center',
  gap: 2,
  flexWrap: 'wrap',
};

export const rangeBoxStyles: any = {
  display: 'flex',
  alignItems: 'center',
  gap: 1,
};

export const labelStyles: any = {
  fontWeight: 500,
};

export const selectStyles: any = {
  height: 32,
  minWidth: 120,
  fontSize: '0.85rem',
  backgroundColor: '#fff',
  borderRadius: 1.5,
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: themeConfig.colors.border,
  },
};

export const datePickersContainerStyles = (isMobile: boolean): any => ({
  display: 'flex',
  alignItems: isMobile ? 'flex-start' : 'center',
  gap: isMobile ? 1 : 2,
  flexDirection: isMobile ? 'column' : 'row',
  width: isMobile ? '100%' : 'auto'
});

export const datePickerItemStyles = (isMobile: boolean): any => ({
  display: 'flex',
  alignItems: 'center',
  gap: 1,
  width: isMobile ? '100%' : 'auto'
});

export const dateLabelStyles: any = {
  fontWeight: 600,
  minWidth: 40,
};

export const getDatePickerSx = (isMobile: boolean): any => ({
  '& .MuiInputBase-root': { 
    height: 32, 
    fontSize: '0.75rem', 
    borderRadius: 1.5, 
    width: isMobile ? '100%' : 140,
    backgroundColor: '#fff',
  },
  '& .MuiOutlinedInput-notchedOutline': { borderColor: themeConfig.colors.border },
  flex: isMobile ? 1 : 'unset',
});

export const slotProps = (isMobile: boolean) => ({
  textField: { size: 'small' as const, sx: getDatePickerSx(isMobile) },
  desktopPaper: {
    sx: {
      '& .MuiPickersLayout-root': {
        backgroundColor: '#fff',
      },
      '& .MuiPickersToolbar-root': {
        backgroundColor: themeConfig.colors.accent,
        color: '#fff',
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
        color: '#fff',
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
