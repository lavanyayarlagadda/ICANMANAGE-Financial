import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface User {
    id: string;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    company: string;
    role: string;
    accessibleModules: string[];
    menus: { menuName: string; status: 'Active' | 'Hidden' | 'Disabled' }[];
    defaultLandingPage: string;
}

interface AuthState {
    isAuthenticated: boolean;
    user: User | null;
    error: string | null;
}

const initialState: AuthState = {
    isAuthenticated: false,
    user: null,
    error: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginSuccess(state, action: PayloadAction<User>) {
            state.isAuthenticated = true;
            state.user = action.payload;
            state.error = null;
        },
        loginFailure(state, action: PayloadAction<string>) {
            state.isAuthenticated = false;
            state.user = null;
            state.error = action.payload;
        },
        logout(state) {
            state.isAuthenticated = false;
            state.user = null;
            state.error = null;
        },
        clearError(state) {
            state.error = null;
        },
    },
});

export const { loginSuccess, loginFailure, logout, clearError } = authSlice.actions;

export default authSlice.reducer;
