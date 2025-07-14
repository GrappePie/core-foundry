import { NextRequest, NextResponse } from 'next/server';
import { getToken }             from 'next-auth/jwt';
import { db }                   from '@/lib/db';
import { Prisma } from '@prisma/client';
import { parseString } from '@/lib/validators';

const SECRET = process.env.NEXTAUTH_SECRET!;
const SALT = process.env.NEXTAUTH_SALT!;

export async function GET(request: NextRequest) {
    const token = await getToken({ req: request, secret: SECRET, salt: SALT });
    if (!token?.sub) {
        return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    // Devuelve todos los contactos de este usuario
    const contacts = await db.crmContact.findMany({
        where: { userId: token.sub },
        orderBy: { name: 'asc' },
    });
    return NextResponse.json(contacts);
}

export async function POST(request: NextRequest) {
    const token = await getToken({ req: request, secret: SECRET, salt: SALT });
    if (!token?.sub) {
        return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    let name: string, email: string, company: string;
    try {
        name = parseString(body.name, 'name');
        email = parseString(body.email, 'email');
        company = parseString(body.company, 'company');
    } catch {
        return NextResponse.json({ error: 'Campos incompletos' }, { status: 400 });
    }

    try {
        const newContact = await db.crmContact.create({
            data: {
                name,
                email,
                company,
                userId: token.sub,
            },
        });
        return NextResponse.json(newContact, { status: 201 });
    } catch (err: unknown) {
        // Si ya existe un contacto con ese email, Prisma lanzará P2002
        if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
            return NextResponse.json({ error: 'El email ya está registrado' }, { status: 409 });
        }
        console.error('[API /crm POST] Error creando contacto:', err);
        return NextResponse.json({ error: 'Error interno' }, { status: 500 });
    }
}
