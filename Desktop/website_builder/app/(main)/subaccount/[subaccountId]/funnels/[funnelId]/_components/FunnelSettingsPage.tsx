import FunnelForm from '@/components/forms/FunnelForm'
import { Funnel, SubAccount} from '@prisma/client'
import React from 'react'
import FunnelsProductsTable from './FunnelsProductsTable'
import Stripe from 'stripe'
import { getSubAccountDetails } from '@/lib/queries'
import fetchProducts from './fetchProducts'

type Props = {
    funnel: Funnel
}


const FunnelSettingsPage = (props: Props) => {
    const [subaccountDetails, setSubaccountDetails] = React.useState<SubAccount | null>(null)
    const [products,setProducts] = React.useState<Stripe.Product[]>([]) 
    

    React.useEffect(() => {
        const fetchData = async () => {
            const fetchedSubaccountDetails = await getSubAccountDetails(props.funnel.subAccountId)
            let fetchedProducts : Stripe.Product[] = []

            if(fetchedSubaccountDetails?.connectAccountId){
                fetchedProducts = await fetchProducts(fetchedSubaccountDetails.connectAccountId)
            }

            setSubaccountDetails(fetchedSubaccountDetails) 
            setProducts(fetchedProducts)
        }

        fetchData()
    }, [props.funnel])

    if(!subaccountDetails) return
    if (!subaccountDetails.connectAccountId) return
    

  return (
    <div className='flex flex-col gap-5 my-3 w-full'>
        <section>

            <h1 className='text-xl font-semibold'>Funnel Products</h1> <br />

            <p className='text-sm text-muted-foreground'>
                Select the products and services you wish to sell on this funnel. <br />
                You can sell one time and recurring products too.
            </p>
            <br />
            <div>
                {!Boolean(products) ? "Connect your stripe account to sell products" : <FunnelsProductsTable defaultData={props.funnel} products={products}/>}
            </div>

        </section>


        <section className='border-2 border-slate-700 rounded-md py-4'>
            <FunnelForm subaccountId={props.funnel.subAccountId} defaultData={props.funnel}/>
        </section>
    </div>
  )
}

export default FunnelSettingsPage