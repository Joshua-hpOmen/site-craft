import Image from 'next/image'
import React from 'react'

const Loading = () => {
  return (
    <div className='w-screen h-screen flex items-center justify-center'>
        <div className='justify-center items-center flex flex-row gap-2'>
            <Image className='spiiningLoadingAgencyDetails' width={30} height={30} alt='Loading Image' src="/assets/spinner-solid-svgrepo-com.svg"/> <span className='text-xl'>Loading...</span>
        </div>
    </div>
  )
}

export default Loading