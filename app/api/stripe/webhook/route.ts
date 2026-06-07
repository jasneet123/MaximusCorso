import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import Stripe from 'stripe'

export async function POST(req: Request) {
  const body = await req.text()
  const headersList = await headers()
  const signature = headersList.get('stripe-signature')

  if (!signature) {
    return NextResponse.json(
      { error: 'No signature' },
      { status: 400 }
    )
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message)
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    )
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session

        const userId = session.metadata?.userId
        const tier = session.metadata?.tier as 'FOUNDATION' | 'MASTER' | 'ELITE'

        if (!userId || !tier) {
          throw new Error('Missing metadata')
        }

        // Create or update subscription
        await prisma.subscription.upsert({
          where: { userId },
          create: {
            userId,
            tier,
            status: 'ACTIVE',
            stripeCustomerId: session.customer as string,
            stripeSubscriptionId: session.subscription as string,
          },
          update: {
            tier,
            status: 'ACTIVE',
            stripeCustomerId: session.customer as string,
            stripeSubscriptionId: session.subscription as string,
          },
        })

        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription

        await prisma.subscription.update({
          where: { stripeSubscriptionId: subscription.id },
          data: {
            status: subscription.status === 'active' ? 'ACTIVE' :
                   subscription.status === 'canceled' ? 'CANCELED' :
                   subscription.status === 'past_due' ? 'PAST_DUE' : 'ACTIVE',
            stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
          },
        })

        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription

        await prisma.subscription.update({
          where: { stripeSubscriptionId: subscription.id },
          data: {
            status: 'CANCELED',
            canceledAt: new Date(),
          },
        })

        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook handler error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}
