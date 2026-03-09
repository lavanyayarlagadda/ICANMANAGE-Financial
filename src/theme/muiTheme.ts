import { createTheme } from '@mui/material/styles';
import { themeConfig } from './themeConfig';

const { colors, typography, spacing } = themeConfig;

export const muiTheme = createTheme({
  palette: {
    primary: {
      main: colors.primary,
      light: colors.primaryLight,
      dark: colors.primaryDark,
      contrastText: '#f5f7fa',
    },
    secondary: {
      main: colors.secondary,
      light: colors.secondaryLight,
      dark: colors.secondaryDark,
      contrastText: '#FFFFFF',
    },
    error: {
      main: colors.error,
      light: colors.errorLight,
      dark: colors.errorDark,
    },
    warning: { main: colors.warning },
    info: { main: colors.info },
    success: { main: colors.success },
    background: {
      default: colors.background,
      paper: colors.surface,
    },
    text: {
      primary: colors.text.primary,
      secondary: colors.text.secondary,
      disabled: colors.text.disabled,
    },
    divider: colors.divider,
  },
  typography: {
    fontFamily: typography.fontFamily.primary,
    fontSize: 14,
    h1: { fontSize: typography.fontSize.h1, fontWeight: typography.fontWeight.bold, lineHeight: 1.2, fontFamily: typography.fontFamily.headline },
    h2: { fontSize: typography.fontSize.h2, fontWeight: typography.fontWeight.bold, lineHeight: 1.3, fontFamily: typography.fontFamily.headline },
    h3: { fontSize: typography.fontSize.h3, fontWeight: typography.fontWeight.semibold, lineHeight: 1.3, fontFamily: typography.fontFamily.headline },
    h4: { fontSize: typography.fontSize.h4, fontWeight: typography.fontWeight.semibold, lineHeight: 1.4, fontFamily: typography.fontFamily.headline },
    h5: { fontSize: typography.fontSize.h5, fontWeight: typography.fontWeight.semibold, lineHeight: 1.4, fontFamily: typography.fontFamily.headline },
    h6: { fontSize: typography.fontSize.h6, fontWeight: typography.fontWeight.semibold, lineHeight: 1.5, fontFamily: typography.fontFamily.headline },
    body1: { fontSize: typography.fontSize.body, fontWeight: typography.fontWeight.regular },
    body2: { fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.regular },
    subtitle1: { fontSize: typography.fontSize.md, fontWeight: typography.fontWeight.medium },
    subtitle2: { fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.medium },
    caption: { fontSize: typography.fontSize.xs, fontWeight: typography.fontWeight.regular },
    button: { fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.semibold, textTransform: 'none' },
  },
  shape: { borderRadius: spacing.borderRadius.md },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: { backgroundColor: colors.background, fontFamily: typography.fontFamily.primary },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: spacing.borderRadius.md,
          padding: '8px 20px',
          fontWeight: typography.fontWeight.semibold,
          boxShadow: 'none',
          '&:hover': { boxShadow: 'none' },
        },
        contained: { '&:hover': { boxShadow: themeConfig.shadows.card } },
        sizeSmall: { padding: '4px 12px', fontSize: typography.fontSize.xs },
      },
      defaultProps: { disableElevation: true },
    },
    MuiCard: {
      styleOverrides: {
        root: { borderRadius: spacing.borderRadius.lg, boxShadow: themeConfig.shadows.card, border: `1px solid ${colors.border}` },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { borderRadius: spacing.borderRadius.sm, fontWeight: typography.fontWeight.medium, fontSize: typography.fontSize.xs },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          '& .MuiTableCell-head': {
            backgroundColor: colors.surfaceAlt,
            fontWeight: typography.fontWeight.semibold,
            fontSize: typography.fontSize.xs,
            color: colors.text.secondary,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            borderBottom: `2px solid ${colors.border}`,
            padding: '12px 16px',
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: { fontSize: typography.fontSize.sm, padding: '12px 16px', borderBottom: `1px solid ${colors.border}` },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: { '&:hover': { backgroundColor: `${colors.primaryLight}08` } },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: { textTransform: 'none', fontWeight: typography.fontWeight.medium, fontSize: typography.fontSize.sm, minHeight: 44, padding: '8px 16px' },
      },
    },
    MuiTabs: {
      styleOverrides: { indicator: { height: 3, borderRadius: '3px 3px 0 0' } },
    },
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: 'none' },
        elevation1: { boxShadow: themeConfig.shadows.card },
      },
    },
    MuiAppBar: {
      styleOverrides: { root: { boxShadow: themeConfig.shadows.card } },
    },
    MuiTooltip: {
      styleOverrides: { tooltip: { fontSize: typography.fontSize.xs, borderRadius: spacing.borderRadius.sm } },
    },
    MuiIconButton: {
      styleOverrides: { root: { borderRadius: spacing.borderRadius.sm } },
    },
  },
});
