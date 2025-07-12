import Stripe from "stripe";
import { db } from "../db";
import {stripe} from "."
import { v4 } from "uuid";
import { upsertSubscription } from "../queries";

export const subscriptionCreated = async (subscription: Stripe.Subscription, customerId: string) => {
    
    try {
        const agency = await db.agency.findFirst({
            where: { customerId },
            include: { Subscription: true }
        });

        if (!agency) throw new Error("🔴 Couldnt find agency to upsert the subscription");

        const data = {
            active: subscription.status === 'active',
            agencyId: agency.id,
            customerId: customerId,
            //@ts-ignore
            currentPeriodEndDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
            //@ts-ignore
            priceId: subscription.plan.id,
            subscriptionId: subscription.id,
            //@ts-ignore
            plan: subscription.plan.id,
        }

        const response = await upsertSubscription(agency.id, data)

        console.log("🟢This is the response: ",response)

    } catch (error) {
        console.log("🔴 Subscription creation failed:", error);
    }
};

export const getConnectAccountProducts = async (stripeAccount : string) => {
    const products =  await stripe.products.list({
        limit: 50,
        expand: ['data.default_price']
    },  {
        stripeAccount
    })

    return products.data
}