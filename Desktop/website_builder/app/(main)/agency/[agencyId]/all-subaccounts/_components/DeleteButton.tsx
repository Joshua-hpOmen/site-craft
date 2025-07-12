"use client"
import { deleteSubaccount, getSubAccountDetails, saveActLogNotification } from '@/lib/queries'
import { SubAccount } from '@prisma/client'
import { useRouter } from 'next/navigation'
import React from 'react'

type Props = {
    subId: string,
}

const DeleteButton = (props: Props) => {
    const [showWarning, setShowWarning] = React.useState<boolean>(false)
    const router = useRouter()
  return (
    <div className='relative' onClick={e => {e.stopPropagation(); e.preventDefault()}}>
        <button className='bg-red-900 px-6 py-2 rounded-md' onClick={() => setShowWarning(true)}>Delete</button>

        {showWarning && <div className='absolute right-4 z-20' onClick={e => {e.stopPropagation(); e.preventDefault()}}>
                <div className='fixed top-0 bottom-0 left-0 right-0 -z-10' onClick={e => {e.stopPropagation(); e.preventDefault();setShowWarning(false)}}></div>
                <div className='border-white bg-slate-900 border-2 rounded-md flex flex-row gap-5 w-[400px] px-6 py-8 z-40' onClick={e => {e.stopPropagation(); e.preventDefault()}}>
                    Are you sure if you delete this the account will not be recoverable
                    <div className='flex flex-col gap-4'>
                        <button className='bg-blue-700 px-6 py-2 rounded-md w-auto h-auto' onClick={() => {setShowWarning(false) }}>Cancel</button>
                        <button className='bg-red-900 px-6 py-2 rounded-md w-auto h-auto' onClick={async () => {
                            const response = await getSubAccountDetails(props.subId)
                            if(!response) return
                            await saveActLogNotification({agencyId: undefined,description: `Deleted account | ${response.name}`, subAccountId: props.subId})
                            await deleteSubaccount(props.subId)
                            window.location.reload()
                        }}>Delete</button>
                    </div>
                </div>
        </div>}
    </div>
  )
}

export default DeleteButton