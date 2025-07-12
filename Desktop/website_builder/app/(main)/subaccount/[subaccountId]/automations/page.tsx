import { ChevronLeft, Construction } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const page = () => {
  return (
    <div className='min-h-full w-full flex  justify-center items-center'>
      <div className='flex items-center flex-col'>
        <h1 className='text-4xl flex font-semibold items-center gap-2'><Construction color='yellow'/>Under Construction</h1>
        <p className='text-muted-foreground'>Pages construction is underway by our very talented developers</p> <br />

        <Link href={'/'} className='bg-blue-700 px-8 py-3 rounded-md flex gap w-fit'><ChevronLeft/>Back home</Link>
      </div>
    </div>
  )
}

export default page