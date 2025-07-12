"use client"
import { FunnelPage } from '@prisma/client'
import { FolderSearch, Search } from 'lucide-react'
import React from 'react'
import FunnelPageComponent from './FunnelPageComponent'

type Props = {
    funnelPages : FunnelPage[],
    subaccountId: string
}

const FunnelPageSection = (props: Props) => {
  const [search, setSearch] = React.useState("")
    const [searchFilter, setSearchFilter] = React.useState(props.funnelPages)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value)

        setSearchFilter(props.funnelPages.filter(fun => fun.name.search(new RegExp(e.target.value, "i")) !== -1))

    }
  return (
    <div>
        <section className='relative my-3'>
            <Search className='absolute top-3 left-2 text-muted-foreground'/>
            <input type="search" className='w-full pl-9 bg-slate-700 py-3 rounded-md' value={search} placeholder='Search' onChange={handleChange}/>
        </section>

        <section className='w-full justify-between flex text-muted-foreground'>
            <span>File</span>
            <span>Date Created</span>
        </section>

        <main>
            {!!searchFilter.length ? <div>
                {searchFilter.map((fun, index) => (
                    <FunnelPageComponent key={index} data={fun} subaccountId={props.subaccountId}/>
                ))}
                </div> : <div>
                <FolderSearch className='text-muted mt-5' size={200}/>
            </div>}
        </main>
    </div>

  )
}

export default FunnelPageSection