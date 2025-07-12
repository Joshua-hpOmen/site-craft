import React from 'react'
import {stripe} from "@/lib/stripe"
import { addOnProducts, pricingCards } from '@/lib/constants'
import { db } from '@/lib/db'
import PricingCards from './_components/PricingCards'
import clsx from 'clsx'

type Props = {
    params: { agencyId: string }
}

const page = async (props: Props) => {

    // This is supposed to be a challenge to be completed
    const addOns = await stripe.products.list({
        ids: addOnProducts.map(product => product.id),
        expand: ["data.default_price"]
    })

    const agencySubcription = await db.agency.findUnique({
        where: { id: props.params.agencyId },
        select: { customerId: true, Subscription: true }
    })

    const prices = await stripe.prices.list({ product: process.env.NEXT_SITE_CRAFT_PRODUCT_ID, active: true })

    const currentPlanDetails = pricingCards.find(card => card.priceId === agencySubcription?.Subscription?.priceId)

    const charges = await stripe.charges.list({ limit: 50, customer: agencySubcription?.customerId })

    const allCharges = [ ...charges.data.map(charge => ({
        description: charge.description,
        id: charge.id,
        date: `${new Date(charge.created * 1000).toLocaleDateString()} ${new Date(charge.created * 1000).toLocaleDateString()}`,
        status: "Paid",
        amount: `${charge.amount/100}`
    }))]

    const isSubscriptionActive = agencySubcription?.Subscription?.active === true


    return (
        <div className='w-full p-3'>
            <h1 className='text-4xl lg:2xl mb-5 font-semibold border-b-2 border-b-slate-500/30 pb-2 '>Billing</h1>
            <h2 className='text-2xl'>Current Plan</h2>

            <br />

            <div className='xl:flex xl:flex-1 lg:w-3/4 xl:gap-4 xl:w-full items-start justify-between w-full mx-4 '>
                <PricingCards planExists={isSubscriptionActive} prices={prices.data} 
                    customerId={agencySubcription?.customerId || ""}  buttonInfo={ isSubscriptionActive ? "Change Plan" : "Get Started"} amt={isSubscriptionActive ? currentPlanDetails?.price || "$0" : "$0"}
                    highlightDescription="Want to modify your plan? You can do this here. If you have further question contact support@plura-app.com" highlightTitle="Plan Options"
                    description={ isSubscriptionActive ? currentPlanDetails?.description || "Lest get started" : 'Lets get started! Pick a plan that works best for you.'} duration='/month'
                    features={isSubscriptionActive ? currentPlanDetails?.features || [] : currentPlanDetails?.features || pricingCards[0] ?.features || []}
                    title={isSubscriptionActive ? currentPlanDetails?.title || "" : "Starter"}
                />

                {addOns.data.map((addOn) => (
                    <PricingCards
                        planExists={agencySubcription?.Subscription?.active === true}
                        prices={prices.data}
                        customerId={agencySubcription?.customerId || ''}
                        key={addOn.id}
                        amt={
                        //@ts-ignore
                        addOn.default_price?.unit_amount
                            ? //@ts-ignore
                            `$${addOn.default_price.unit_amount / 100}`
                            : '$0'
                        }
                        buttonInfo="Subscribe"
                        description="Dedicated support line & teams channel for support"
                        duration="/ month"
                        features={[]}
                        title={'24/7 priority support'}
                        highlightTitle="Get support now!"
                        highlightDescription="Get priority support and skip the long long with the click of a button."
                    />
                ))}
            </div>

            <h2 className='text-2xl p-4'>Payment History</h2>
            
            <div className='overflow-x-hidden hover:overflow-x-auto'>
                <table className=''>
                    <thead className='!bg-slate-900'>
                        <tr className=''>
                            <th className='min-w-[230px] text-start py-4 pl-2'>Description</th>
                            <th className='min-w-[230px] text-start py-4 pl-2'>Invoice id</th>
                            <th className='min-w-[230px] text-start py-4 pl-2'>Date</th>
                            <th className='min-w-[230px] text-start py-4 pl-2'>Paid</th>
                            <th className='min-w-[230px] text-start py-4 pl-2'>Amount</th>
                        </tr>
                    </thead>

                    <tbody>
                        {allCharges.map((charge, index) => {
                            return <tr key={index} className={clsx("py-3 bg-slate-900" ,{'!bg-slate-800': index %2 ===0})}>
                                <td className='py-4 pl-2'>{charge.description}</td>
                                <td  className='text-muted-foreground py-4 pl-2'>{charge.id}</td>
                                <td className='py-4 pl-2'>{charge.date.split(" ")[0]}</td>
                                <td className={clsx("py-4 pl-2", {"text-emerald-500": charge.status.toLocaleLowerCase() === "paid"}, {"text-orange-600": charge.status.toLocaleLowerCase() === "pending"}, {"text-red-600": charge.status.toLocaleLowerCase() === "failed"})}>
                                    <span>{charge.status.toUpperCase()}</span>
                                </td>
                                <td className='py-4 pl-2'>${charge.amount}</td>
                            </tr>

                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default page