import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Tenant {
  tenantId: string;
  displayName: string;
}

interface TenantState {
  tenants: Tenant[];
  selectedTenantId: string | null;
  isLoading: boolean;
  error: string | null;
}

const TENANT_STORAGE_KEY = 'ican_selected_tenant';

const initialState: TenantState = {
  tenants: [],
  selectedTenantId: sessionStorage.getItem(TENANT_STORAGE_KEY),
  isLoading: false,
  error: null,
};

const tenantSlice = createSlice({
  name: 'tenant',
  initialState,
  reducers: {
    setTenants: (state, action: PayloadAction<Tenant[]>) => {
      state.tenants = action.payload;
    },
    setSelectedTenantId: (state, action: PayloadAction<string>) => {
      state.selectedTenantId = action.payload;
      sessionStorage.setItem(TENANT_STORAGE_KEY, action.payload);
    },
    clearSelectedTenant: (state) => {
      state.selectedTenantId = null;
      sessionStorage.removeItem(TENANT_STORAGE_KEY);
    },
    setTenantLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setTenantError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setTenants,
  setSelectedTenantId,
  clearSelectedTenant,
  setTenantLoading,
  setTenantError,
} = tenantSlice.actions;
export default tenantSlice.reducer;
