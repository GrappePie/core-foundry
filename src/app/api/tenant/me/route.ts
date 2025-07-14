import { NextRequest, NextResponse } from 'next/server';
import { getToken }             from 'next-auth/jwt';
import { db }                   from '@/lib/db';
import logger                   from '@/lib/logger';
import { parseStringArray, parseVisualConfig } from '@/lib/validators';

const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET!;

export async function GET(request: NextRequest) {
    const token = await getToken({ req: request, secret: NEXTAUTH_SECRET });
    if (!token?.sub) {
        return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }
    // Usamos upsert para asegurar que siempre haya un tenant
    try {
        const tenant = await db.tenant.upsert({
            where: { ownerId: token.sub },
            update: {},   // No hay campos a cambiar en GET
            create: {
                ownerId: token.sub,
                name: 'Mi Tenant',                      // Pon aquí tu valor por defecto
                activeModules: [],                      // Array vacío inicial
                visualConfig: { positions: {}, connections: [] },
            },
        });
        await db.tenantUser.upsert({
            where: { tenantId_userId: { tenantId: tenant.id, userId: token.sub } },
            update: {},
            create: { tenantId: tenant.id, userId: token.sub, role: 'OWNER' },
        });
        return NextResponse.json(tenant);
    } catch (err) {
        logger.error({ err }, "[API Tenant GET] Error upserting");
        return NextResponse.json({ error: 'Error interno' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    const token = await getToken({ req: request, secret: NEXTAUTH_SECRET });
    if (!token?.sub) {
        return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    try {
        const body = await request.json().catch(() => ({}));
        const activeModules = parseStringArray(body.activeModules, 'activeModules');
        const visualConfig = parseVisualConfig(body.visualConfig);
        const tenant = await db.tenant.upsert({
            where: { ownerId: token.sub },
            update: {
                activeModules,
                visualConfig: JSON.parse(JSON.stringify(visualConfig)),
            },
            create: {
                ownerId: token.sub,
                name: 'Mi Tenant',                      // igual valor por defecto
                activeModules,
                visualConfig: JSON.parse(JSON.stringify(visualConfig)),
            },
        });
        await db.tenantUser.upsert({
            where: { tenantId_userId: { tenantId: tenant.id, userId: token.sub } },
            update: {},
            create: { tenantId: tenant.id, userId: token.sub, role: 'OWNER' },
        });
        return NextResponse.json({ success: true, tenant });
    } catch (err) {
        logger.error({ err }, "[API Tenant POST] Error upserting");
        return NextResponse.json({ error: 'Error interno' }, { status: 500 });
    }
}
