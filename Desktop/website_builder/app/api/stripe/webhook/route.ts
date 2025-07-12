import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import {stripe} from "@/lib/stripe";
import Stripe from "stripe";
import { subscriptionCreated } from "@/lib/stripe/stripe-actions";

const stripeWebhookEvents = new Set([
  'product.created',
  'product.updated',
  'price.created',
  'price.updated',
  'checkout.session.completed',
  'customer.subscription.created',
  'customer.subscription.updated',
  'customer.subscription.deleted',
  "invoice.finalized",
  "payment_intent.created",
  "invoice.paid",
  "payment_intent.created",
  "payment_intent.succeeded",
  "invoice.created"
])


export const POST = async (req: NextRequest) => {
    let stripeEvent: Stripe.Event
    const body = await req.text()
    const headersL = await headers() 
    const sig = headersL.get("Stripe-Signature")

    const webhookSecret = process.env.NODE_ENV === 'production' ? process.env.STRIPE_WEBHOOK_SECRET_LIVE : process.env.STRIPE_WEBHOOK_SECRET;

    try {
        if(!sig || !webhookSecret){ console.log("🔴Error stripe webhook secret or the signature does not exist"); return new NextResponse("🔴Error stripe webhook secret or the signature does not exist", { status: 400 })}
        stripeEvent = stripe.webhooks.constructEvent(body, sig, webhookSecret)
    } catch (error: any) {
        console.log("🔴Error", error)
        return new NextResponse(`Webhook error: ${error.message}`, { status: 400 })
    }

    try {
        if(stripeWebhookEvents.has(stripeEvent.type)){
            const subscription = stripeEvent.data.object as Stripe.Subscription             
            if(!subscription.metadata.connectAccountPayments && !subscription.metadata.connectAccountSubscriptions){

                switch (stripeEvent.type) {
                    case "customer.subscription.updated":
                    case "customer.subscription.created":{
                        
                        if(subscription.status === "active"){
                            await subscriptionCreated(
                                stripeEvent.data.object,
                                subscription.customer as string
                            )
                            
                        }else{
                            console.log("Skipped: status is not acive; ", subscription.status)
                            break
                        }

                    }

                    default: 
                        console.log("Unhandled stripeEvent, ", stripeEvent.type)
                }

            }else{
                console.log("Skipped: sub was from a connected account not for the application");
                return new NextResponse("🔴Error account not connected", { status: 400 })
            }
        }
    } catch (error) {
        console.log("🔴Error from webhook", error)
        return new NextResponse("🔴Webhook error", { status: 400 })
    }

    return NextResponse.json({ webhookActionReceived: true }, { status: 200 })
}