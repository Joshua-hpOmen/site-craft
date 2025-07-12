"use client"
import { Input } from '@/components/ui/input'
import { saveActLogNotification, updateFunnelProducts } from '@/lib/queries'
import { Funnel } from '@prisma/client'
import clsx from 'clsx'
import Image from 'next/image'
import React from 'react'
import Stripe from 'stripe'

type Props = {
    defaultData: Funnel
    products: Stripe.Product[]
}

const FunnelsProductsTable = (props: Props) => {

    const [isLoading, setIsLoading] = React.useState(false)
    const [liveProducts, setLiveProducts] = React.useState<{ productId: string; recurring: boolean }[] | [] >(JSON.parse(props.defaultData.liveProducts || '[]'))

    const handleAddProduct = async (product: Stripe.Product) => {
        const productIdExists = liveProducts.find(
            //@ts-ignore
            (prod) => prod.productId === product.default_price.id
        )

        productIdExists ? setLiveProducts(
            liveProducts.filter(
                (prod) =>
                prod.productId !==
                //@ts-ignore
                product.default_price?.id
            )
        ) : //@ts-ignore
            setLiveProducts([
                ...liveProducts,
                {
                    //@ts-ignore
                    productId: product.default_price.id as string,
                    //@ts-ignore
                    recurring: !!product.default_price.recurring,
                },
            ])
    }


    const handleSaveProducts = async () => {
        setIsLoading(true)
        const response = await updateFunnelProducts(
            JSON.stringify(liveProducts),
            props.defaultData.id
        )
        await saveActLogNotification({
            agencyId: undefined,
            description: `Update funnel products | ${response.name}`,
            subAccountId: props.defaultData.subAccountId,
        })
        setIsLoading(false)
        window.location.reload()
    }

  return (
    <div className='overflow-x-hidden hover:overflow-x-auto pb-5'>
        <table>

            <thead>
                <tr className='bg-slate-900 border-y-2 border-y-slate-600'>
                    <th className='min-w-[200px] py-3 pl-2 text-start'>Live</th>
                    <th className='min-w-[200px] py-3 pl-2 text-start'>Image</th>
                    <th className='min-w-[200px] py-3 pl-2 text-start'>Name</th>
                    <th className='min-w-[200px] py-3 pl-2 text-start'>Interval</th>
                    <th className='min-w-[200px] py-3 pl-2 text-start'>Price</th>
                </tr>
            </thead>

            <tbody>
                {!Boolean(props.products.length) ? <tr>No products</tr> : props.products.map((product, index) => (
                    <tr key={index}>
                        <td>
                            <Input type="checkbox" defaultChecked={
                                !!liveProducts.find(
                                //@ts-ignore
                                (prod) => prod.productId === product.default_price.id )
                            } onChange={() => handleAddProduct(product)} className="w-4 h-4"/>
                        </td>

                        <td>
                            <Image height={60} width={60} src={product.images[0]} alt='Product image'/>
                        </td>

                        <td>
                            {product.name}
                        </td>

                        <td>
                            {
                                //@ts-ignore
                                product.default_price?.recurring ? 'Recurring' : 'One Time'
                            }
                        </td>

                        <td>
                            $ {
                                //@ts-ignore
                                product.default_price?.unit_amount /100
                            }
                        </td>
                    </tr>
                ))}
            </tbody>

        </table>

        <button className='px-6 py-3 bg-blue-700 rounded-md mt-4' disabled={isLoading} onClick={handleSaveProducts}>Save products</button>

    </div>
  )
}

export default FunnelsProductsTable