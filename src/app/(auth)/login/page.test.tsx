import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import LoginPage from './page';
import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';

// Mock de next-auth/react y next/navigation
jest.mock('next-auth/react', () => ({
  signIn: jest.fn(),
}));
jest.mock('next/navigation', () => ({
  useSearchParams: jest.fn(),
}));

describe('LoginPage', () => {
  const mockGet = jest.fn();

  beforeEach(() => {
    // Por defecto devolvemos el callbackUrl '/dashboard'
    mockGet.mockReturnValueOnce('/custom-callback');
    (useSearchParams as jest.Mock).mockReturnValue({ get: mockGet });
  });

  it('renderiza el título y botón de login', () => {
    render(<LoginPage />);
    expect(screen.getByText('Bienvenido')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Iniciar sesión con Google/i })).toBeInTheDocument();
  });

  it('invoca signIn con Google y callbackUrl correcto al hacer click', () => {
    render(<LoginPage />);
    const button = screen.getByRole('button', { name: /Iniciar sesión con Google/i });
    fireEvent.click(button);
    expect(signIn).toHaveBeenCalledWith('google', { callbackUrl: '/custom-callback' });
  });
});
