import { NodeSDK } from '@opentelemetry/sdk-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-grpc';
import { resourceFromAttributes } from '@opentelemetry/resources';
// CORRECCIÓN: Se importa la constante más reciente para el nombre del servicio.
import { ATTR_SERVICE_NAME } from '@opentelemetry/semantic-conventions';
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';
import { PgInstrumentation } from '@opentelemetry/instrumentation-pg';

/**
 * Inicializa el proveedor de trazas de OpenTelemetry para el backend.
 */
export function initOpenTelemetry() {
    const traceExporter = new OTLPTraceExporter({
        url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT || 'http://localhost:4317',
    });

    const sdk = new NodeSDK({
        traceExporter,
        instrumentations: [
            new HttpInstrumentation(),
            new PgInstrumentation(),
        ],
        resource: resourceFromAttributes({
            // CORRECCIÓN: Se utiliza la nueva constante importada 'ATTR_SERVICE_NAME'.
            [ATTR_SERVICE_NAME]: 'satisfactory-saas-backend',
        }),
    });

    // Arranca el SDK y empieza a recolectar y exportar trazas.
    sdk.start();

    // Maneja el cierre gracefully para asegurar que todas las trazas se envíen.
    process.on('SIGTERM', () => {
        sdk.shutdown()
            .then(() => console.log('Tracing terminated'))
            .catch((error) => console.log('Error terminating tracing', error))
            .finally(() => process.exit(0));
    });

    console.log("OpenTelemetry Tracing initialized with NodeSDK.");
}
