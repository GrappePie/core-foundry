import { NextResponse } from 'next/server';

/**
 * Endpoint de Health Check.
 * Usado por Kubernetes (liveness/readiness probes) para verificar que la aplicación está viva y lista para recibir tráfico.
 */
export async function GET() {
    return NextResponse.json({ status: 'ok', timestamp: new Date().toISOString() });
}
