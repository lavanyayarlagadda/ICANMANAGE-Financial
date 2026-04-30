import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import LoginPage from './LoginPage';
import { useLoginPage } from './LoginPage.hook';

// Mock the hook
vi.mock('./LoginPage.hook', () => ({
    useLoginPage: vi.fn(),
}));

describe('LoginPage', () => {
    const mockUseLoginPage = vi.mocked(useLoginPage);

    const defaultMockValue = {
        username: '',
        setUsername: vi.fn(),
        password: '',
        setPassword: vi.fn(),
        showPassword: false,
        errorMsg: '',
        isLoading: false,
        togglePasswordVisibility: vi.fn(),
        handleMouseDownPassword: vi.fn(),
        handleLogin: vi.fn(),
    };

    beforeEach(() => {
        mockUseLoginPage.mockReturnValue(defaultMockValue);
    });

    it('renders login elements correctly', () => {
        render(
            <MemoryRouter>
                <LoginPage />
            </MemoryRouter>
        );
        expect(screen.getByText('iCAN Manage')).toBeInTheDocument();
        expect(screen.getByText('Username')).toBeInTheDocument();
        expect(screen.getByText('Password')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Sign In/i })).toBeInTheDocument();
    });

    it('displays error message when provided', () => {
        mockUseLoginPage.mockReturnValue({
            ...defaultMockValue,
            errorMsg: 'Invalid credentials',
        });

        render(
            <MemoryRouter>
                <LoginPage />
            </MemoryRouter>
        );
        expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });

    it('shows loading state on submit button', () => {
        mockUseLoginPage.mockReturnValue({
            ...defaultMockValue,
            isLoading: true,
        });

        render(
            <MemoryRouter>
                <LoginPage />
            </MemoryRouter>
        );
        expect(screen.getByText('Signing In...')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Signing In/i })).toBeDisabled();
    });

    it('calls handleLogin on form submission', () => {
        const handleLogin = vi.fn((e) => e.preventDefault());
        mockUseLoginPage.mockReturnValue({
            ...defaultMockValue,
            handleLogin,
        });

        render(
            <MemoryRouter>
                <LoginPage />
            </MemoryRouter>
        );

        const form = screen.getByRole('button', { name: /Sign In/i });
        fireEvent.click(form);

        expect(handleLogin).toHaveBeenCalled();
    });
});
