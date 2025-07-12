"use client"
import { Search } from 'lucide-react'
import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { v4 } from 'uuid'
import DeleteButton from './DeleteButton'
import { UserWithNested } from '@/lib/constants'
import { getSubAccountDetails } from '@/lib/queries'

type Props = {
    user: UserWithNested
}

const test_sub = [{name: "Chelsea", subAccountLogo: "/globe.svg", id: v4(), address: "Johannesburg"}, {name: "Royal Rest", subAccountLogo: "/globe.svg", id: v4(), address: "Johannesburg"}]

const SearchBar = (props: Props) => {
    const [searchSubbAcc, setSearchSubbAcc] = React.useState("")
    const [subAccountFilter, setSubAccountFilter] = React.useState(props.user.Agency?.SubAccount)
    const [isMounted, setIsMounted] = React.useState(false)
    const handleSubAccSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchSubbAcc(e.target.value)
        setSubAccountFilter(
            props.user.Agency?.SubAccount?.filter(sub => {
                return Boolean(sub.name.search(new RegExp(e.target.value,"i")) !== -1)
            })
        )
    }

    React.useEffect(() => {
        setIsMounted(true)
    }, [])

    if(!isMounted) return

  return (<>
    <div className='w-[100%] flex justify-center relative'>
        <Search className='absolute top-3 left-14' color='#4B5563' size={20}/>
        <input type="search" name="searchSideBarOptions" id="searchSideBarOptions" placeholder='Search Sidebar Options' className="pl-12 bg-slate-800 py-3 w-[90%] pr-2 rounded-md outline-none placeholder:text-gray-600 text-sm" value={searchSubbAcc} onChange={(e) => handleSubAccSearch(e)}/>
    </div>

    {subAccountFilter?.length === 0 ? <div className='w-[100%] flex justify-center text-muted-foreground my-3 text-sm'>No subbaccounts</div> : subAccountFilter?.map((sub, index) => (
        <div className='w-[100%] flex justify-center my-5' key={index}>
            <Link href={`/subaccount/${sub.id}`} className='w-[90%] bg-slate-900 px-5 py-6 rounded-md items-center flex flex-col lg:flex-row gap-4 lg:gap-0 lg:justify-between'>
                <div className='w-[100%] flex flex-row items-center gap-3'>
                    <div className='relative w-[50px] h-[70px] bg-slate-950 rounded-sm px-16 py-6'>
                        <Image src={sub.subAccountLogo} sizes="(max-width: 992px)500px, 500px" alt="Subaccount logo" fill/>
                    </div>
                    <div>
                        <div className='text-lg font-semibold lg:text-xl'>{sub.name}</div>
                        <div className='text-muted-foreground text-sm'>{sub.address}</div>
                    </div>
                </div>

                <div onClick={e => {e.preventDefault(); e.stopPropagation()}}>
                    <DeleteButton subId={sub.id} />
                </div>
                
            </Link>
        </div>
    ))}
  </>

  )
}

export default SearchBar