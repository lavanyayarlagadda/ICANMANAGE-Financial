import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import TermsPage from './TermsPage';

// Mock useNavigate
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: vi.fn(),
    };
});

describe('TermsPage', () => {
    it('renders the Terms and Conditions heading', () => {
        render(
            <MemoryRouter>
                <TermsPage />
            </MemoryRouter>
        );
        expect(screen.getByText('Terms and Conditions')).toBeInTheDocument();
    });

    it('renders terminology section', () => {
        render(
            <MemoryRouter>
                <TermsPage />
            </MemoryRouter>
        );
        expect(screen.getByText('Terminology')).toBeInTheDocument();
    });

    it('renders the copyright notice with the current year', () => {
        render(
            <MemoryRouter>
                <TermsPage />
            </MemoryRouter>
        );
        const currentYear = new Date().getFullYear().toString();
        expect(screen.getByText(new RegExp(`© COGNITIVEHEALTH.*${currentYear}`, 'i'))).toBeInTheDocument();
    });

    it('navigates back to login when the back button is clicked', () => {
        const mockNavigate = vi.fn();
        vi.mocked(useNavigate).mockReturnValue(mockNavigate);

        render(
            <MemoryRouter>
                <TermsPage />
            </MemoryRouter>
        );

        const backButton = screen.getByText(/Back to Login/i);
        fireEvent.click(backButton);

        expect(mockNavigate).toHaveBeenCalledWith('/login');
    });
});
