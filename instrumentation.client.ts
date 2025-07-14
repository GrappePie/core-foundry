import * as Sentry from "@sentry/nextjs";
// Next.js carga automáticamente este archivo al estar nombrado
// `instrumentation.client.ts`, permitiendo inicializar Sentry en el navegador.

/**
 * Este archivo se ejecuta solo en el navegador y es el lugar
 * para la inicialización del SDK de Sentry en el cliente.
 */
Sentry.init({
    dsn: process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN,
    tracesSampleRate: 1.0,
    replaysOnErrorSampleRate: 1.0,
    replaysSessionSampleRate: 0.1,
});

/**
 * Hook para que Sentry pueda instrumentar las navegaciones del cliente.
 */
export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
