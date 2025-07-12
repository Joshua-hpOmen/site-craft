import { db } from '@/lib/db'
import React from 'react'
import DataTable from './_components/DataTable'

type Props = {
    params: Promise<{agencyId:string}>
}

const page = async (props: Props) => {

  const params = await props.params

  const agencyUsers = await db.user.findMany({ 
      where : {Agency: {id: params.agencyId}}, 
      include: {
          Agency: {include: {SubAccount: true}},
          Permissions: {include : {SubAccount: true}}
      }
  })

  console.log(agencyUsers)

  if(!agencyUsers) return;

  const agencyDetails = await db.agency.findUnique({
      where: {id: params.agencyId},
      include: { SubAccount: true}
  })

  if(!agencyDetails) return true

  return (
    <div className='w-[100%]'><DataTable agencyUsers={agencyUsers}  agencyDetails={agencyDetails}/></div>
  )
}

export default page