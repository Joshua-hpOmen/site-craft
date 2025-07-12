import { FunnelPage } from '@prisma/client'
import React from 'react'

type Props = {
    data: FunnelPage,
    subaccountId:string
}

const FunnelPageComponent = (props: Props) => {
  return (
    <div>FunnelPageComponent</div>
  )
}

export default FunnelPageComponent