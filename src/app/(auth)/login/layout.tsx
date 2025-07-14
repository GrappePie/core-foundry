import React, { Suspense } from 'react';

/**
 * Layout simple para las páginas de autenticación, centrado en la pantalla.
 */
export default function AuthLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <div className="bg-background w-screen h-screen flex items-center justify-center">
            <Suspense fallback={null}>
                {children}
            </Suspense>
        </div>
    );
}
