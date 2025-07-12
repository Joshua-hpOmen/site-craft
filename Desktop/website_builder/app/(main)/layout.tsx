"use client"
import React from 'react'
import { ClerkProvider } from '@clerk/nextjs'
import GeneralNavBarProvider from '@/providers/nav-bar'

type Props = {
    children : React.ReactNode
}

const layout = ({children}: Props) => {
  return (
    <ClerkProvider>
        <GeneralNavBarProvider>
          <div>{children}</div>
        </GeneralNavBarProvider>
    </ClerkProvider>
  )
}

export default layout

