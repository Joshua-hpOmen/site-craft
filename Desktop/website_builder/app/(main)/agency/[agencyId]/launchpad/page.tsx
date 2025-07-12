import { db } from '@/lib/db'
import { getStripeOAuthLink } from '@/lib/utils'
import { CheckCircle } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import {stripe} from "@/lib/stripe"

type Props = {
  params: {agencyId: string},
  searchParams: {code:string} //stripe
}

const page = async (props: Props) => {
  const params = await props.params

  const agencyDetails = await db.agency.findUnique({where : {id: params.agencyId}})

  if(!agencyDetails) return

  let exists = true
  for(let details in agencyDetails) {
    if(details) continue;
    if(!details) {exists = false; break}
  }

  const stripeOAuthLink = getStripeOAuthLink("agency", `launchpad___${agencyDetails.id}`)
  let connectedStripeAccount = false

  if(props.searchParams.code){
    if(!agencyDetails.connectAccountId){
      try {
        const response = await stripe.oauth.token({
          grant_type: "authorization_code",
          code: props.searchParams.code
        })

        await db.agency.update({
          where: {id: agencyDetails.id},
          data: { connectAccountId : response.stripe_user_id }
        })

        connectedStripeAccount = true
      } catch (error) {
        console.log("🔴Error could not connect stripe account")
      }
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

          {!Boolean(agencyDetails.connectAccountId || connectedStripeAccount) ? <Link href={stripeOAuthLink} className='bg-blue-700 rounded-md px-6 py-3'>Start</Link> : <CheckCircle size={50} className='text-primary p-2 flex-shrink-0'/>}
        </div>
        
        <div className='my-4 flex flex-col lg:flex-row py-6 items-center lg:justify-between border-b-2 border-gray-700'>
          <div>
            <Image src={agencyDetails.agencyLogo} alt='app logo' height={80} width={80} className='rounded-md'/>
            <div className='text-sm py-3'>Fill in all your agency details</div>
          </div>
          
          {!exists ? <Link href={`/agency/${params.agencyId}/settings`} className='bg-blue-700 rounded-md px-6 py-3'>Start</Link> : <CheckCircle size={50} className='text-primary p-2 flex-shrink-0'/>}
        </div>
        
        

      </div>
    </div>
  )
}

export default page