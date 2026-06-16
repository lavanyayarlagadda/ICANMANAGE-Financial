import React, { useMemo } from 'react';
import { ButtonProps as MuiButtonProps } from '@mui/material';
import * as styles from './Button.styles';

export interface CustomButtonProps extends MuiButtonProps {
  label?: React.ReactNode;
  icon?: React.ReactNode;
  iconPosition?: 'start' | 'end';
  isMobile?: boolean;
}

const Button = ({ label, icon, iconPosition = 'start', children, ...props }: CustomButtonProps) => {
  const startIcon = useMemo(
    () => (iconPosition === 'start' && icon ? icon : props.startIcon),
    [icon, iconPosition, props.startIcon],
  );

  const endIcon = useMemo(
    () => (iconPosition === 'end' && icon ? icon : props.endIcon),
    [icon, iconPosition, props.endIcon],
  );

  return (
    <styles.StyledMuiButton startIcon={startIcon} endIcon={endIcon} {...props}>
      {label || children}
    </styles.StyledMuiButton>
  );
};

export default Button;
