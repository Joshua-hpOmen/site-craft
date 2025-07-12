"use client"
import useMobile from '@/hooks/useMobile'
import { useEditor } from '@/providers/editor/editor-provider'
import { FunnelPage } from '@prisma/client'
import React, { FocusEventHandler } from 'react'
import MobileNotSupported from './MobileNotSupported'
import Link from 'next/link'
import { ChevronLeftCircle, EyeIcon, Laptop, Redo2, Smartphone, Tablet, Undo2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { useRouter } from 'next/navigation'
import { saveActLogNotification, upsertFunnelPage } from '@/lib/queries'
import { toast } from '@/hooks/use-toast'
import clsx from 'clsx'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import dayjs from 'dayjs'
import {DeviceTypes} from "@/providers/editor/editor-provider"
import { createPortal } from 'react-dom'

type Props = {
    funnelId: string,
    funnelPageDetails: FunnelPage,
    subaccountId: string
}

const FunnelEditorNavigation = (props: Props) => {
    const {state, dispatch} = useEditor()
    const mobile = useMobile()
    const router = useRouter()

    React.useEffect(() => {
        dispatch({
            type: "SET_FUNNELPAGE_ID",
            payload: {
                funnelPageId: props.funnelPageDetails.id
            }
        })
    }, [props.funnelPageDetails])


    const handleTitleChange : FocusEventHandler<HTMLInputElement> = async (event) => {

        if(event.target.value === props.funnelPageDetails.name) return
        if(event.target.value){
            try {
                await upsertFunnelPage(props.subaccountId, {id: props.funnelPageDetails.id, name: event.target.value, order: props.funnelPageDetails.order}, props.funnelId)
    
                toast({
                    title: "Success",
                    description: "Saved title"
                })
    
                router.refresh()
            } catch (error) {
                toast({
                    title: "Oops!",
                    description: "Failed to rename title",
                    variant: "destructive"
                })
            }
        }else {
            toast({
                title: "Oops!",
                description: "You need to have a title",
                variant: "destructive"
            })

            event.target.value = props.funnelPageDetails.name
        }
    }

    const handlePreviewClick = () => {
        dispatch({ type: "TOGGLE_PREVIEW_MODE" })
        dispatch({ type: "TOGGLE_LIVE_MODE" })
    }

    const handleUndo = () => { dispatch({ type : "UNDO" })}

    const handleRedo = () => { dispatch({ type : "REDO" })}

    const handlesetActiveDisplaySize = (input: DeviceTypes) => {

        if(input === state.editor.device) return
        
        dispatch({
            type: "CHANGE_DEVICE",
            payload: { device: input }
        })

    }

    const handleSave = async () => {
        const content = JSON.stringify(state.editor.elements)
        try {
            const response = await upsertFunnelPage(props.subaccountId, { ...props.funnelPageDetails, content }, props.funnelId)

            await saveActLogNotification({
                agencyId: undefined,
                description: `Updated a funnel page | ${response?.name}`,
                subAccountId: props.subaccountId,
            })

            toast({
                title: "Success",
                description: "Saved editor"
            })
        } catch (error) {
            toast({
                title: "Oops!",
                description: "Couldnt save the editor",
                variant: "destructive"
            })
        }
    }

  return (<>
    {
        mobile ? <MobileNotSupported/> : <div>
            <header className={clsx('border-b-[1px] z-30 bg-background flex h-24 items-center justify-between p-6 gap-2 transition-all', { '!h-0 !p-0 !overflow-hidden': state.editor.previewMode } )} >

                <aside className='flex gap-3 items-center'>
                    <Link href={`/subaccount/${props.subaccountId}/funnels/${props.funnelId}`}><ChevronLeftCircle/></Link>

                    <div className='flex flex-col'>
                        <Input type="text" className='border-none text-lg p-0 bg-transparent' onBlur={handleTitleChange} defaultValue={props.funnelPageDetails.name}/>
                        <span className='text-sm text-muted-foreground'>Path: /{props.funnelPageDetails.pathName}</span>
                    </div>
                </aside>

                <aside className='flex gap-3 items-center'>
                    <span onClick={() => handlesetActiveDisplaySize("Desktop")} className={clsx('relative group/laptop cursor-pointer', {"border-2 border-slate-700 rounded-md p-2": state.editor.device === "Desktop"})}>
                        <Laptop/>
                        <span className='opacity-0 group-hover/laptop:opacity-100 absolute -left-1/2 top-3 text-muted-foreground p-4'>Laptop</span>
                    </span>
                    
                    <span onClick={() => handlesetActiveDisplaySize("Tablet")} className={clsx('relative group/tablet cursor-pointer', {"border-2 border-slate-700 rounded-md p-2": state.editor.device === "Tablet"})}>
                        <Tablet/>
                        <span className='opacity-0 group-hover/tablet:opacity-100 absolute -left-1/2 top-3 text-muted-foreground p-4'>Tablet</span>
                    </span>
                    
                    <span onClick={() => handlesetActiveDisplaySize("Mobile")} className={clsx('relative group/phone cursor-pointer', {"border-2 border-slate-700 rounded-md p-2": state.editor.device === "Mobile"})}>
                        <Smartphone/>
                        <span className='group-hover/phone:opacity-100 z-20 opacity-0 absolute -left-1/2 top-3 rounded-md text-muted-foreground p-4'>Phone</span>
                    </span>
                    
                </aside>

                <aside className='flex gap-5'>
                    {/* Preview Icon */}
                    <button className="" onClick={handlePreviewClick}>
                        <EyeIcon size={25}/>
                    </button>

                    <section className='flex items-center gap-2'>
                        <button onClick={handleUndo} disabled={state.history.currentIndex === 0}><Undo2 className={clsx({"text-gray-600 cursor-not-allowed": Boolean(state.history.currentIndex >= state.history.history.length || state.history.currentIndex === 0)}, )}/></button>
                        <button onClick={handleRedo} disabled={state.history.currentIndex === state.history.history.length - 1}><Redo2 className={clsx({"text-gray-600 cursor-not-allowed": state.history.currentIndex === state.history.history.length - 1})}/></button>
                    </section>

                    <div className='flex flex-col'>
                        <span className='flex items-center gap-2'>
                            Draft
                            <Switch/>
                            Publish
                        </span>
                        <span className='text-sm text-muted-foreground'>Last updated: {dayjs(props.funnelPageDetails.updatedAt).format("D-MMM-YYYY H:m")}</span>
                    </div>

                    <section className='flex items-center'>
                        <button className='px-4 py-2 rounded-md bg-blue-700' onClick={handleSave}>Save</button>
                    </section>

                </aside>


            </header>
        </div>
    }    
  </>
  )
}

export default FunnelEditorNavigation