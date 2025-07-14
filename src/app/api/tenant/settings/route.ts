import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { db } from '@/lib/db';
import { parseString } from '@/lib/validators';

const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET!;

export async function POST(request: NextRequest) {
  const token = await getToken({ req: request, secret: NEXTAUTH_SECRET });
  if (!token?.sub) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  const body = await request.json().catch(() => ({}));
  let name: string;
  try {
    name = parseString(body.name, 'name');
  } catch {
    return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 });
  }
  const tenant = await db.tenant.update({
    where: { ownerId: token.sub },
    data: { name }
  });
  return NextResponse.json(tenant);
}
