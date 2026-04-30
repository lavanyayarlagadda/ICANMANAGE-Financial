import { describe, it, expect } from 'vitest';
import { 
  formatCurrency, 
  formatDate, 
  formatDateForFilename, 
  formatCompactCurrency, 
  capitalize 
} from './formatters';

describe('formatters utility', () => {
  
  describe('formatCurrency', () => {
    it('should format numbers to USD currency', () => {
      expect(formatCurrency(1234.56)).toBe('$1,234.56');
      expect(formatCurrency(0)).toBe('$0.00');
    });

    it('should handle string inputs', () => {
      expect(formatCurrency('1234.56')).toBe('$1,234.56');
    });

    it('should return "-" for null or undefined', () => {
      expect(formatCurrency(null)).toBe('-');
      expect(formatCurrency(undefined)).toBe('-');
      expect(formatCurrency('')).toBe('-');
    });

    it('should handle invalid string inputs', () => {
      expect(formatCurrency('abc')).toBe('$0.00');
    });
  });

  describe('formatDate', () => {
    it('should format ISO date strings to MM/dd/yyyy', () => {
      const result = formatDate('2023-12-25');
      expect(result).toMatch(/^\d{2}[/-]\d{2}[/-]\d{4}$/);
    });

    it('should return empty string for null/undefined', () => {
      expect(formatDate(null)).toBe('');
      expect(formatDate(undefined)).toBe('');
    });
  });

  describe('formatDateForFilename', () => {
    it('should format dates as MM-DD-YYYY for files', () => {
      expect(formatDateForFilename('2023-12-25')).toBe('12-25-2023');
    });

    it('should convert slashes to dashes', () => {
      expect(formatDateForFilename('12/25/2023')).toBe('12-25-2023');
    });
  });

  describe('formatCompactCurrency', () => {
    it('should format millions with M suffix', () => {
      expect(formatCompactCurrency(1200000)).toBe('$1.20M');
    });

    it('should format thousands with K suffix', () => {
      expect(formatCompactCurrency(1500)).toBe('$1.5K');
    });

    it('should format small numbers normally', () => {
      expect(formatCompactCurrency(500)).toBe('$500.00');
    });
  });

  describe('capitalize', () => {
    it('should capitalize the first letter and lowercase the rest', () => {
      expect(capitalize('HELLO')).toBe('Hello');
      expect(capitalize('world')).toBe('World');
      expect(capitalize('')).toBe('');
    });
  });

});
