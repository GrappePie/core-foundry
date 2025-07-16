import React from 'react';
import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { db } from '@/lib/db';
import { parseString } from '@/lib/validators';
import { sendEmail } from '@/lib/email';
import { InvitationEmail } from '@/emails';
import { TenantRole } from '@prisma/client';

const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET!;
const SALT = process.env.NEXTAUTH_SALT!;

export async function GET(request: NextRequest) {
    const token = await getToken({ req: request, secret: NEXTAUTH_SECRET, salt: SALT });
    if (!token?.sub) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

    const invites = await db.invitation.findMany({
        where: { tenant: { ownerId: token.sub } }
    });
    return NextResponse.json(invites);
}

export async function POST(request: NextRequest) {
    const token = await getToken({ req: request, secret: NEXTAUTH_SECRET, salt: SALT });
    if (!token?.sub) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

    const body = await request.json().catch(() => ({}));
    let email: string;
    let rawRole: string;
    let role: TenantRole;
    try {
        email = parseString(body.email, 'email');
        rawRole = parseString(body.role, 'role');
        if (!Object.values(TenantRole).includes(rawRole as TenantRole)) {
            return NextResponse.json({ error: 'Rol inválido' }, { status: 400 });
        }
        role = rawRole as TenantRole;
    } catch {
        return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 });
    }
    const tenant = await db.tenant.findUnique({ where: { ownerId: token.sub } });
    if (!tenant) return NextResponse.json({ error: 'Tenant no encontrado' }, { status: 404 });

    const invitation = await db.invitation.create({
        data: { tenantId: tenant.id, email, role }
    });
    if (email) {
        await sendEmail({
            to: email,
            subject: `Invitación a ${tenant.name}`,
            react: React.createElement(InvitationEmail, { tenantName: tenant.name, role }),
        });
    }
    return NextResponse.json(invitation, { status: 201 });
}
