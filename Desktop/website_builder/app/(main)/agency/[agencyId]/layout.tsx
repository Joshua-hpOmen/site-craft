'use server'
import Sidebar from '@/components/sidebar/Sidebar'
import GeneralNavBar from '@/components/site/GeneralNavBar'
import useMobile from '@/hooks/useMobile'
import { getNotifcationAndUser, verifyAndAcceptInvitation } from '@/lib/queries'
import { currentUser } from '@clerk/nextjs/server'
import clsx from 'clsx'
import { redirect } from 'next/navigation'
import React from 'react'


type Props = {
    children : React.ReactNode,
    params : {agencyId : string}
}

const layout = async (props: Props) => {
  
    const params = await props.params
    const agencyID = await verifyAndAcceptInvitation();
    const user = await currentUser()
    if(!user) return redirect('/')
    if(!agencyID) return redirect('/agency')
    if(user.privateMetadata.role !== "AGENCY_OWNER" && user.privateMetadata.role !== "AGENCY_OWNER"){
        redirect('/unauthorised')
    }

    let allNoti: any= []
    const notifications = await getNotifcationAndUser(agencyID)
    if(notifications) allNoti = notifications
  return (
    <div className='relative w-[100%] min-h-full'>
        <GeneralNavBar notifications={allNoti} role={allNoti.User?.role}><Sidebar id={params.agencyId} type={'agency'} /></GeneralNavBar>
        <div className='absolute lg:left-[30%] 2xl:left-[650px] top-[80px] left-0 bottom-0 right-0'>
          <div className='w-full min-h-full flex justify-center'>
            {props.children}
          </div>
        </div>
    </div>
  )
}

export default layout