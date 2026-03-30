import { createTheme, alpha } from '@mui/material/styles';
import { themeConfig } from './themeConfig';

declare module '@mui/material/styles' {
  interface Palette {
    inputBackground: string;
    cardBorder: string;
    selectionBackground: string;
    tabActive: string;
    tabHover: string;
  }
  interface PaletteOptions {
    inputBackground?: string;
    cardBorder?: string;
    selectionBackground?: string;
    tabActive?: string;
    tabHover?: string;
  }
}

const { colors, typography, spacing } = themeConfig;

export const muiTheme = createTheme({
  palette: {
    primary: {
      main: colors.primary,
      light: colors.primaryLight,
      dark: colors.primaryDark,
      contrastText: colors.background,
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
      contrastText: '#FFFFFF',
    },
    warning: { main: colors.warning, contrastText: '#FFFFFF' },
    info: { main: colors.info, contrastText: '#FFFFFF' },
    success: { main: colors.success, contrastText: '#FFFFFF' },
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
    // Custom tokens
    inputBackground: colors.inputBackground,
    cardBorder: colors.cardBorder,
    selectionBackground: colors.selectionBackground,
    tabActive: colors.tabActive,
    tabHover: colors.tabHover,
    // Custom Slate Scale exposed to theme
    grey: {
      50: colors.slate[50],
      100: colors.slate[100],
      200: colors.slate[200],
      300: colors.slate[300],
      400: colors.slate[400],
      500: colors.slate[500],
      600: colors.slate[600],
      700: colors.slate[700],
      800: colors.slate[800],
      900: colors.slate[900],
    },
  },
  typography: {
    fontFamily: typography.fontFamily.primary,
    htmlFontSize: 13,
    fontSize: 13,
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
        html: {
          fontSize: '15px',
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
        },
        body: {
          backgroundColor: colors.background,
          color: colors.text.primary,
          fontFamily: typography.fontFamily.primary,
          minHeight: '100vh',
        },
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
            fontFamily: typography.fontFamily.primary,
            fontWeight: 600,
            fontSize: '11px',
            lineHeight: 'normal',
            color: colors.text.primary,
            backgroundColor: colors.surfaceAlt,
            borderBottom: `1px solid ${colors.border}`,
            padding: '10px 16px',
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontFamily: typography.fontFamily.primary,
          fontWeight: 600,
          fontSize: '11px',
          color: colors.text.primary,
          lineHeight: 'normal',
          letterSpacing: '0.03em',
        },
        body: {
          fontFamily: typography.fontFamily.primary,
          fontWeight: 400,
          fontSize: '12px',
          lineHeight: 'normal',
          color: colors.text.primary,
        },
        root: {
          padding: '12px 16px',
          borderBottom: `1px solid ${colors.border}`,
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: { '&:hover': { backgroundColor: alpha(colors.primary, 0.04) } },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          minHeight: 44,
        },
        indicator: {
          height: 3,
          borderRadius: '3px 3px 0 0',
          backgroundColor: colors.primary,
        },
      },
    },

    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontFamily: typography.fontFamily.primary,
          fontWeight: 500,
          fontSize: '13px',
          lineHeight: 'normal',
          color: colors.text.primary,
          minHeight: 44,
          padding: '10px 18px',
          '&.Mui-selected': {
            color: colors.text.primary,
            fontWeight: 600,
          },
        },
      },
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
