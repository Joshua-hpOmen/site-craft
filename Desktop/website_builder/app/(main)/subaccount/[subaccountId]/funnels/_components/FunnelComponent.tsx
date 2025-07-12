import { Badge } from '@/components/ui/badge'
import { Funnel } from '@prisma/client'
import dayjs from 'dayjs'
import { ExternalLink,List } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

type Props = {
    data: Funnel,
    subaccountId: string
}

const FunnelComponent = (props: Props) => {

  return (
    <div className='w-full gap-3 flex items-center hover:bg-slate-800 my-2 px-2 rounded-sm py-3 bg-slate-900' >
        <List/>
        <div className='flex flex-1 items-center justify-between'>
            <div className='flex items-center gap-2'>
                {props.data.name}
                <Link  href={`/subaccount/${props.subaccountId}/funnels/${props.data.id}`}><ExternalLink size={17}/></Link>
            </div>

            <div>
                {props.data.published ? <Badge variant={'default'}>Live - {props.data.subDomainName}</Badge> :  <Badge variant={"destructive"}>Draft</Badge>}
                <span className='mr-3'></span>
                {dayjs(props.data.updatedAt).format("DD MMM YYYY")}
            </div>
        </div>
    </div>
  )
}

export default FunnelComponent