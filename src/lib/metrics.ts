import { Registry, Counter, Histogram } from 'prom-client';

/**
 * Registro central para todas las métricas de Prometheus.
 * Exportar una única instancia asegura que todas las métricas se registren en un solo lugar.
 */
export const registry = new Registry();

/**
 * Contador para las peticiones HTTP.
 * Registra el número total de peticiones, etiquetadas por método, ruta y código de estado.
 */
export const httpRequestCounter = new Counter({
    name: 'http_requests_total',
    help: 'Total number of HTTP requests',
    labelNames: ['method', 'route', 'status_code'],
    registers: [registry],
});

/**
 * Histograma para la duración de las peticiones HTTP.
 * Registra la latencia de las peticiones en buckets, permitiendo calcular percentiles (p95, p99).
 */
export const httpRequestDurationHistogram = new Histogram({
    name: 'http_request_duration_seconds',
    help: 'Duration of HTTP requests in seconds',
    labelNames: ['method', 'route'],
    buckets: [0.1, 0.5, 1, 1.5, 2, 5], // Buckets de 0.1s a 5s
    registers: [registry],
});

/**
 * Contador para eventos específicos del cliente.
 * Ejemplo: cuenta cuántas veces los usuarios arrastran un módulo.
 */
export const moduleDragCounter = new Counter({
    name: 'module_drag_events_total',
    help: 'Total number of module drag events from clients',
    labelNames: ['moduleId'],
    registers: [registry],
});
