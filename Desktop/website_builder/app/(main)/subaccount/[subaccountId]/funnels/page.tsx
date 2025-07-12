import { db } from '@/lib/db'
import React from 'react'
import CreateFunnelButton from './_components/CreateFunnelButton'
import FunnelSection from './_components/FunnelSection'

type Props = {
  params: Promise<{subaccountId: string}>
}

const page = async (props: Props) => {
  const params = await props.params

  const funnels = await db.funnel.findMany({where: {subAccountId:           params.subaccountId}})

  return (
    <div className='flex justify-center w-full z-20 min-h-full'>
      <div className='w-[90%] pt-3'>
        
        <header className='flex justify-between'>
          <div className='text-3xl font-semibold'>
            Funnels
          </div>

          <div>
            <CreateFunnelButton subaccountId={params.subaccountId} />
          </div>
        </header>

        <section>
          <FunnelSection funnels={funnels}/>
        </section>

      </div>
    </div>
  )
}

export default page