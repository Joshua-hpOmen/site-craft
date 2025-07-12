import Sidebar from '@/components/sidebar/Sidebar'
import GeneralNavBar from '@/components/site/GeneralNavBar'
import { getNotifcationAndUser, getUserAuthDetails, verifyAndAcceptInvitation } from '@/lib/queries'
import { currentUser } from '@clerk/nextjs/server'
import { Role } from '@prisma/client'
import { redirect } from 'next/navigation'
import React from 'react'

type Props = {
    children: React.ReactNode,
    params: {subaccountId: string}
}

const layout = async (props: Props) => {
    const agencyId = await verifyAndAcceptInvitation()
    if(!agencyId) return redirect("/unauthorised")

    const user = await currentUser()
    if(!user) return redirect("/")

    let notifications: any = []

    if(!user.privateMetadata.role) return redirect("/")

    const allPermissions = await getUserAuthDetails()
    const hasPermission = allPermissions?.Permissions.find(permission => permission.access && permission.subAccountId === props.params.subaccountId)
    if(!hasPermission) return redirect("/unauthorised")

    const allNotification = await getNotifcationAndUser(agencyId)

    if(["AGENCY_OWNER", "AGENCY_ADMIN"].find(role => role === user.privateMetadata.role)){
        notifications = allNotification
    }else{
        notifications = allNotification?.filter(notification => notification.subAccountId === props.params.subaccountId)
    }

  return (
    <div className='relative w-[100%] min-h-screen'>
        <GeneralNavBar notifications={notifications} role={user.privateMetadata.role as Role}><Sidebar id={props.params.subaccountId} type='subaccount'/></GeneralNavBar>
        <div className='absolute lg:left-[30%] top-[80px] left-0 bottom-0 right-0'>
          <div className='w-[100%] min-h-full flex justify-center'>
            {props.children}
          </div>
        </div>
    </div>
  )
}

export default layout