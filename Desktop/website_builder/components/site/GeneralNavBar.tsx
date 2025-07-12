"use client"
import { GeneralNavBarConxtext } from '@/providers/nav-bar'
import { UserButton } from '@clerk/nextjs'
import { Notification, Role} from '@prisma/client'
import clsx from 'clsx'
import { Bell, MenuIcon } from 'lucide-react'
import React from 'react'

type Props = {
    children : React.ReactNode,
    notifications: ({
        User: {
            name: string;
            id: string;
            avatarUrl: string;
            email: string;
            createdAt: Date;
            updatedAt: Date;
            role: Role;
            agencyId: string | null;
        };
    } & Notification)[] | [],
    subAccountId?: string,
    role?: Role
}

const GeneralNavBar = (props: Props) => {
    const {isVisible, isVisibleForEditor, setOpenForEditor} = React.useContext(GeneralNavBarConxtext);
    const [showNotifactionRightSideBar, setShowNotifactionRightSideBar] = React.useState(false);

  return (
    <div className={clsx('fixed top-0 left-0 right-0 flex items-center justify-between px-5 bg-slate-900 h-[80px] z-20', )}>
        {isVisibleForEditor ? <div>{props.children}</div> : <div><MenuIcon onClick={setOpenForEditor}/></div>}

        {isVisible && <div className='flex flex-row items-center justify-center gap-4'>
            <Bell size={33} className='bg-blue-600 rounded-full py-2 px-2' onClick={() => setShowNotifactionRightSideBar(true)}/>
            <UserButton/>
        </div>}

          {/* I have not done the notifications yet as i dont know how it needs to look */}
        {showNotifactionRightSideBar && <div className='fixed top-0 bottom-0 right-0 left-0 flex justify-end'>
          <div className='fixed top-0 bottom-0 right-0 left-0 bg-black bg-opacity-65' onClick={() => setShowNotifactionRightSideBar(false)}></div>
          <div className='bg-slate-900 z-10 w-[60%] pl-8 py-5'>
            <div  className='font-bold text-2xl'>Notifications</div>  

            {props.notifications.length === 0 && <div className='w-[100%] text-sm my-2 text-muted-foreground '>
                  No notifications.
              </div>}
          </div>  
        </div>}
    </div>
  )
}

export default GeneralNavBar