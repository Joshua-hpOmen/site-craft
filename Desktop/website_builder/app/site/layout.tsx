import React from 'react'
import Navigation from '@/components/site/Navigation'
import { ClerkProvider } from '@clerk/nextjs'

type Props = {
    children: React.ReactNode
}

const layout = ({children}: Props) => {
  return (
    <>
        <Navigation/>
        {children}
    </>
  )
}

export default layout