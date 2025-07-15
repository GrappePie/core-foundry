import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { db } from '@/lib/db';
import { parseString } from '@/lib/validators';

const SECRET = process.env.NEXTAUTH_SECRET!;

export async function GET(request: NextRequest) {
  const token = await getToken({ req: request, secret: SECRET });
  if (!token?.sub) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  const members = await db.tenantUser.findMany({
    where: { tenant: { ownerId: token.sub } },
    include: { user: { select: { id: true, name: true, email: true } } },
  });

  return NextResponse.json(members);
}

export async function DELETE(request: NextRequest) {
  const token = await getToken({ req: request, secret: SECRET });
  if (!token?.sub) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  const body = await request.json().catch(() => ({}));
  let userId: string;
  try {
    userId = parseString(body.userId, 'userId');
  } catch {
    return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 });
  }

  const tenant = await db.tenant.findUnique({ where: { ownerId: token.sub } });
  if (!tenant) return NextResponse.json({ error: 'Tenant no encontrado' }, { status: 404 });
  if (userId === token.sub) return NextResponse.json({ error: 'No puedes eliminarte a ti mismo' }, { status: 400 });

  await db.tenantUser.delete({ where: { tenantId_userId: { tenantId: tenant.id, userId } } });
  return NextResponse.json({ success: true });
}
