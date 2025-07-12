"use server"
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { UserButton } from '@clerk/nextjs'
import { ModeToggle } from '../global/mode-toggle'
import { currentUser } from '@clerk/nextjs/server'

type Props = {}

const Navigation = async (props: Props) => {
    const user = await currentUser()
    const userLoggedIn = Boolean(user?.id)

  return (
    <div className='p-5 flex flex-row justify-between items-center'>
        <aside className='flex flex-row items-center gap-3 font-bold text-3xl'>
            <Image src={'/assets/plura-logo.svg'} width={50} height={50} alt='Logo'/>
            SiteCraft.
        </aside>

        <aside className='hidden md:flex gap-5'>

            <Link href={'#'}>Pricing</Link>
            <Link href={'#'}>About</Link>
            <Link href={'#'}>Documentation</Link>
            <Link href={'#'}>Features</Link>

        </aside>

        <aside className="flex flex-row gap-4">
            { !userLoggedIn && <Link className={'text-white bg-primary px-4 py-2 rounded-sm visible'} href={'/agency/sign-in'}>Login</Link> }
            <UserButton/>
            <ModeToggle/>
        </aside>
    </div>
  )
}

export default Navigation