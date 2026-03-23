import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  PaymentTransaction,
  PipRecord,
  RemittanceDetail,
  VarianceRecord,
  TrendsData,
  RecoupmentRecord,
  OtherAdjustmentRecord,
  AllTransaction,
  CollectionAccount,
  BankDepositEntity,
  ForwardBalanceNotice,
} from '@/types/financials';

import {
  mockPayments,
  mockPipRecords,
  mockRemittanceDetail,
  mockVarianceRecords,
  mockTrendsData,
  mockRecoupments,
  mockOtherAdjustments,
  mockAllTransactions,
  mockCollections,
  mockBankDeposits,
  mockForwardBalanceNotices,
} from '@/data/mockData';


interface FinancialsState {
  payments: PaymentTransaction[];
  pipRecords: PipRecord[];
  remittanceDetail: RemittanceDetail | null;
  varianceRecords: VarianceRecord[];
  trendsData: TrendsData | null;
  recoupments: RecoupmentRecord[];
  otherAdjustments: OtherAdjustmentRecord[];
  allTransactions: AllTransaction[];
  collections: CollectionAccount[];
  bankDeposits: BankDepositEntity[];
  forwardBalanceNotices: ForwardBalanceNotice[];
  remittanceClaims: any[];
  selectedClaimIndex: number;
  loading: boolean;

  error: string | null;
  selectedPaymentId: string | null;
  showRemittanceDetail: boolean;
  addDialogOpen: boolean;
  addDialogType: string;
}

const initialState: FinancialsState = {
  payments: mockPayments,
  pipRecords: mockPipRecords,
  remittanceDetail: mockRemittanceDetail,
  varianceRecords: mockVarianceRecords,
  trendsData: mockTrendsData,
  recoupments: mockRecoupments,
  otherAdjustments: mockOtherAdjustments,
  allTransactions: mockAllTransactions,
  collections: mockCollections,
  bankDeposits: mockBankDeposits,
  forwardBalanceNotices: mockForwardBalanceNotices,
  remittanceClaims: [],
  selectedClaimIndex: 0,
  loading: false,
  error: null,
  selectedPaymentId: null,
  showRemittanceDetail: false,
  addDialogOpen: false,
  addDialogType: '',
};

const financialsSlice = createSlice({
  name: 'financials',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setSelectedPaymentId: (state, action: PayloadAction<string | null>) => {
      state.selectedPaymentId = action.payload;
    },
    setPayments: (state, action: PayloadAction<PaymentTransaction[]>) => {
      state.payments = action.payload;
    },
    setShowRemittanceDetail: (state, action: PayloadAction<boolean>) => {
      state.showRemittanceDetail = action.payload;
    },
    setRemittanceDetail: (state, action: PayloadAction<RemittanceDetail | null>) => {
      state.remittanceDetail = action.payload;
    },
    setRemittanceClaims: (state, action: PayloadAction<any[]>) => {
      state.remittanceClaims = action.payload;
    },
    setSelectedClaimIndex: (state, action: PayloadAction<number>) => {
      state.selectedClaimIndex = action.payload;
    },
    openAddDialog: (state, action: PayloadAction<string>) => {
      state.addDialogOpen = true;
      state.addDialogType = action.payload;
    },
    closeAddDialog: (state) => {
      state.addDialogOpen = false;
      state.addDialogType = '';
    },
    deletePayment: (state, action: PayloadAction<string>) => {
      state.payments = state.payments.filter((p) => p.id !== action.payload);
    },
    deleteRecoupment: (state, action: PayloadAction<string>) => {
      state.recoupments = state.recoupments.filter((r) => r.id !== action.payload);
    },
    deleteAdjustment: (state, action: PayloadAction<string>) => {
      state.otherAdjustments = state.otherAdjustments.filter((a) => a.id !== action.payload);
    },
    deleteAllTransaction: (state, action: PayloadAction<string>) => {
      state.allTransactions = state.allTransactions.filter((t) => t.id !== action.payload);
    },
    deleteCollection: (state, action: PayloadAction<string>) => {
      state.collections = state.collections.filter((c) => c.id !== action.payload);
    },
    deleteBankDeposit: (state, action: PayloadAction<{ entityId: string; itemId: string }>) => {
      const entity = state.bankDeposits.find(e => e.id === action.payload.entityId);
      if (entity) {
        entity.items = entity.items.filter(i => i.id !== action.payload.itemId);
      }
    },
  },
});

export const {
  setLoading,
  setError,
  setSelectedPaymentId,
  setPayments,
  setShowRemittanceDetail,
  setRemittanceDetail,
  setRemittanceClaims,
  setSelectedClaimIndex,
  openAddDialog,
  closeAddDialog,
  deletePayment,
  deleteRecoupment,
  deleteAdjustment,
  deleteAllTransaction,
  deleteCollection,
  deleteBankDeposit,
} = financialsSlice.actions;
export default financialsSlice.reducer;

