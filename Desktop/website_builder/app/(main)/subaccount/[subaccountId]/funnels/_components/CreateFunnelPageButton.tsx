import { PlusCircleIcon } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

type Props = {
    subaccountId: string,
    funnelId: string
}

const CreateFunnelPageButton = (props: Props) => {
  return (
    <Link href={`/subaccount/${props.subaccountId}/funnels/${props.funnelId}/editor`} className='bg-blue-700 px-3 py-2 rounded-md flex gap-1'><PlusCircleIcon/>Create</Link>
  )
}

export default CreateFunnelPageButton