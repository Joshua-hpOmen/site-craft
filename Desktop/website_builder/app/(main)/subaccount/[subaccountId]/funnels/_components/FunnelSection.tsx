"use client"
import React from 'react'
import FunnelComponent from './FunnelComponent'
import { FolderSearch, Search } from 'lucide-react'
import { Funnel } from '@prisma/client'

type Props = {
    funnels : Funnel[],
}

const FunnelSection = (props: Props) => {
    const [search, setSearch] = React.useState("")
    const [searchFilter, setSearchFilter] = React.useState(props.funnels)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value)

        setSearchFilter(props.funnels.filter(fun => fun.name.search(new RegExp(e.target.value, "i")) !== -1 || fun.subDomainName?.search(new RegExp(e.target.value, "i")) !== -1))

    }
  return (
    <div>
        <section className='relative my-3'>
            <Search className='absolute top-3 left-2 text-muted-foreground'/>
            <input type="search" className='w-full pl-9 bg-slate-700 py-3 rounded-md' value={search} placeholder='Search' onChange={handleChange}/>
        </section>

        <section className='w-full justify-between flex text-muted-foreground'>
            <span>File</span>
            <span>Date Updated</span>
        </section>

        <main>
            {!!searchFilter.length ? <div>
                {searchFilter.map((fun, index) => (
                    <FunnelComponent key={index} data={fun} subaccountId={fun.subAccountId}/>
                ))}
                </div> : <div>
                <FolderSearch className='text-muted mt-5' size={200}/>
            </div>}
        </main>
    </div>

  )
}

export default FunnelSection