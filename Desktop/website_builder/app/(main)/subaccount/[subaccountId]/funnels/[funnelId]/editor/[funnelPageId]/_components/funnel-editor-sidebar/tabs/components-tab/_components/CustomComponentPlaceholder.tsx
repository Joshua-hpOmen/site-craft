"use client"
import { toast } from '@/hooks/use-toast'
import { deleteCustomComponent } from '@/lib/queries'
import { CustomComponents } from '@prisma/client'
import { Code2, Edit, Trash } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

type Props = {
    component: CustomComponents,
    subaccountId: string,
    funnelId: string
}

const CustomComponentPlaceholder = (props: Props) => {
    const [showPopUp, setShowPopUp] = React.useState(false)

    const handleRightClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setShowPopUp(prev => !prev)
    }

    const handleDelete = async (e: React.MouseEvent) => {
        e.stopPropagation();

        try {
            await deleteCustomComponent(props.component.id)
            
            toast({
                title: "Success",
                description: "Deleted the custom component"
            })
            
            window.location.reload()
        } catch (error) {
            toast({
                title: "Oops!",
                description: "Couldnt delete the custom component",
                variant: "destructive"
            })
        }
    }
  return (
    <div className='py-3 px-2 w-fit justify-center rounded-md flex flex-col items-center bg-muted relative' id={props.component.id} draggable onContextMenu={handleRightClick} onDragStart={(e) => {
        e.dataTransfer.setData("customComponent", props.component.id)
    }} >
        <Code2/>
        {props.component.name}

        {showPopUp && <>

            <div className='fixed inset-0' onClick={(e) => {e.stopPropagation(); setShowPopUp(false)}}></div>

            <div className='absolute bg-muted p-3 rounded-sm border-[2px] border-slate-700 -bottom-[103px] flex flex-col gap-3 -right-[40px] z-10'>
                <span className='underline'>Actions</span>
                <Link href={`/subaccount/${props.subaccountId}/funnels/${props.funnelId}/editor/customcomponent/${props.component.id}`} className='flex gap-2 items-center'><Edit/>Edit</Link>
                <span className='flex gap-2 items-center cursor-pointer' onClick={handleDelete}><Trash/>Delete</span>
            </div>

        </>}
    </div>
  )
}

export default CustomComponentPlaceholder