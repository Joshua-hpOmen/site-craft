import { db } from '@/lib/db'
import React from 'react'
import CreateFunnelPageButton from '../_components/CreateFunnelPageButton'
import FunnelPageSection from '../_components/FunnelPageSection'
import { getFunnel } from '@/lib/queries'
import { redirect } from 'next/navigation'
import { ChevronLeftIcon } from 'lucide-react'
import Link from 'next/link'
import FunnelMainPage from './_components/FunnelMainPage'

type Props = {
  params : {subaccountId: string, funnelId:string}
}

const page = async (props: Props) => {

  if(!props.params.subaccountId) return;

  const funnel = await getFunnel(props.params.funnelId)
  if(!funnel) return redirect(`/subaccount${props.params.subaccountId}/funnels`)
  return (
    <div className='flex justify-center w-full min-h-full'>
      <div className='w-[90%] pt-3 min-h-full flex flex-col'>
        
        <header className='flex flex-col'>
          <section className=''>
            <Link href={`/subaccount/${props.params.subaccountId}/funnels`} className='flex items-center hover:underline text-muted-foreground'>
              <ChevronLeftIcon size={20}/> Back
            </Link>
          </section>
        </header>


        <main className='w-full flex-1'>
          <FunnelMainPage funnel={funnel}/>
        </main>
        

      </div>
    </div>
  )
}

export default page

