"use client"
import { Agency, Role, SubAccount, User } from '@prisma/client'
import { PlusCircle, Search } from 'lucide-react'
import React from 'react'
import Columns from './Columns'
import { useModal } from '@/providers/modal-provider'
import CustomModal from '@/components/forms/CustomModal'
import SubAccountDetails from '@/components/forms/SubAccountDetails'
import SendInvitation from '@/components/forms/SendInvitation'

type Props = {
  agencyDetails: Agency,
  agencyUsers: User[],
}

const DataTable = (props: Props) => {
  const [searchVal, setSearchVal] = React.useState("")
  const [mounted, setMount] = React.useState(false)
  const [userFilter, setUserFilter] = React.useState<User[]>(props.agencyUsers)
  const {setOpen} = useModal()

  
  React.useEffect(() => {
    setMount(true) 
  })

  if(!mounted) return

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchVal(e.target.value)
    setUserFilter(props.agencyUsers.filter(user => {
      return  Boolean(user.name.search(new RegExp(e.target.value, "i") ) !== -1) || Boolean(user.email.search(new RegExp(e.target.value, "i")) !== -1) || Boolean(user.role.search(new RegExp(e.target.value, "i")) !== -1)
    }))
  }

  const handleAddButton = () => {
    setOpen(<CustomModal title='Add a team member' subheading='Send invitation'>
      <SendInvitation agencyId={props.agencyDetails.id}/>
    </CustomModal>)
  } 
  return (
    <div className='mt-6 w-[100%] pl-4 pr-2'>
      <header className='flex flex-row justify-between w-[100%] px-4'>
        <div className='relative'>
          <Search className='absolute top-3 left-4' color='#4B5563'/>
          <input type="search" name='search' placeholder='Search Accounts'  className="bg-slate-800 py-3 pl-11  pr-2 rounded-md outline-none  placeholder:text-gray-600" value={searchVal} onChange={(e) => handleSearchChange(e)}/>
        </div>

        <button className='flex items-center justify-center gap-1 flex-row bg-blue-700 px-5 py-2 rounded-md' onClick={() => handleAddButton()}><PlusCircle/> Add</button>
      </header>

      <div className='mx-3 mt-4 min-w-[90%] overflow-x-hidden hover:overflow-x-auto overflow-y-visible'>
        <table className='bg-slate-800 w-full'>
          <thead className='border-b-2 border-slate-600'>
            <tr>
              <th className='text-start py-3 px-5 min-w-[200px]'>Name</th>
              <th className='text-start py-3 px-5 min-w-[250px]'>Email</th>
              <th className='text-start py-3 px-5 min-w-[250px]'>Owner</th>
              <th className='text-start py-3 px-5 min-w-[250px]'>Role</th>
            </tr>
          </thead>

          <tbody>
            {userFilter.map((user, index) => (
              <Columns user={user} index={index} agencyName={props.agencyDetails.name} key={index}/>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default DataTable