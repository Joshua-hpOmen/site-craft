import React from 'react'

type Props = {}

const ErrorPage = (props: Props) => {
  return (
    <div className='bg-black text-white text-4xl font-extrabold h-[100vh] w-[100vh] mx-auto'>
        Error: User Not found!
    </div>
  )
}

export default ErrorPage