import { NextRequest, NextResponse } from 'next/server';
import { getToken }             from 'next-auth/jwt';
import { db }                   from '@/lib/db';
import logger                   from '@/lib/logger';
import { updateTenantSchema } from '@/lib/schemas';
import { ZodError } from 'zod';

const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET!;
const NEXTAUTH_SALT = process.env.NEXTAUTH_SALT!;

export async function GET(request: NextRequest) {
    const token = await getToken({ req: request, secret: NEXTAUTH_SECRET, salt: NEXTAUTH_SALT });
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
    const token = await getToken({ req: request, secret: NEXTAUTH_SECRET, salt: NEXTAUTH_SALT });
    if (!token?.sub) {
        return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    try {
        const body = await request.json().catch(() => ({}));
        const parsed = updateTenantSchema.parse(body);
        const tenant = await db.tenant.upsert({
            where: { ownerId: token.sub },
            update: {
                activeModules: parsed.activeModules,
                visualConfig: JSON.parse(JSON.stringify(parsed.visualConfig)),
            },
            create: {
                ownerId: token.sub,
                name: 'Mi Tenant',                      // igual valor por defecto
                activeModules: parsed.activeModules,
                visualConfig: JSON.parse(JSON.stringify(parsed.visualConfig)),
            },
        });
        await db.tenantUser.upsert({
            where: { tenantId_userId: { tenantId: tenant.id, userId: token.sub } },
            update: {},
            create: { tenantId: tenant.id, userId: token.sub, role: 'OWNER' },
        });
        return NextResponse.json({ success: true, tenant });
    } catch (err) {
        if (err instanceof ZodError) {
            return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 });
        }
        logger.error({ err }, "[API Tenant POST] Error upserting");
        return NextResponse.json({ error: 'Error interno' }, { status: 500 });
    }
}
