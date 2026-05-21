import React from 'react';
import { Button as MuiButton, ButtonProps as MuiButtonProps, useTheme } from '@mui/material';

export interface CustomButtonProps extends MuiButtonProps {
    label?: React.ReactNode;
    icon?: React.ReactNode;
    iconPosition?: 'start' | 'end';
}

/**
 * Reusable Button component that wraps Material UI's Button.
 * Use this component throughout the application to ensure consistency.
 */
const Button: React.FC<CustomButtonProps> = ({
    label,
    icon,
    iconPosition = 'start',
    children,
    sx,
    ...props
}) => {
    const theme = useTheme();

    // Determine standard icon placement based on custom props 
    // without overriding any native startIcon/endIcon passed explicitly.
    const startIcon = iconPosition === 'start' && icon ? icon : props.startIcon;
    const endIcon = iconPosition === 'end' && icon ? icon : props.endIcon;

    return (
        <MuiButton
            startIcon={startIcon}
            endIcon={endIcon}
            sx={{
                textTransform: 'none',
                fontWeight: theme.typography.fontWeightMedium,
                ...sx,
            }}
            {...props}
        >
            {label || children}
        </MuiButton>
    );
};

export default Button;
