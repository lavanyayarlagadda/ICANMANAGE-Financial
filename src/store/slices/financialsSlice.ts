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
} from '@/types/financials';

export interface ProfilerFilter {
  id: string;
  field: string;
  operator: string;
  value: string;
}
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
  loading: boolean;
  error: string | null;
  selectedPaymentId: string | null;
  showRemittanceDetail: boolean;
  addDialogOpen: boolean;
  addDialogType: string;
  profilerFilters: ProfilerFilter[];
  profilerBannerOpen: boolean;
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
  loading: false,
  error: null,
  selectedPaymentId: null,
  showRemittanceDetail: false,
  addDialogOpen: false,
  addDialogType: '',
  profilerFilters: [],
  profilerBannerOpen: false,
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
    setProfilerFilters: (state, action: PayloadAction<ProfilerFilter[]>) => {
      state.profilerFilters = action.payload;
    },
    removeProfilerFilter: (state, action: PayloadAction<string>) => {
      state.profilerFilters = state.profilerFilters.filter((f) => f.id !== action.payload);
    },
    clearProfilerFilters: (state) => {
      state.profilerFilters = [];
    },
    setProfilerBannerOpen: (state, action: PayloadAction<boolean>) => {
      state.profilerBannerOpen = action.payload;
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
  setProfilerFilters,
  removeProfilerFilter,
  clearProfilerFilters,
  setProfilerBannerOpen,
} = financialsSlice.actions;
export default financialsSlice.reducer;
