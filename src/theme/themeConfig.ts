import { colors } from './colors';
import { typography } from './typography';

/**
 * Global Theme Configuration – iCAN Manage
 */

export const themeConfig = {
  colors,
  typography,

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
