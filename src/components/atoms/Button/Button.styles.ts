import { SxProps, Theme } from '@mui/material';

export const buttonStyles = (theme: Theme): SxProps<Theme> => ({
    textTransform: 'none',
    fontWeight: theme.typography.fontWeightMedium,
});
