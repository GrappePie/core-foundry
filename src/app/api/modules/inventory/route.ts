import { NextRequest, NextResponse } from 'next/server';

const inventoryData = [
    { id: 'item-001', name: 'Tornillos de Acero', quantity: 15000 },
    { id: 'item-002', name: 'Placas de Cobre', quantity: 7500 },
];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(_req: NextRequest) {
    try {
        return NextResponse.json(inventoryData);
    } catch (error) {
        console.error('[Inventory API] GET Error:', error);
        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
    }
}
