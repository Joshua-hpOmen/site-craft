import { getUserAuthDetails } from '@/lib/queries'
import React from 'react'
import SearchBar from './_components/SearchBar'
import CreateSubbAccountButtton from './_components/CreateSubbAccountButtton'

type Props = {
  params: {
    agencyId: string
  }
}

const Page = async ({params}: Props) => {

  const user = await getUserAuthDetails();

  if(!user) return


  return (
    <div className='w-[90%] flex flex-col my-5'>
      <h1 className='text-lg font-bold bg-clip-text bg-gradient-to-r from-indigo-900 to-indigo-300 lg:text-3xl text-transparent text-center my-3'>Subbaccounts</h1>

      {/* Search for subbaccounts section */}
      <div>
        <SearchBar user={user}/> 
      </div>

      <CreateSubbAccountButtton user={user} id={params.agencyId}/>
    </div>
  )
}


export default Page