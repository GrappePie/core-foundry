import { NextResponse } from 'next/server';
import { registry } from '@/lib/metrics';

/**
 * Endpoint que expone las métricas en el formato esperado por Prometheus.
 * Prometheus "scrapeará" (leerá) este endpoint periódicamente.
 */
export async function GET() {
    const metrics = await registry.metrics();
    return new NextResponse(metrics, {
        status: 200,
        headers: {
            'Content-type': registry.contentType,
        },
    });
}
