"use client"
import CustomModal from '@/components/forms/CustomModal'
import SubAccountDetails from '@/components/forms/SubAccountDetails'
import { UserWithNested } from '@/lib/constants'
import { useModal } from '@/providers/modal-provider'
import { PlusCircleIcon } from 'lucide-react'
import React from 'react'

type Props = {
    user: UserWithNested,
    id:string
}

const CreateSubbAccountButtton = (props: Props) => {
  const {setOpen} = useModal();
  const agencyDetails = props.user.Agency;
  if(!agencyDetails) return
  return (
    <div className='w-full flex justify-center'>
        <button className='w-[90%] my-5 rounded-md bg-blue-700 py-4 flex flex-row items-center justify-center gap-3' onClick={() => {setOpen(<CustomModal title='Create Subaccount' subheading='You can create subaccounts for you agency'>
          <SubAccountDetails agencyDetails={agencyDetails} userId={props.user.id} userName={props.user.name}/>
        </CustomModal>)}}><PlusCircleIcon size={17}/>Create Subbaccount</button>
    </div>
  )
}

export default CreateSubbAccountButtton