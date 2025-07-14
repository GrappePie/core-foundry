import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { db } from '@/lib/db';

const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET!;

export async function POST(request: NextRequest) {
  const token = await getToken({ req: request, secret: NEXTAUTH_SECRET });
  if (!token?.sub) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  const { name } = await request.json();
  const tenant = await db.tenant.update({
    where: { ownerId: token.sub },
    data: { name }
  });
  return NextResponse.json(tenant);
}
