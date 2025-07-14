import * as Sentry from "@sentry/nextjs";
import { initOpenTelemetry } from './src/lib/opentelemetry';

/**
 * Este archivo se ejecuta en el servidor al iniciar la aplicación.
 * Es el lugar correcto para inicializar Sentry y OpenTelemetry.
 */
export function register() {
    if (process.env.NEXT_RUNTIME === 'nodejs') {
        // Inicializa Sentry para el backend
        Sentry.init({
            dsn: process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN,
            tracesSampleRate: 1.0,
        });

        // Inicializa OpenTelemetry para las trazas
        initOpenTelemetry();
    }
}

/**
 * Hook para capturar errores durante el renderizado de Server Components.
 */
export async function onRequestError({ error }: { error: unknown }) {
    Sentry.captureException(error);
}
