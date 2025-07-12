import React from 'react'
import UserInfo from './_components/UserInfo'

type Props = {
    children : React.ReactNode
}

const layout = ({children}: Props) => {
  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <div className='flex flex-col gap-4 items-center'>

        <h1 className='text-3xl font-semibold'>Click and copy</h1>

        <>
          <UserInfo/>
        </>
        {children}
      </div>
    </div>
  )
}

export default layout