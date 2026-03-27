/**
 * Global Theme Configuration – iCAN Manage
 */

export const themeConfig = {
  colors: {
    primary: '#6B99C4',
    primaryLight: '#8BB3D6',
    primaryDark: '#4a7aa8',
    secondary: '#75A663',
    secondaryLight: '#92BA84',
    secondaryDark: '#5E8A4F',
    accent: '#DD7A43',
    accentLight: '#E89A6E',
    accentDark: '#c46530',
    error: '#e53e3e',
    errorLight: '#EF5350',
    errorDark: '#C62828',
    warning: '#DD7A43',
    info: '#6B99C4',
    success: '#75A663',
    background: '#f5f7fa',
    surface: '#ffffff',
    surfaceAlt: '#eef1f5',
    inputBackground: '#F0F4F8',
    text: {
      primary: '#0a1628',
      secondary: '#5c7a96',
      disabled: '#A0AEC0',
    },
    border: '#dde3ec',
    divider: '#dde3ec',
    cardBorder: '#E2E8F0',
    selectionBackground: '#F4F9FF',
    tabActive: 'rgba(107, 153, 196, 0.6)',
    tabHover: 'rgba(226, 232, 240, 1)',
  },

  logoColor: '#6B99C4',

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
  },

  status: {
    posted: { bg: '#E8F5E9', text: '#2E7D32' },
    completed: { bg: '#E3F2FD', text: '#1565C0' },
    reconciled: { bg: '#F3E5F5', text: '#7B1FA2' },
    needsReview: { bg: '#FFF3E0', text: '#E65100' },
    pendingReview: { bg: '#FFF8E1', text: '#F57F17' },
    match: { bg: '#E8F5E9', text: '#2E7D32' },
    improving: { bg: '#E8F5E9', text: '#2E7D32' },
    growing: { bg: '#E3F2FD', text: '#1565C0' },
    decreasing: { bg: '#FFEBEE', text: '#C62828' },
  },
} as const;

export type ThemeConfig = typeof themeConfig;
