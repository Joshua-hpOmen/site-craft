"use client"
import CustomModal from '@/components/forms/CustomModal'
import UploadMediaForm from '@/components/forms/UploadMediaForm'
import { useModal } from '@/providers/modal-provider'
import React from 'react'

type Props = {
  subaccountId: string
}

const MediaUploadButton = (props: Props) => {
  const {isOpen, setOpen, setClose} = useModal()
  return (
    <button className='bg-blue-700 px-3 py-2 rounded-md' onClick={() => setOpen(<CustomModal title='Upload Media' subheading='Upload a file to your media bucket'>
      <UploadMediaForm subaccountId={props.subaccountId}/>
    </CustomModal>)}>Uplaod</button>
  )
}

export default MediaUploadButton