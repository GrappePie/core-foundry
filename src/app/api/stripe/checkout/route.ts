import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getToken } from 'next-auth/jwt';
import { db } from '@/lib/db';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-04-10' });
const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET!;

export async function POST(req: NextRequest) {
  const token = await getToken({ req, secret: NEXTAUTH_SECRET });
  if (!token?.sub) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const { plan } = await req.json().catch(() => ({}));
  if (typeof plan !== 'string') {
    return NextResponse.json({ error: 'Plan inválido' }, { status: 400 });
  }

  const tenant = await db.tenant.findUnique({
    where: { ownerId: token.sub },
    include: { subscription: true },
  });
  if (!tenant) {
    return NextResponse.json({ error: 'Tenant no encontrado' }, { status: 404 });
  }

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    line_items: [{ price: plan, quantity: 1 }],
    success_url: `${process.env.NEXTAUTH_URL}/dashboard`,
    cancel_url: `${process.env.NEXTAUTH_URL}/pricing`,
    customer: tenant.subscription?.customerId,
    metadata: { tenantId: tenant.id, plan },
  });

  return NextResponse.json({ url: session.url });
}
