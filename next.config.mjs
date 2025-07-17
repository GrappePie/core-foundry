import { withSentryConfig } from "@sentry/nextjs";

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,

    async headers() {
        const ContentSecurityPolicy =
            "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; frame-src https://accounts.google.com; connect-src 'self';";
        return [
            {
                source: '/(.*)',
                headers: [
                    {
                        key: 'Content-Security-Policy',
                        value: ContentSecurityPolicy.replace(/\n/g, ''),
                    },
                ],
            },
        ];
    },

    // Mantenemos la configuración de Webpack para evitar los errores de "Critical dependency"
    // que vimos con las librerías de instrumentación.
    webpack: (config, { isServer }) => {
        if (isServer) {
            config.externals.push(
                '@opentelemetry/instrumentation',
                '@prisma/instrumentation'
            );
        }
        return config;
    }
};

// Volvemos a envolver la configuración con el HOC de Sentry.
// Esto es esencial para que Sentry pueda subir los sourcemaps y funcionar correctamente.
export default withSentryConfig(
    nextConfig,
    {
        silent: true,
        org: "tu-organizacion-en-sentry",
        project: "tu-proyecto-saas",
    },
    {
        widenClientFileUpload: true,
        transpileClientSDK: true,
        tunnelRoute: "/monitoring",
        hideSourceMaps: true,
        disableLogger: true,
    }
);
