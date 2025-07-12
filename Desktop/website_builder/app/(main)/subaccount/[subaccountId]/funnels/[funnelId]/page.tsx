import React from 'react'
import { getFunnel } from '@/lib/queries'
import { redirect } from 'next/navigation'
import { ChevronLeftIcon } from 'lucide-react'
import Link from 'next/link'
import FunnelMainPage from './_components/FunnelMainPage'

type Props = {
  params : Promise<{subaccountId: string, funnelId:string}>
}

const page = async (props: Props) => {
  const params = await props.params

  if(!params.subaccountId) return;

  const funnel = await getFunnel(params.funnelId)
  if(!funnel) return redirect(`/subaccount${params.subaccountId}/funnels`)
  return (
    <div className='flex justify-center w-full min-h-full'>
      <div className='w-[90%] pt-3 min-h-full flex flex-col'>
        
        <header className='flex flex-col'>
          <section className=''>
            <Link href={`/subaccount/${params.subaccountId}/funnels`} className='flex items-center hover:underline text-muted-foreground'>
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

