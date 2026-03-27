export const metricRowStyles: any = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  py: 0.5,
};

export const metricValueStyles = (highlight: boolean, theme: any): any => ({
  fontWeight: 600,
  color: highlight ? theme.palette.primary.main : theme.palette.text.primary,
  fontFamily: 'monospace',
});

export const cardStyles: any = {
  height: '100%',
};

export const cardContentStyles: any = {
  p: { xs: 2, md: 3 },
};

export const teamNameStyles = (theme: any): any => ({
  fontWeight: 700,
  mb: 2,
  color: theme.palette.primary.main,
});

export const sectionHeaderStyles = (theme: any): any => ({
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  color: theme.palette.text.secondary,
});

export const metricsBoxStyles: any = {
  mt: 1,
  mb: 2,
};
