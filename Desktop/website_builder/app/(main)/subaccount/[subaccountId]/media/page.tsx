import { getMedia } from '@/lib/queries'
import React from 'react'
import MediaComponent from '@/components/global/media/MediaComponent'
import { Media } from '@prisma/client'

type Props = {
    params: {subaccountId: string}
}

const page = async (props: Props) => {
    const data = await getMedia(props.params.subaccountId)
  return (
    <div className='w-full px-3 py-5'><MediaComponent data={data as Media[]} subaccountId={props.params.subaccountId}/></div>
  )
}

export default page