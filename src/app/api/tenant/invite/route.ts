import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { db } from '@/lib/db';

const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET!;

export async function GET(request: NextRequest) {
    const token = await getToken({ req: request, secret: NEXTAUTH_SECRET });
    if (!token?.sub) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

    const invites = await db.invitation.findMany({
        where: { tenant: { ownerId: token.sub } }
    });
    return NextResponse.json(invites);
}

export async function POST(request: NextRequest) {
    const token = await getToken({ req: request, secret: NEXTAUTH_SECRET });
    if (!token?.sub) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

    const { email, role } = await request.json();
    const tenant = await db.tenant.findUnique({ where: { ownerId: token.sub } });
    if (!tenant) return NextResponse.json({ error: 'Tenant no encontrado' }, { status: 404 });

    const invitation = await db.invitation.create({
        data: { tenantId: tenant.id, email, role }
    });
    return NextResponse.json(invitation, { status: 201 });
}
