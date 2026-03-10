import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface MenuAccess {
    menuName: string;
    status: 'Active' | 'Hidden' | 'Disabled';
    subModules?: MenuAccess[];
}

export interface User {
    id: string;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    company: string;
    role: string;
    accessibleModules: string[];
    menus: MenuAccess[];
    defaultLandingPage: string;
    inactivityTimeout: string;
    passwordPolicy: string;
}

interface AuthState {
    isAuthenticated: boolean;
    user: User | null;
    error: string | null;
}

const AUTH_STORAGE_KEY = 'ican_auth_user';

const loadUserFromStorage = (): User | null => {
    try {
        const storedUser = localStorage.getItem(AUTH_STORAGE_KEY);
        if (storedUser) {
            return JSON.parse(storedUser) as User;
        }
    } catch (e) {
        console.error("Failed to parse stored user", e);
    }
    return null;
};

const savedUser = loadUserFromStorage();

const initialState: AuthState = {
    isAuthenticated: !!savedUser,
    user: savedUser,
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
            localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(action.payload));
        },
        loginFailure(state, action: PayloadAction<string>) {
            state.isAuthenticated = false;
            state.user = null;
            state.error = action.payload;
            localStorage.removeItem(AUTH_STORAGE_KEY);
        },
        logout(state) {
            state.isAuthenticated = false;
            state.user = null;
            state.error = null;
            localStorage.removeItem(AUTH_STORAGE_KEY);
        },
        clearError(state) {
            state.error = null;
        },
    },
});

export const { loginSuccess, loginFailure, logout, clearError } = authSlice.actions;

export default authSlice.reducer;
