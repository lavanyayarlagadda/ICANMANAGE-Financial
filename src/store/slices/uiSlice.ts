import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UiState {
  activeTab: number;
  activePage: 'financials' | 'collections';
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;
  mobileMenuOpen: boolean;
  viewDialogOpen: boolean;
  viewDialogData: Record<string, unknown> | null;
  editDialogOpen: boolean;
  editDialogData: Record<string, unknown> | null;
  confirmDeleteOpen: boolean;
  confirmDeleteId: string | null;
  confirmDeleteType: string;
  snackbarOpen: boolean;
  snackbarMessage: string;
  snackbarSeverity: 'success' | 'error' | 'info' | 'warning';
}

const initialState: UiState = {
  activeTab: 0,
  activePage: 'financials',
  sidebarOpen: true,
  sidebarCollapsed: false,
  mobileMenuOpen: false,
  viewDialogOpen: false,
  viewDialogData: null,
  editDialogOpen: false,
  editDialogData: null,
  confirmDeleteOpen: false,
  confirmDeleteId: null,
  confirmDeleteType: '',
  snackbarOpen: false,
  snackbarMessage: '',
  snackbarSeverity: 'success',
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setActiveTab: (state, action: PayloadAction<number>) => {
      state.activeTab = action.payload;
    },
    setActivePage: (state, action: PayloadAction<'financials' | 'collections'>) => {
      state.activePage = action.payload;
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    toggleSidebarCollapse: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    toggleMobileMenu: (state) => {
      state.mobileMenuOpen = !state.mobileMenuOpen;
    },
    closeMobileMenu: (state) => {
      state.mobileMenuOpen = false;
    },
    openViewDialog: (state, action: PayloadAction<Record<string, unknown>>) => {
      state.viewDialogOpen = true;
      state.viewDialogData = action.payload;
    },
    closeViewDialog: (state) => {
      state.viewDialogOpen = false;
      state.viewDialogData = null;
    },
    openEditDialog: (state, action: PayloadAction<Record<string, unknown>>) => {
      state.editDialogOpen = true;
      state.editDialogData = action.payload;
    },
    closeEditDialog: (state) => {
      state.editDialogOpen = false;
      state.editDialogData = null;
    },
    openConfirmDelete: (state, action: PayloadAction<{ id: string; type: string }>) => {
      state.confirmDeleteOpen = true;
      state.confirmDeleteId = action.payload.id;
      state.confirmDeleteType = action.payload.type;
    },
    closeConfirmDelete: (state) => {
      state.confirmDeleteOpen = false;
      state.confirmDeleteId = null;
      state.confirmDeleteType = '';
    },
    showSnackbar: (state, action: PayloadAction<{ message: string; severity?: 'success' | 'error' | 'info' | 'warning' }>) => {
      state.snackbarOpen = true;
      state.snackbarMessage = action.payload.message;
      state.snackbarSeverity = action.payload.severity || 'success';
    },
    closeSnackbar: (state) => {
      state.snackbarOpen = false;
    },
  },
});

export const {
  setActiveTab,
  setActivePage,
  toggleSidebar,
  toggleSidebarCollapse,
  toggleMobileMenu,
  closeMobileMenu,
  openViewDialog,
  closeViewDialog,
  openEditDialog,
  closeEditDialog,
  openConfirmDelete,
  closeConfirmDelete,
  showSnackbar,
  closeSnackbar,
} = uiSlice.actions;
export default uiSlice.reducer;
