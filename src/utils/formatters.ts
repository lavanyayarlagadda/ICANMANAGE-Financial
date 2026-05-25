import { format, parseISO, isValid } from 'date-fns';
import { DATE_FORMATS } from '@/constants/common';

/**
 * Utility functions for formatting values throughout the application.
 * Reusable across all components.
 */

/**
 * Format a number as USD currency string.
 */
export const formatCurrency = (value: number | string | null | undefined): string => {
  if (value === 0 || value === '0') {
    return '$0.00';
  }
  if (value === null || value === undefined || value === '') {
    return '-';
  }
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(numValue)) {
    return '$0.00';
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(numValue));
};

/**
 * Format a date string using the standard display format.
 */
export const formatDate = (dateStr: string | null | undefined): string => {
  if (!dateStr) return '';

  // If it's already in the display format, return it
  const displayPattern = DATE_FORMATS.DISPLAY === 'MM/dd/yyyy' ? /^\d{2}\/\d{2}\/\d{4}$/ : /^\d{2}-\d{2}-\d{4}$/;
  if (displayPattern.test(dateStr)) return dateStr;

  try {
    const date = parseISO(dateStr);
    if (isValid(date)) {
      return format(date, DATE_FORMATS.DISPLAY);
    }

    // Fallback to native Date for non-ISO formats
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) {
      return format(d, DATE_FORMATS.DISPLAY);
    }

    return dateStr;
  } catch {
    return dateStr;
  }
};

/**
 * Format a date string with time using the standard display format.
 */
export const formatDateTime = (dateStr: string | null | undefined): string => {
  if (!dateStr) return '';

  try {
    const date = new Date(dateStr);
    if (!isNaN(date.getTime())) {
      const formatted = new Intl.DateTimeFormat('en-US', {
        timeZone: 'America/New_York',
        month: 'numeric',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      }).format(date);
      return `${formatted}`;
    }
    return dateStr;
  } catch {
    return dateStr;
  }
};

/**
 * Format a date string for use in filenames (MM-DD-YYYY).
 */
export const formatDateForFilename = (dateStr: string | null | undefined): string => {
  if (!dateStr) return '';
  try {
    const date = parseISO(dateStr);
    if (isValid(date)) {
      return format(date, 'MM-dd-yyyy');
    }
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) {
      return format(d, 'MM-dd-yyyy');
    }
    // If it's already MM/DD/YYYY, convert to MM-DD-YYYY
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) {
      return dateStr.replace(/\//g, '-');
    }
    return dateStr;
  } catch {
    return dateStr;
  }
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
 * Format a percentage number for display (up to 2 decimal places, no trailing zeros).
 */
export const formatPercentValue = (
  value: number | string | null | undefined,
  maxDecimals = 2,
): string => {
  if (value === null || value === undefined || value === '') return '—';
  const num = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(num)) return '—';
  const factor = 10 ** maxDecimals;
  const rounded = Math.round(Math.abs(num) * factor) / factor;
  return String(rounded);
};

/**
 * Format a number as a percentage string.
 */
export const formatPercent = (value: number, decimals = 2): string => {
  return `${formatPercentValue(value, decimals)}%`;
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
