import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  PaymentTransaction,
  PipRecord,
  RemittanceDetail,
  VarianceRecord,
  TrendsData,
  ForwardBalanceRecord,
  RecoupmentRecord,
  OtherAdjustmentRecord,
  AllTransaction,
  CollectionAccount,
  BankDepositEntity,
} from '@/types/financials';
import {
  mockPayments,
  mockPipRecords,
  mockRemittanceDetail,
  mockVarianceRecords,
  mockTrendsData,
  mockForwardBalances,
  mockRecoupments,
  mockOtherAdjustments,
  mockAllTransactions,
  mockCollections,
  mockBankDeposits,
} from '@/data/mockData';

interface FinancialsState {
  payments: PaymentTransaction[];
  pipRecords: PipRecord[];
  remittanceDetail: RemittanceDetail | null;
  varianceRecords: VarianceRecord[];
  trendsData: TrendsData | null;
  forwardBalances: ForwardBalanceRecord[];
  recoupments: RecoupmentRecord[];
  otherAdjustments: OtherAdjustmentRecord[];
  allTransactions: AllTransaction[];
  collections: CollectionAccount[];
  bankDeposits: BankDepositEntity[];
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
  forwardBalances: mockForwardBalances,
  recoupments: mockRecoupments,
  otherAdjustments: mockOtherAdjustments,
  allTransactions: mockAllTransactions,
  collections: mockCollections,
  bankDeposits: mockBankDeposits,
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
    deleteForwardBalance: (state, action: PayloadAction<string>) => {
      state.forwardBalances = state.forwardBalances.filter((f) => f.id !== action.payload);
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
  openAddDialog,
  closeAddDialog,
  deletePayment,
  deleteRecoupment,
  deleteAdjustment,
  deleteForwardBalance,
  deleteAllTransaction,
  deleteCollection,
  deleteBankDeposit,
} = financialsSlice.actions;
export default financialsSlice.reducer;

