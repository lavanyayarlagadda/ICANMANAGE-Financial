import { RawRemittanceClaimsResponse } from '@/interfaces/api';
import { RemittanceDetail } from '@/interfaces/financials';

export const isRemittanceDetail = (value: unknown): value is RemittanceDetail => {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as Partial<RemittanceDetail>;
  return (
    typeof candidate.paymentDate === 'string' &&
    typeof candidate.transactionNo === 'string' &&
    typeof candidate.paymentAmount === 'number' &&
    typeof candidate.payerName === 'string'
  );
};

export const normalizeRemittanceClaims = (value: RawRemittanceClaimsResponse): RemittanceDetail[] => {
  if (Array.isArray(value)) {
    return value.filter(isRemittanceDetail);
  }

  if ('data' in value && Array.isArray(value.data)) {
    return value.data.filter(isRemittanceDetail);
  }

  return isRemittanceDetail(value) ? [value] : [];
};
