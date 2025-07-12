import { db } from '@/lib/db'
import React from 'react'
import FunnelComponent from './_components/FunnelComponent'
import { FolderSearch, PlusCircleIcon } from 'lucide-react'
import CreateFunnelButton from './_components/CreateFunnelButton'
import FunnelSection from './_components/FunnelSection'

type Props = {
  params: {subaccountId: string}
}

const page = async (props: Props) => {

  const funnels = await db.funnel.findMany({where: {subAccountId: props.params.subaccountId}})

  return (
    <div className='flex justify-center w-full z-20 min-h-full'>
      <div className='w-[90%] pt-3'>
        
        <header className='flex justify-between'>
          <div className='text-3xl font-semibold'>
            Funnels
          </div>

          <div>
            <CreateFunnelButton subaccountId={props.params.subaccountId} />
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