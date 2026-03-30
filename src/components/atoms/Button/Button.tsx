import React, { useMemo } from 'react';
import { Button as MuiButton, ButtonProps as MuiButtonProps, useTheme } from '@mui/material';
import * as styles from './Button.styles';

export interface CustomButtonProps extends MuiButtonProps {
    label?: React.ReactNode;
    icon?: React.ReactNode;
    iconPosition?: 'start' | 'end';
}

const Button: React.FC<CustomButtonProps> = ({
    label,
    icon,
    iconPosition = 'start',
    children,
    sx,
    ...props
}) => {
    const theme = useTheme();

    const startIcon = useMemo(() => 
        iconPosition === 'start' && icon ? icon : props.startIcon,
        [icon, iconPosition, props.startIcon]
    );
    
    const endIcon = useMemo(() => 
        iconPosition === 'end' && icon ? icon : props.endIcon,
        [icon, iconPosition, props.endIcon]
    );

    return (
        <MuiButton
            startIcon={startIcon}
            endIcon={endIcon}
            sx={{
                ...styles.buttonStyles(theme),
                ...sx,
            }}
            {...props}
        >
            {label || children}
        </MuiButton>
    );
};

export default Button;
