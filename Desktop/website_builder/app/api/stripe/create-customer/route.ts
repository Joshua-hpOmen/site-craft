import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { StripeCustomerType } from "@/lib/constants"
import { stripe } from "@/lib/stripe";

export const POST =  async (req: Request) => {
    const { address, email, name, shipping } : StripeCustomerType = await req.json()

    if(!email || !address || !name || !shipping) return new NextResponse("Missing data", { status: 400 }) 

    try {
        const customer = await stripe.customers.create({
            email,
            address,
            name,
            shipping
        })

        return NextResponse.json({ customerId: customer.id })
    } catch (error) {
        console.log("🔴Error wihin creating a customer");
        return new NextResponse("Internal Server Error", { status: 500 } )
    }
}