import { SxProps, Theme } from '@mui/material';

export const cardStyles = (backgroundColor?: string, defaultBg?: string): SxProps<Theme> => ({
  backgroundColor: backgroundColor || defaultBg,
  height: '100%',
});

export const cardContentStyles: SxProps<Theme> = {
  p: { xs: 2, md: 3 },
  '&:last-child': { pb: { xs: 2, md: 3 } },
  textAlign: 'center',
};

export const titleStyles: SxProps<Theme> = {
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  fontWeight: 600,
  mb: 1,
  display: 'block',
};

export const valueStyles = (color: string, hasSubtitle: boolean): SxProps<Theme> => ({
  fontWeight: 700,
  color,
  mb: hasSubtitle ? 0.5 : 0,
});

export const subtitleStyles: SxProps<Theme> = {
  fontWeight: 600,
};
