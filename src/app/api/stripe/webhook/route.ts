import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { db } from '@/lib/db';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-04-10',
});

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature');
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature!, webhookSecret);
  } catch (err) {
    console.error('[Stripe Webhook] Signature verification failed.', err);
    return new NextResponse('Webhook Error', { status: 400 });
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      if (!session.customer || !session.subscription || !session.metadata?.tenantId) break;

      await db.subscription.upsert({
        where: { tenantId: session.metadata.tenantId },
        update: {
          customerId: session.customer.toString(),
          subscriptionId: session.subscription.toString(),
          status: 'active',
        },
        create: {
          tenantId: session.metadata.tenantId,
          customerId: session.customer.toString(),
          subscriptionId: session.subscription.toString(),
          plan: session.metadata.plan ?? 'basic',
          status: 'active',
        },
      });
      break;
    }
    case 'customer.subscription.updated': {
      const sub = event.data.object as Stripe.Subscription;
      if (typeof sub.metadata?.tenantId !== 'string') break;

      await db.subscription.update({
        where: { tenantId: sub.metadata.tenantId },
        data: {
          status: sub.status,
          plan: sub.items.data[0]?.price.nickname ?? 'basic',
        },
      });
      break;
    }
    default:
      console.log(`[Stripe Webhook] Unhandled event type ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
