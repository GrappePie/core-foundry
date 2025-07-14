import * as Sentry from "@sentry/nextjs";

Sentry.init({
    dsn: process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN,
    // Ajusta la tasa de muestreo para el monitoreo de rendimiento en producción
    tracesSampleRate: 1.0,
    // ... otras configuraciones de Sentry
});
