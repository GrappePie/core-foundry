'use client';

import { SessionProvider } from 'next-auth/react';
import React from 'react';

interface AuthProviderProps {
    children: React.ReactNode;
}

/**
 * Componente wrapper para el SessionProvider de NextAuth.
 * Hace que los datos de la sesión estén disponibles en toda la aplicación
 * a través del hook `useSession`.
 */
export default function AuthProvider({ children }: AuthProviderProps) {
    return <SessionProvider>{children}</SessionProvider>;
}
