"use client"
import CustomModal from '@/components/forms/CustomModal'
import SubscriptionFormWrapper from '@/components/forms/subscription-form/subscription-form-wrapper'
import { PricesList } from '@/lib/constants'
import { useModal } from '@/providers/modal-provider'
import { useSearchParams } from 'next/navigation'
import React from 'react'
import Stripe from 'stripe'

type Props = {
    features: string[]
    buttonInfo: string
    title: string
    description: string
    amt: string
    duration: string
    highlightTitle: string
    highlightDescription: string
    customerId: string
    prices: PricesList['data']
    planExists: boolean
}

const PricingCards = (props: Props) => {
    const {setOpen} = useModal();
    const plan = useSearchParams().get("plan")
  return (
    <div className='w-full bg-slate-900 px-8 py-3 rounded-md mb-5'>
        <header>
            <section>
                <span className='font-semibold text-2xl'>{props.title}</span><br />
                <span className="text-muted-foreground text-sm">{props.description}</span>
            </section>

            <section>
                <span className='text-6xl font-semibold'>{props.amt}</span>
                <span className='text-sm text-muted-foreground'>{props.duration}</span>
            </section>
        </header>

        <main>

            <section className='my-3'>
                <ul>
                    {props.features.map((feature, index) => (
                        <li key={index} className='list-disc text-sm text-muted-foreground'>
                            {feature}
                        </li>
                    ))}
                </ul>
            </section>

            <section className='w-full flex justify-center'>
                <div className='w-9/10 border-slate-600 border-2 rounded-e-md px-5 py-2 my-3'>
                    
                    <div className=''>
                        <span>{props.highlightTitle}</span><br />
                        <span className='text-sm text-muted-foreground'>{props.highlightDescription}</span>
                    </div>

                    <button className='bg-blue-700 w-full my-2 py-2 rounded-md' onClick={() => setOpen(
                        <CustomModal title='Mange your plan' subheading="You can change your plan at any time from the billing settings" >
                            <SubscriptionFormWrapper customerId={props.customerId} planExists={props.planExists}/>
                        </CustomModal>, async () => ({
                            plans: {
                                defaultPriceId: plan ? plan : "",
                                plans: props.prices
                            }
                        })
                    )}>{props.buttonInfo}</button>
                </div>
            </section>
 
        </main>
    </div>
  )
}

export default PricingCards