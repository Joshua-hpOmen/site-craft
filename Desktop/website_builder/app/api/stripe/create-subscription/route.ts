import { db } from '@/lib/db'
import { stripe } from '@/lib/stripe'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { customerId, priceId } = await req.json()

  if (!customerId || !priceId) return new NextResponse('Customer Id or price id is missing', { status: 400, })

  const subscriptionExists = await db.agency.findFirst({
    where: { customerId },
    include: { Subscription: true },
  })

  try {
    if ( subscriptionExists?.Subscription?.subscriptionId && subscriptionExists.Subscription.active ) {
      //update the subscription instead of creating one.

      console.log('Updating the subscription')
      const currentSubscriptionDetails = await stripe.subscriptions.retrieve( subscriptionExists.Subscription.subscriptionId )

      const subscription = await stripe.subscriptions.update(
        subscriptionExists.Subscription.subscriptionId, {
          items: [
            { id: currentSubscriptionDetails.items.data[0].id, deleted: true, },
            { price: priceId },
          ],
          expand: ['latest_invoice.payment_intent'],
        }
      )

      return NextResponse.json({
        subscriptionId: subscription.id,
        //@ts-ignore
        clientSecret: subscription.latest_invoice.payment_intent.client_secret,
      })

    } else {
      const subscription = await stripe.subscriptions.create({
        customer: customerId,
        items: [ { price: priceId } ],
        payment_behavior: 'default_incomplete',
        payment_settings: { save_default_payment_method: 'on_subscription' },
        expand: ['latest_invoice.payment_intent'],
      })

      return NextResponse.json({
        subscriptionId: subscription.id,
        //@ts-ignore
        clientSecret: subscription.latest_invoice.payment_intent.client_secret,
      })

    }
  } catch (error) {
    console.log('🔴 Error', error)
    return new NextResponse('Internal Server Error', { status: 500, })
  }
}
