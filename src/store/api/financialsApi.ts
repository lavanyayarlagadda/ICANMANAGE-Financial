/**
 * Financials API Central Hub.
 * This file re-exports all endpoints from the modularized API slices
 * to maintain backward compatibility with existing components.
 */

export * from './paymentsApi';
export * from './variancesApi';
export * from './transactionsApi';
export * from './reconciliationApi';
export * from './analyticsApi';
export * from './otherApi';

export { baseApi as financialsApi } from './baseApi';
