import { colors } from './colors';

/**
 * Global Theme Configuration – iCAN Manage
 */

export const themeConfig = {
  colors,

  logoColor: colors.primary,

  typography: {
    fontFamily: {
      primary: '"Inter", "Segoe UI", system-ui, -apple-system, sans-serif',
      headline: '"Space Grotesk", "Inter", "Segoe UI", system-ui, sans-serif',
      secondary: '"Inter", "Segoe UI", system-ui, -apple-system, sans-serif',
      mono: '"JetBrains Mono", "Fira Code", monospace',
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.8125rem',
      body: '0.875rem',
      md: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      h6: '1.125rem',
      h5: '1.25rem',
      h4: '1.5rem',
      h3: '1.75rem',
      h2: '2rem',
      h1: '2.5rem',
    },
    fontWeight: {
      light: 300,
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
  },

  spacing: {
    borderRadius: {
      sm: 4,
      md: 8,
      lg: 12,
      xl: 16,
    },
  },

  shadows: {
    card: '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06)',
    cardHover: '0 4px 12px rgba(0,0,0,0.12)',
    elevated: '0 8px 24px rgba(0,0,0,0.12)',
    dropdown: '0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)',
  },

  status: colors.status,
} as const;

export type ThemeConfig = typeof themeConfig;
