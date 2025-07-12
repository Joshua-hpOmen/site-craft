"use client"
import { LaneDetail } from '@/lib/constants'
import { Pipeline } from '@prisma/client'
import React from 'react'
import View from './View'
import Settings from './Settings'
import { redirect } from 'next/navigation'
import clsx from 'clsx'
import { Check, ChevronsUpDown, PlusCircle } from 'lucide-react'
import { useModal } from '@/providers/modal-provider'
import CustomModal from '@/components/forms/CustomModal'
import CreatePipelineForm from '@/components/forms/CreatePipelineForm'

type Props = {
    pipelines: Pipeline[],
    lanes: LaneDetail[],
    currentPipeline: Pipeline | null,
    subaccountId: string
}

enum Clicked {
    Settings,
    View
}

const PipelinePage = (props: Props) => {
    if(!props.currentPipeline) return redirect("/")
    const [clicked, setClicked] = React.useState<Clicked>(Clicked.View) 
    const [showPipelineDropDown, setShowPipelineDropDown] = React.useState(false)
    const [selectedDropDown, setSelectedDropDown] = React.useState(props.currentPipeline)
    const {setOpen} = useModal()
    return (
        <div className='w-full min-h-full py-4 flex flex-col items-center'>
            <header className='w-[90%] flex justify-between border-b-2 pb-2 border-b-slate-500/25'>
                {/* Pipeline Dropdown select */}
                <section onClick={() => setShowPipelineDropDown(prev => !prev)} className='relative w-[180px] cursor-pointer flex items-center px-1 bg-slate-900 text-muted-foreground rounded-md'>
                    <span className='flex justify-between w-full items-center'>
                        {selectedDropDown.name}
                        <ChevronsUpDown size={20}/>
                    </span>

                    {/* Drop down */}
                    {showPipelineDropDown && <>
                            <div className='absolute top-10 w-[180px] left-0 flex flex-col p-2 z-30 border-t-2 border-t-slate-500/20 bg-slate-900 rounded-b-md' onClick={e => e.stopPropagation()}>
                                <span onClick={(e) => e.stopPropagation()}>
                                    {props.pipelines.map((pipeline, index) => (
                                        <div className={clsx("px-2 py-2 rounded-md cursor-pointer hover:bg-slate-700", {"!bg-blue-700 text-white flex gap-1 justify-between items-center": selectedDropDown.name === pipeline.name})} onClick={() => {setSelectedDropDown(pipeline); setShowPipelineDropDown(false)}} key={index}>
                                            {pipeline.name}
                                            {(selectedDropDown.name === pipeline.name) && <Check size={15}/>}
                                        </div>
                                    ))}
                                </span>

                                <div className='bg-blue-700 p-2 mt-2 flex items-center gap-2 text-white rounded-md' onClick={async() => {
                                    setOpen(
                                        <CustomModal title='Create a pipline' subheading="Pipelines allows you to group tickets into lanes and track your business processes all in one place.">
                                            <CreatePipelineForm subaccountId={props.subaccountId}/>
                                        </CustomModal>
                                    )
                                }}>
                                    <PlusCircle size={15}/>
                                    Create pipeline
                                </div>
                            </div>
                            <div className='fixed inset-0 z-10 cursor-default' onClick={(e) => {e.stopPropagation(); e.preventDefault(); setShowPipelineDropDown(false)}}></div>
                    </>}
                </section>

                {/* Pipeline and settings */}
                <div className='flex gap-3 bg-slate-800 rounded-lg'>
                    <span className={clsx("px-4 py-2 w-[140px] whitespace-nowrap text-center", {"!bg-slate-900 my-1 mx-1 rounded-md": clicked === Clicked.View })} onClick={() => setClicked(Clicked.View)}>Pipeline View</span>
                    <span className={clsx("px-4 py-2 w-[140px] text-center", {"!bg-slate-900 my-1 mx-1 rounded-md": clicked === Clicked.Settings })} onClick={() => setClicked(Clicked.Settings)}>Settings</span>
                </div>
            </header>

            <main className='w-[90%] h-full flex-1'>
                {clicked === Clicked.View ? <View pipelineCurrent={selectedDropDown}/> : <Settings pipelineCurrent={selectedDropDown} pipelines={props.pipelines} subaccountId={props.subaccountId}/>}
            </main>
        </div>
    )
}

export default PipelinePage