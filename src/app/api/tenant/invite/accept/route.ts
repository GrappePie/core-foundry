import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { db } from '@/lib/db';

const SECRET = process.env.NEXTAUTH_SECRET!;

export async function POST(request: NextRequest) {
  const token = await getToken({ req: request, secret: SECRET });
  if (!token?.sub) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  const user = await db.user.findUnique({ where: { id: token.sub } });
  if (!user?.email) return NextResponse.json({ error: 'Email no encontrado' }, { status: 400 });

  const invitations = await db.invitation.findMany({
    where: { email: user.email, accepted: false },
  });

  for (const inv of invitations) {
    await db.tenantUser.create({ data: { tenantId: inv.tenantId, userId: user.id, role: inv.role } });
    await db.invitation.update({ where: { id: inv.id }, data: { accepted: true } });
  }

  return NextResponse.json({ accepted: invitations.length });
}
