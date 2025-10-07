import React from 'react'
import Navigation from '@/components/site/Navigation'

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