import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { z } from 'zod';

export type MenuStatus = 'Active' | 'Hidden' | 'Disabled';

export interface MenuAccess {
    menuName: string;
    status: MenuStatus;
    subModules?: MenuAccess[];
}

export interface User {
    menus: MenuAccess[];
    id: string;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    company: string;
    roleId: string;
    role: string;
    accessibleModules: string[];
    defaultLandingPage: string;
    inactivityTimeout?: string;
    passwordPolicy?: string;
}

const menuStatusSchema = z.enum(['Active', 'Hidden', 'Disabled']);
const menuAccessSchema: z.ZodType<MenuAccess> = z.object({
    menuName: z.string(),
    status: menuStatusSchema,
    subModules: z.lazy(() => z.array(menuAccessSchema)).optional(),
}).passthrough();

const userSchema: z.ZodType<User> = z.object({
    menus: z.array(menuAccessSchema),
    id: z.string(),
    username: z.string(),
    email: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    company: z.string(),
    roleId: z.string(),
    role: z.string(),
    accessibleModules: z.array(z.string()),
    defaultLandingPage: z.string(),
    inactivityTimeout: z.string().optional(),
    passwordPolicy: z.string().optional(),
}).passthrough();

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
            const parsed = JSON.parse(storedUser);
            const result = userSchema.safeParse(parsed);
            if (result.success) {
                return result.data as User;
            }
            console.error('[AuthSlice] Invalid stored user format:', result.error.format());
            // Return parsed data anyway to avoid blocking the app if it's mostly correct
            return parsed as User;
        }
    } catch (e) {
        console.error("[AuthSlice] Failed to parse stored user", e);
    }
    return null;
};

const savedUser = loadUserFromStorage();
const savedToken = localStorage.getItem(TOKEN_KEY);
const savedRefreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);

console.log('[AuthSlice] Initializing state from storage:', {
    hasUser: !!savedUser,
    hasToken: !!savedToken,
    hasRefreshToken: !!savedRefreshToken
});

const initialState: AuthState = {
    isAuthenticated: !!savedToken, // Rely on token for initial auth status
    user: savedUser,
    accessToken: savedToken,
    refreshToken: savedRefreshToken,
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
