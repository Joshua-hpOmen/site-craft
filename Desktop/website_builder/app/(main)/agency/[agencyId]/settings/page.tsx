import AgencyDetails from '@/components/forms/AgencyDetails'
import UserDetails from '@/components/forms/UserDetails'
import { db } from '@/lib/db'
import { currentUser } from '@clerk/nextjs/server'
import React from 'react'

type Props = {
    params: Promise<{agencyId: string}>
}

const page = async (props: Props) => {
    const params = await props.params
    const authUser = await currentUser()

    if(!authUser) return
    const userDetails = await db.user.findUnique({where: {email: authUser.emailAddresses[0].emailAddress}})

    if(!userDetails) return

    const agencyDetails = await db.agency.findUnique({where: {id: params.agencyId}, include: {SubAccount: true}})

    if(!agencyDetails) return

    const subaccounts = agencyDetails.SubAccount;

    
  return (
    <div className='py-3  flex flex-col 2xl:flex-row items-center 2xl:items-start 2xl:pr-6 2xl:mx-auto'>
        <AgencyDetails data={agencyDetails}/>
        <UserDetails type="agency" id={params.agencyId} subAccounts={subaccounts} userDetails={userDetails}/>
    </div>
  )
}

export default page