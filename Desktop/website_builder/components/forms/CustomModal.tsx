import { useModal } from '@/providers/modal-provider'
import React from 'react'

type Props = {
  title: string,
  subheading: string,
  children: React.ReactNode
}

const CustomModal = (props: Props) => {
  const {setClose, isOpen} = useModal();
  return (<>
      {isOpen &&<div className='bg-opacity-30 bg-black fixed inset-0 z-50 flex items-center justify-center max-h-screen'>
        <div className='relative flex items-center justify-center w-[100%] h-screen'>
          <div className='fixed inset-0' onClick={() => setClose()}></div>
          <div className='lg:w-[70%] w-[80%] max-w-[830px] !max-h-[70%] overflow-y-hidden hover:overflow-y-auto bg-slate-950 border-slate-800 relative border-2 backdrop:blur-xl flex flex-col rounded-md gap-5 z-50 pt-8 pb-5'>
            <div className='text-3xl lg:font-bold font-semibold text-center'>{props.title}</div>
            <div className='text-muted-foreground text-center'>{props.subheading}</div>
            <div onClick={(e) => e.stopPropagation()} className='w-full flex justify-center'>{props.children}</div>
          </div>
        </div>
      </div>}
  </>
  )
}

export default CustomModal