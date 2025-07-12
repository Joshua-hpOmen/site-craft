"use client"
import { toast } from '@/hooks/use-toast'
import { pricingCards } from '@/lib/constants'
import { getStripe } from '@/lib/stripe/stripe-client'
import { useModal } from '@/providers/modal-provider'
import { Plan } from '@prisma/client'
import { StripeElementsOptions } from '@stripe/stripe-js'
import clsx from 'clsx'
import { useRouter } from 'next/router'
import React from 'react'
import {Elements} from "@stripe/react-stripe-js"
import Loading from '@/components/global/loading'
import SubscriptionForm from '.'


type Props = {
    customerId: string,
    planExists: boolean
}

const SubscriptionFormWrapper = (props: Props) => {
    const {data, setClose} = useModal()
    //const router = useRouter()
    const [selectedPriceId, setSelectedPriceId] = React.useState<Plan | "">(data?.plans?.defaultPriceId || "")
    const [subscription, setSubscription] = React.useState<{ subscriptionId: string, clientSecret: string}>({subscriptionId: "", clientSecret: ""})

    const options: StripeElementsOptions = React.useMemo(() => ({
        clientSecret: subscription.clientSecret,
        appearance: {
            theme: "flat"
        }
    }), [subscription])

    React.useEffect(() => {
        if(!selectedPriceId) return


        const creteSecret = async () => {
            const subscriptionResponse = await fetch("/api/stripe/create-subscription", {
                method: "POST",
                headers: { 'Content-Type': 'application/json',},
                body: JSON.stringify({ customerId: props.customerId, priceId: selectedPriceId  })
            })

            const subscriptionResponseData = await subscriptionResponse.json()
            setSubscription({ clientSecret: subscriptionResponseData.clientSecret, subscriptionId: subscriptionResponseData.subscriptionId })

            if(props.planExists) {
                toast({title: "Success", description: "Your plan has been successfully upgraded!"})
                setClose()
                window.location.reload()
            }
        }

        creteSecret()

    }, [data, selectedPriceId, props.customerId])

  return (
    <div className='w-full h-full'>
        <div className='flex flex-col gap-4'>

            <div className='flex flex-col gap-4 mx-auto'>
                {data.plans?.plans.map((plan) => <div key={plan.id} onClick={() => setSelectedPriceId(plan.id as Plan)} className={clsx("relative hover:bg-slate-800 p-4 rounded-md cursor-pointer border-slate-700 border-2", {"!border-primary": selectedPriceId === plan.id})}>

                    <header>
                        <span>${plan.unit_amount ? plan.unit_amount/100 : "0"}</span><br />
                        <span className='text-sm text-muted-foreground'>{plan.nickname}</span> <span className='text-muted-foreground'> : </span> 
                        <span className='text-sm text-muted-foreground'>{ pricingCards.find(pricCard => pricCard.priceId === plan.id)?.description }</span>
                    </header>

                    { selectedPriceId === plan.id && (<div className='w-2 h-2 bg-emerald-500 rounded-full absolute top-4 right-4'/>) }
                </div>)}
            </div>
            
            <div className='px-8'>
                {options.clientSecret && !props.planExists && <React.Fragment>

                        <h1 className='text-xl mb-3'>Payment</h1>
                        <Elements stripe={getStripe()} options={options}>
                            <SubscriptionForm selectedPriceId={selectedPriceId} />
                        </Elements>

                </React.Fragment>}

                {!options.clientSecret && selectedPriceId && <div className='flex items-center justify-center w-full h-40'>
                        <Loading/>
                </div>}
            </div>

        </div>
    </div>
  )
}

export default SubscriptionFormWrapper