import { SxProps, Theme } from '@mui/material';

export const metricRowStyles: SxProps<Theme> = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  py: 0.5,
};

export const metricValueStyles = (highlight: boolean, theme: Theme): SxProps<Theme> => ({
  fontWeight: 600,
  color: highlight ? theme.palette.primary.main : theme.palette.text.primary,
  fontFamily: 'monospace',
});

export const cardStyles: SxProps<Theme> = {
  height: '100%',
};

export const cardContentStyles: SxProps<Theme> = {
  p: { xs: 2, md: 3 },
};

export const teamNameStyles = (theme: Theme): SxProps<Theme> => ({
  fontWeight: 700,
  mb: 2,
  color: theme.palette.primary.main,
});

export const sectionHeaderStyles = (theme: Theme): SxProps<Theme> => ({
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  color: theme.palette.text.secondary,
});

export const metricsBoxStyles: SxProps<Theme> = {
  mt: 1,
  mb: 2,
};
