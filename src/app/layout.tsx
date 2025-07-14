import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import AuthProvider from '@/components/core/AuthProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'SaaS Gamificado',
    description: 'Plataforma SaaS modular con interfaz de juego',
};

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="es">
        <body className={inter.className}>
        {/* Envolvemos toda la aplicación con el AuthProvider */}
        <AuthProvider>{children}</AuthProvider>
        </body>
        </html>
    );
}
