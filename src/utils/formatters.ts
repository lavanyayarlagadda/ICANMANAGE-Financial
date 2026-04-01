/**
 * Utility functions for formatting values throughout the application.
 * Reusable across all components.
 */

/**
 * Format a number as USD currency string.
 */
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

/**
 * Format a large number as a compact string (e.g., $1.2M).
 */
export const formatCompactCurrency = (value: number): string => {
  if (Math.abs(value) >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(2)}M`;
  }
  if (Math.abs(value) >= 1_000) {
    return `$${(value / 1_000).toFixed(1)}K`;
  }
  return formatCurrency(value);
};

/**
 * Format a number as a percentage string.
 */
export const formatPercent = (value: number, decimals = 2): string => {
  return `${value.toFixed(decimals)}%`;
};

/**
 * Format a number with commas.
 */
export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('en-US').format(value);
};

export const capitalize = (str: string | null | undefined): string => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Truncate text with ellipsis.
 */
export const truncate = (str: string | null | undefined, maxLength: number): string => {
  if (!str) return '';
  if (str.length <= maxLength) return str;
  return `${str.slice(0, maxLength)}…`;
};

/**
 * Get status color key from status string.
 */
export const getStatusKey = (status: string | null | undefined): string => {
  if (!status) return '';
  return status.toLowerCase().replace(/\s+/g, '');
};
