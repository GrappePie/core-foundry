import { NextResponse } from 'next/server';

const mockShipments = [
    { id: 'shp-001', from: 'inventory', to: 'cust-01', status: 'En tránsito' },
];

export async function GET() {
    return NextResponse.json(mockShipments);
}
