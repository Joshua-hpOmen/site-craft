import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const MobileNotSupported = () => {
  return (
    <div className='h-screen w-screen flex items-center justify-center bg-background z-[100]'>
        <div className='flex flex-col items-center'>
            <h1 className='text-4xl font-bold'>Error Mobile Unsupported</h1>
            <p className='text-muted-foreground'>Mobile devices are not supported for the editor</p> <br /><br />

            <Link href={'/'} className='px-6 py-3 bg-blue-700 rounded-md flex'><ChevronLeft/>Back home</Link>
        </div>
    </div>
  )
}

export default MobileNotSupported