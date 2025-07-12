'use client'
import React from 'react'
import clsx from 'clsx'
import { Check } from 'lucide-react'
import Link from 'next/link'
import { useTheme } from 'next-themes'

type Props = {
    title: String,
    description: String,
    price: String,
    features: String[],
    priceId: String,
}

const PriceCards = ({title, description, price, features, priceId}: Props) => {

    const {theme} = useTheme()
  return (
    <div className={clsx('w-[300px] h-[400px] flex flex-col justify-between gap-4 bg-slate-900 p-10 rounded-sm', {'border-2 border-primary': title === "Unlimited SaaS"})}>
        <div>
            <h2 className={clsx('font-semibold text-3xl', {'text-muted-foreground' : title !== 'Unlimited SaaS',})}>
                {title}
            </h2>

            <div className='text-muted-foreground'>
                {description}
            </div>
        </div>
        <div>
            <span className='text-6xl font-bold'>{price}</span>
            <span className='text-muted-foreground font-semibold'>/m</span>
        </div>

        <div>
            {features.map((feature, index) => (
                <div key={index} className='flex flex-row gap-2'>
                    <Check className='text-muted-foreground'/> <span>{feature}</span>
                </div>
            ))}
            
        </div>
        
        <Link href={`/agency?plan${priceId}`} className={clsx('w-full bg-primary p-2 rounded-sm text-center', {'!bg-muted-foreground': title !== "Unlimited SaaS"})}>Get Started</Link>
    </div>
  )
}

export default PriceCards