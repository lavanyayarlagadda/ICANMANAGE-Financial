/**
 * Centralized Color Palette – iCAN Manage
 */

export const colors = {
  // Brand Colors
  primary: '#6B99C4',
  primaryLight: '#8BB3D6',
  primaryDark: '#4a7aa8',
  secondary: '#75A663',
  secondaryLight: '#92BA84',
  secondaryDark: '#5E8A4F',
  accent: '#DD7A43',
  accentLight: '#E89A6E',
  accentDark: '#c46530',

  // Semantic Colors
  error: '#e53e3e',
  errorLight: '#EF5350',
  errorDark: '#C62828',
  warning: '#DD7A43',
  info: '#6B99C4',
  success: '#75A663',
  amber: '#D97706',

  // Grays / Neutrals (Slate Scale)
  slate: {
    50: '#F8FAFC',
    100: '#F1F5F9',
    200: '#E2E8F0',
    300: '#CBD5E1',
    400: '#94A3B8',
    500: '#64748B',
    600: '#475569',
    700: '#334155',
    800: '#1E293B',
    900: '#0F172A',
  },

  // Surface & Layout
  background: '#f5f7fa',
  surface: '#ffffff',
  surfaceAlt: '#eef1f5',
  surfaceSubtle: '#FAFBFC',
  surfaceInfo: '#eff6ff',
  surfaceInfoHover: '#dbeafe',
  border: '#dde3ec',
  divider: '#dde3ec',
  cardBorder: '#E2E8F0',
  selectionBackground: '#F4F9FF',
  inputBackground: '#F8FAFC',
  footerBg: '#0A1929',

  // Text
  text: {
    primary: '#0a1628',
    secondary: '#5c7a96',
    disabled: '#A0AEC0',
    muted: '#64748B',
    heading: '#0a1628',
  },

  // Specialized Transaction & Category Colors
  status: {
    posted: { bg: '#E8F5E9', text: '#2E7D32' },
    completed: { bg: '#E3F2FD', text: '#1565C0' },
    reconciled: { bg: '#F3E5F5', text: '#7B1FA2' },
    needsReview: { bg: '#FFF3E0', text: '#E65100' },
    pendingReview: { bg: '#FFF8E1', text: '#F57F17' },
    match: { bg: '#E8F5E9', text: '#2E7D32' },
    stable: { bg: '#F0FDF4', text: '#166534' },
    critical: { bg: '#FEF2F2', text: '#991B1B' },
    disputed: { bg: '#FFEBEE', text: '#C62828' },
    approved: { bg: '#E3F2FD', text: '#1565C0' },
    pending: { bg: '#FFF8E1', text: '#F57F17' },
    recovered: { bg: '#E8F5E9', text: '#2E7D32' },
    partial: { bg: '#FFF3E0', text: '#E65100' },
    writtenOff: { bg: '#ECEFF1', text: '#546E7A' },
    applied: { bg: '#E3F2FD', text: '#1565C0' },
    reversed: { bg: '#F3E5F5', text: '#7B1FA2' },
    underReview: { bg: '#FFF8E1', text: '#F57F17' },
  },

  // Chart Accents
  charts: {
    blue: '#6B99C4',
    orange: '#D97706',
    green: '#65A30D',
    gray: '#E2E8F0',
    red: '#DC2626',
    purple: '#7B1FA2',
    teal: '#00838F',
  },

  // Interactions (Legacy Alpha Support)
  tabActive: 'rgba(107, 153, 196, 0.6)',
  tabHover: 'rgba(240, 244, 248, 0.8)',

  // Suspense Categories
  suspense: {
    medicare: { bg: '#e0f2fe', text: '#0369a1' },
    patient: { bg: '#f3e8ff', text: '#7e22ce' },
    tax: { bg: '#f1f5f9', text: '#475569' },
    cross: { bg: '#fee2e2', text: '#b91c1c' },
    remittance: { bg: '#ffedd5', text: '#9a3412' },
  },

  // Miscellaneous & Overlays
  overlay: {
    white: 'rgba(255, 255, 255, 0.7)',
    black: 'rgba(0, 0, 0, 0.1)',
  },
  
  // Specific brand/legacy colors
  amberDark: '#b45309',

  // Suspense Screen Specifics
  suspenseScreen: {
    borderLight: '#eee',
    borderMedium: '#e2e8f0',
    bgLight: '#f1f5f9',
    bgAlt: '#f8fafc',
    textMuted: '#64748b',
    textLight: '#94a3b8',
    textSlate: '#475569',
    textNavy: 'rgb(10, 22, 40)',
    linkBlue: '#0284c7',
  },

  // Dictionary Drawer Specifics
  dictionaryDrawer: {
    bg: '#ffffff',
    bgAlt: '#f1f5f9',
    bgHover: '#e2e8f0',
    bgTip: '#f0f7ff',
    bgFooter: '#fafafa',
    border: '#e2e8f0',
    borderAlt: '#f1f5f9',
    textHeading: '#1e293b',
    textBody: '#475569',
    textMuted: '#64748b',
    textLight: '#94a3b8',
    textAccent: '#3b82f6',
    textNavy: '#334155',
  },

  // Tabs Specifics
  tabs: {
    mainBg: '#ffffff',
    subBg: '#fcfcfc',
    activeBg: 'rgba(107, 153, 196, 0.6)',
    activeBgHover: 'rgba(107, 153, 196, 0.7)',
    inactiveBg: 'rgba(240, 244, 248, 0.8)',
    inactiveBgHover: 'rgba(226, 232, 240, 1)',
    textActive: '#ffffff',
    textInactive: 'rgb(100, 116, 139)',
    textTitle: 'rgb(10, 22, 40)',
  },
} as const;
