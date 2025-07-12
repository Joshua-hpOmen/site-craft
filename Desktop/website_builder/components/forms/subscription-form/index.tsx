"use client"
import { toast } from '@/hooks/use-toast'
import { Plan } from '@prisma/client'
import { PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js'
import React from 'react'

type Props = {
    selectedPriceId: string | Plan
}

const currentUrl = process.env.NEXT_PUBLIC_URL

const SubscriptionForm = (props: Props) => {
    const elements = useElements()
    const stripeHook = useStripe()
    const [priceError, setPriceError] = React.useState("")


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        if(!props.selectedPriceId) {setPriceError("You need to select a plan to subscribe") ; return}
            
        setPriceError("")
        e.preventDefault();
        if(!stripeHook || !elements) return

        try {
            const { error } = await stripeHook.confirmPayment({ elements, confirmParams: { return_url : `${currentUrl}`}})

            if(error) {
                console.log("🔴Error code ", error.code)
                console.log("🔴Error message ", error.message)
                console.log("🔴Error payment_intent ", error.payment_intent)
                console.log("🔴Error param ", error.param)
            }


            if(error) throw new Error("failed to confirm or proccess payment")
            
            toast({ title: "Payment successfull", description: "Your payment has been successfully processed." })
        } catch (error) {
            console.log(error)
            toast({ title: "Oops!", description: "Failed to proccess payment.", variant: "destructive" })
        }
    }

  return (
    <form onSubmit={handleSubmit}>
        <span className='text-destructive'>{priceError}</span>
        <PaymentElement />
        <button disabled={!stripeHook} type="submit" className='mt-4 w-[120px] bg-blue-700 rounded-md py-2'>Submit</button>
    </form>
  )
}

export default SubscriptionForm