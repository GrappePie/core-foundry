import { NextResponse } from 'next/server';

// Datos mock para la API del módulo CRM
const mockCustomers = [
    { id: 'cust-01', name: 'Juan Pérez', email: 'juan.perez@example.com', company: 'Tech Corp' },
    { id: 'cust-02', name: 'Ana Gómez', email: 'ana.gomez@example.com', company: 'Innovate LLC' },
];

export async function GET() {
    // Simula un pequeño retraso de red
    await new Promise(resolve => setTimeout(resolve, 500));
    return NextResponse.json(mockCustomers);
}
