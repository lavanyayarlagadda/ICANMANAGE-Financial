/**
 * Application-wide constants for business logic and configuration.
 */

export const COMPANIES = {
  MINDPATH: 'mindpath',
  COGNITIVE_HEALTH_IT: 'cognitivehealthit',
} as const;

export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://10.0.1.48:8181/platform/api/v1'
};

export const MENU_STATUS = {
  VISIBLE: 'Visible',
  HIDDEN: 'Hidden',
  DISABLED: 'Disabled',
} as const;
