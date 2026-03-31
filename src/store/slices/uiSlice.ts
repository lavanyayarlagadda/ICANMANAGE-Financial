import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UiState {
  activeTab: number;
  activeSubTab: number;
  activePage: 'financials' | 'collections';
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;
  mobileMenuOpen: boolean;
  viewDialogOpen: boolean;
  viewDialogData: any | null;
  editDialogOpen: boolean;
  editDialogData: any | null;
  confirmDeleteOpen: boolean;
  confirmDeleteId: string | null;
  confirmDeleteType: string;
  snackbarOpen: boolean;
  snackbarMessage: string;
  snackbarSeverity: 'success' | 'error' | 'info' | 'warning';
  activeExportType: 'pdf' | 'xlsx' | null;
  isReloading: boolean;
  isDrillingDown: boolean;
  isGlobalFetching: boolean;
  actionTriggers: {
    print: number;
    reload: number;
    export: number;
  };
}

const initialState: UiState = {
  activeTab: 0,
  activeSubTab: 0,
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
  activeExportType: null,
  isReloading: false,
  isDrillingDown: false,
  isGlobalFetching: false,
  actionTriggers: {
    print: 0,
    reload: 0,
    export: 0,
  },
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setActiveTab: (state, action: PayloadAction<number>) => {
      state.activeTab = action.payload;
    },
    setActiveSubTab: (state, action: PayloadAction<number>) => {
      state.activeSubTab = action.payload;
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
    openViewDialog: (state, action: PayloadAction<any>) => {
      state.viewDialogOpen = true;
      state.viewDialogData = action.payload;
    },
    closeViewDialog: (state) => {
      state.viewDialogOpen = false;
      state.viewDialogData = null;
    },
    openEditDialog: (state, action: PayloadAction<any>) => {
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
    triggerPrint: (state) => {
      state.actionTriggers.print += 1;
    },
    triggerReload: (state) => {
      state.actionTriggers.reload += 1;
    },
    triggerExport: (state) => {
      state.actionTriggers.export += 1;
    },
    setActiveExportType: (state, action: PayloadAction<'pdf' | 'xlsx' | null>) => {
      state.activeExportType = action.payload;
    },
    setIsReloading: (state, action: PayloadAction<boolean>) => {
      state.isReloading = action.payload;
    },
    setIsDrillingDown: (state, action: PayloadAction<boolean>) => {
      state.isDrillingDown = action.payload;
    },
    setIsGlobalFetching: (state, action: PayloadAction<boolean>) => {
      state.isGlobalFetching = action.payload;
    },
  },
});

export const {
  setActiveTab,
  setActiveSubTab,
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
  triggerPrint,
  triggerReload,
  triggerExport,
  setActiveExportType,
  setIsReloading,
  setIsDrillingDown,
  setIsGlobalFetching,
} = uiSlice.actions;
export default uiSlice.reducer;
