'use client';

// Force dynamic rendering to avoid prerender error with useSearchParams
export const dynamic = 'force-dynamic';

import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';

/**
 * Página de inicio de sesión.
 * Proporciona un método simple para que los usuarios se autentiquen.
 */
export default function LoginPage() {
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';

    return (
        <div className="w-full max-w-sm p-8 space-y-6 bg-surface rounded-xl shadow-lg">
            <h1 className="text-3xl font-bold text-center text-white">
                Bienvenido
            </h1>
            <p className="text-center text-text-secondary">
                Inicia sesión para acceder a tu fábrica.
            </p>
            <button
                onClick={() => signIn('google', { callbackUrl })}
                className="w-full px-4 py-3 font-semibold text-white bg-primary rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background focus:ring-primary transition-colors"
            >
                Iniciar sesión con Google
            </button>
            {/* Aquí podrías añadir un formulario para el proveedor de 'Credentials' */}
        </div>
    );
}
