import React from 'react'
import Navigation from '@/components/site/Navigation'
type Props = {
    children: React.ReactNode
}

const layout = (props: Props) => {
  return (
    <div className='h-[100vh] w-[100%]'>
        <Navigation/>
        <div className='w-[100%] h-[100%]'>{props.children}</div>
    </div>
  )
}

export default layout