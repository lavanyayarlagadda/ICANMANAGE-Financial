import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface User {
    menus: any[];
    id: string;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    company: string;
    roleId: string;
    role: string;
}

interface AuthState {
    isAuthenticated: boolean;
    user: User | null;
    accessToken: string | null;
    refreshToken: string | null;
    error: string | null;
}

const AUTH_STORAGE_KEY = 'ican_auth_user';
const TOKEN_KEY = 'ican_access_token';
const REFRESH_TOKEN_KEY = 'ican_refresh_token';

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
    accessToken: localStorage.getItem(TOKEN_KEY),
    refreshToken: localStorage.getItem(REFRESH_TOKEN_KEY),
    error: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials(state, action: PayloadAction<{ user: User; accessToken: string; refreshToken: string }>) {
            const { user, accessToken, refreshToken } = action.payload;
            state.isAuthenticated = true;
            state.user = user;
            state.accessToken = accessToken;
            state.refreshToken = refreshToken;
            state.error = null;
            localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
            localStorage.setItem(TOKEN_KEY, accessToken);
            localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
        },
        updateToken(state, action: PayloadAction<{ accessToken: string; refreshToken: string }>) {
            state.accessToken = action.payload.accessToken;
            state.refreshToken = action.payload.refreshToken;
            localStorage.setItem(TOKEN_KEY, action.payload.accessToken);
            localStorage.setItem(REFRESH_TOKEN_KEY, action.payload.refreshToken);
        },
        loginFailure(state, action: PayloadAction<string>) {
            state.isAuthenticated = false;
            state.user = null;
            state.accessToken = null;
            state.refreshToken = null;
            state.error = action.payload;
            localStorage.removeItem(AUTH_STORAGE_KEY);
            localStorage.removeItem(TOKEN_KEY);
            localStorage.removeItem(REFRESH_TOKEN_KEY);
        },
        logout(state) {
            state.isAuthenticated = false;
            state.user = null;
            state.accessToken = null;
            state.refreshToken = null;
            state.error = null;
            localStorage.removeItem(AUTH_STORAGE_KEY);
            localStorage.removeItem(TOKEN_KEY);
            localStorage.removeItem(REFRESH_TOKEN_KEY);
            localStorage.removeItem('ican_inactivity_timeout');
        },
        clearError(state) {
            state.error = null;
        },
    },
});

export const { setCredentials, updateToken, loginFailure, logout, clearError } = authSlice.actions;

export default authSlice.reducer;
