import { SxProps, Theme } from '@mui/material';

export const containerStyles: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  gap: 1.5,
};

export const imageContainerStyles: SxProps<Theme> = {
  borderRadius: 2,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

export const imageStyles = (collapsed: boolean): React.CSSProperties => ({
  width: collapsed ? 100 : 120,
  transition: 'width 0.2s ease-in-out',
});
