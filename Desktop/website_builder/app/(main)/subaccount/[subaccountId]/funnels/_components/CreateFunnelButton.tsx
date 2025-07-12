"use client"
import CustomModal from '@/components/forms/CustomModal'
import FunnelForm from '@/components/forms/FunnelForm'
import { useModal } from '@/providers/modal-provider'
import { PlusCircleIcon } from 'lucide-react'
import React from 'react'

type Props = {
    subaccountId: string
}

const CreateFunnelButton = (props: Props) => {
    const {setOpen} = useModal()
  return (
    <button className='bg-blue-700 px-3 py-2 rounded-md flex gap-1' onClick={() => setOpen(
        <CustomModal title={'Create funel'} subheading={'Create funnels for your business straight from here'}>
            <FunnelForm subaccountId={props.subaccountId} />
        </CustomModal>
    )}><PlusCircleIcon/>Create</button>
  )
}

export default CreateFunnelButton