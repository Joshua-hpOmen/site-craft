import { db } from '@/lib/db'
import { CheckCircle } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import {stripe} from "@/lib/stripe"
import { getStripeOAuthLink } from '@/lib/utils'


type Props = {
    searchParams: {state: string, code: string}
    params: {subaccountId:string}
}

const page = async (props: Props) => {
    const subaccountDetails= await db.subAccount.findUnique({where: {id: props.params.subaccountId}})

    if(!subaccountDetails) return

    let detailsExist = true
    for(const detail in subaccountDetails){
        if (!detail){ detailsExist = false; break}
    }
    

  //stripe connect 
  const stripeOAuthLink = getStripeOAuthLink(
    'subaccount',
    `launchpad___${subaccountDetails.id}`
  )

  let connectedStripeAccount = false

  if (props.searchParams.code && !subaccountDetails.connectAccountId){
      try {

        const response = await stripe.oauth.token({ grant_type: 'authorization_code', code: props.searchParams.code, })
        await db.subAccount.update({
          where: { id: props.params.subaccountId },
          data: { connectAccountId: response.stripe_user_id },
        })
        connectedStripeAccount = true

      }catch (error) {
        console.log('🔴Could not connect stripe account', error)
      }
  }

  return (
  <div className='w-[90%] p-5'>
      <div className='w-[100%] bg-blue-950 bg-opacity-35 shadow-sm p-8 rounded-md'>
        <div className='font-bold lg:text-3xl text-lg'>Lets get started!</div>
        <div className='text-sm text-muted-foreground'>Follow the steps below to get your accounts setup</div>

        <div className='my-4 flex flex-col lg:flex-row py-6 items-center lg:justify-between border-b-2 border-gray-700'>
          <div>
            <Image src={'/appstore.png'} alt='app logo' height={80} width={80}/>
            <div className='text-sm py-3'>Save the website as a shortcut on you mobile devices</div>
          </div>
          <button className='bg-blue-700 rounded-md px-6 py-3'>Start</button>
        </div>
        
        <div className='my-4 flex flex-col lg:flex-row py-6 items-center lg:justify-between border-b-2 border-gray-700'>
          <div>
            <Image src={'/stripelogo.png'} alt='app logo' height={80} width={80}/>
            <div className='text-sm py-3'>Connect your stripe account to accept payments and see your dashboard</div>
          </div>

          {!Boolean(connectedStripeAccount || subaccountDetails.connectAccountId) ? <Link href={stripeOAuthLink} className='bg-blue-700 rounded-md px-6 py-3'>Start</Link> : <CheckCircle size={50} className='text-primary p-2 flex-shrink-0'/>}

        </div>
        
        <div className='my-4 flex flex-col lg:flex-row py-6 items-center lg:justify-between border-b-2 border-gray-700'>
          <div>
            <Image src={subaccountDetails.subAccountLogo} alt='app logo' height={80} width={80} className='rounded-md'/>
            <div className='text-sm py-3'>Fill in all your subaccount details</div>
          </div>
          
          {!subaccountDetails ? <Link href={`/agency/${props.params.subaccountId}/settings`} className='bg-blue-700 rounded-md px-6 py-3'>Start</Link> : <CheckCircle size={50} className='text-primary p-2 flex-shrink-0'/>}
        </div>
        
        

      </div>
    </div>
  )
}

export default page