"use client"
import { getFunnel } from '@/lib/queries'
import { Funnel, Prisma } from '@prisma/client'
import clsx from 'clsx'
import React from 'react'
import FunnelStepsPage from './FunnelStepsPage'
import FunnelSettingsPage from './FunnelSettingsPage'

type Props = {
    funnel: Prisma.PromiseReturnType<typeof getFunnel>
}

enum Page {
    STEPS,
    SETTINGS
}

const FunnelMainPage = (props: Props) => {
    const [selectedHeaderSection, setSelectedHeaderSection] = React.useState(Page.STEPS)
    if(!props.funnel) return
    
  return (
    <div className='flex flex-col min-h-full'>
        <header className='w-full flex justify-between items-center'>
            <section>
                <span className='text-2xl font-semibold'>
                    {props.funnel?.name}
                </span>
            </section>

            <section className='bg-slate-800 p-2 rounded-md flex'>
                <div className={clsx('w-[100px] py-2 text-center', {"bg-slate-900 rounded-md": selectedHeaderSection === Page.STEPS})} onClick={() => setSelectedHeaderSection(Page.STEPS)}>Steps</div>
                <div className={clsx('w-[100px] text-center py-2', {"bg-slate-900 rounded-md": selectedHeaderSection === Page.SETTINGS})} onClick={() => setSelectedHeaderSection(Page.SETTINGS)}>Settings</div>
            </section>
        </header>


        <main className='w-full h-auto flex-1 flex py-3'>
            {selectedHeaderSection === Page.STEPS ? <FunnelStepsPage funnel={props.funnel} pages={props.funnel.FunnelPages}/> : <FunnelSettingsPage funnel={props.funnel}/>}
        </main>
    </div>
  )
}

export default FunnelMainPage