'use server'
import Link from 'next/link'
import React from 'react'

type Props = {}

const page = (props: Props) => {
  return (
    <div className='w-[100%] h-[100%] flex gap-5 flex-col items-center justify-center'>
        <span className='text-3xl md:text-7xl font-bold'>Unauthorised Access!</span>
        <span>Please contact support or your agency owenr.</span>
        <Link href={'/'} className='bg-blue-800 rounded-md px-5 py-3'>Back home.</Link>
    </div>
  )
}

export default page