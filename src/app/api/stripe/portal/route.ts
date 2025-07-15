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

  const tenant = await db.tenant.findUnique({
    where: { ownerId: token.sub },
    include: { subscription: true },
  });
  if (!tenant?.subscription) {
    return NextResponse.json({ error: 'Sin suscripción' }, { status: 400 });
  }

  const session = await stripe.billingPortal.sessions.create({
    customer: tenant.subscription.customerId,
    return_url: `${process.env.NEXTAUTH_URL}/dashboard/settings`,
  });

  return NextResponse.json({ url: session.url });
}
