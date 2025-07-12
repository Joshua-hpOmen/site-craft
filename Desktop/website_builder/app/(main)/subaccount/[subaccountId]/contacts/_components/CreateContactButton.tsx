"use client"
import ContactUserForm from '@/components/forms/ContactUserForm'
import CustomModal from '@/components/forms/CustomModal'
import { useModal } from '@/providers/modal-provider'
import { PlusCircle } from 'lucide-react'
import React from 'react'

type Props = {
    subaccountId: string
}

const CreateContactButton = (props: Props) => {
    const {setOpen} = useModal()
    return (
        <button className='bg-blue-700 px-4 py-2 rounded-md flex items-center gap-1' onClick={async () => setOpen(
            <CustomModal title="Create or Update Contact information" subheading="Contacts are like customers.">
                <ContactUserForm subaccountId={props.subaccountId}/>
            </CustomModal>
        )}>
            <PlusCircle size={20}/>
            Create Contact
        </button>
    )
}

export default CreateContactButton