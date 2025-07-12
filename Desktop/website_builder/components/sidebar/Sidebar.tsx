'use server'
import { getUserAuthDetails } from '@/lib/queries'
import React from 'react'
import MenuOptions from './MenuOptions'
import { SubAccount } from '@prisma/client'

type Props = {
    id: string,
    type: 'agency' | 'subaccount'
}

const Sidebar = async (props: Props) => {
    const userDetails  = await getUserAuthDetails();
    if(!userDetails) return;

    const details = props.type === 'agency' ? userDetails?.Agency : userDetails.Agency?.SubAccount.find((subbAccount) => subbAccount.id === props.id)
    if(!details) return;

    const isWhiteLabeled = userDetails.Agency?.whiteLabel
    let sidebarAgencyLogo = userDetails.Agency?.agencyLogo || '/globe.svg';

    if(!isWhiteLabeled){
        if(props.type === 'subaccount'){
            sidebarAgencyLogo = userDetails.Agency?.SubAccount?.find((subbaccount) => subbaccount.id === props.id)?.subAccountLogo || '/globe.svg';
        }
    }

    const sideBarOptions = props.type === 'agency' ? userDetails.Agency?.SidebarOption || [] : userDetails.Agency?.SubAccount.find((subbAcc) => subbAcc.id === props.id)?.SidebarOption || []
    const subbAccounts : SubAccount[] = userDetails.Agency?.SubAccount.filter((subbAccount) => (
        userDetails.Permissions.find(permission => (
            permission.subAccountId === subbAccount.id && permission.access
        ))
    )) || [];


  return (
    <div className=''>
        <MenuOptions defaultOpen={true} subAccounts={subbAccounts} sideBarOpt={sideBarOptions} sideBarLogo={sidebarAgencyLogo} details={details} user={userDetails} id={props.id}/>
    </div>
  )
}

export default Sidebar