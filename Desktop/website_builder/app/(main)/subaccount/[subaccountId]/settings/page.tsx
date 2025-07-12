import SubAccountDetails from '@/components/forms/SubAccountDetails';
import UserDetails from '@/components/forms/UserDetails';
import { db } from '@/lib/db';
import { currentUser } from '@clerk/nextjs/server';
import React from 'react'

type Props = {
    params: Promise<{subaccountId: string}>
}

const page = async (props: Props) => {
    const params = await props.params
    const authUser = await currentUser()

    if(!authUser) return 
    const userDetails = await db.user.findUnique({where: {email: authUser.emailAddresses[0].emailAddress}});
    if(!userDetails) return
    const currentSubaccount = await db.subAccount.findUnique({where: {id: params.subaccountId}})
    if(!currentSubaccount) return
    const agencyDetails = await db.agency.findUnique({
        where: {id: currentSubaccount.agencyId},
        include: {SubAccount: true}
    })

    if(!agencyDetails)return null;

  return (
        <div className='px-5 py-3 flex flex-col 2xl:flex-row gap-2'>
            <SubAccountDetails agencyDetails={agencyDetails} userId={userDetails.id} details={currentSubaccount} userName={userDetails.name} />
            <UserDetails type={'subaccount'} id={params.subaccountId}  subAccounts={agencyDetails.SubAccount} userDetails={userDetails}/>
        </div>
    )
}

export default page