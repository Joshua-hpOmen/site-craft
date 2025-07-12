"use client"
import { Badge } from '@/components/ui/badge'
import { EditorElement, useEditor } from '@/providers/editor/editor-provider'
import clsx from 'clsx'
import React from 'react'
import Recursive from './recursive'
import { defaultStyles, EditorBtns } from '@/lib/constants'
import { v4 } from 'uuid'
import { Trash } from 'lucide-react'

type Props = {
    element: EditorElement
}

const TwoColoumnsComponent = (props: Props) => {
    const {state, dispatch} = useEditor()


    const handleClick =  (e: React.MouseEvent) => {
        e.stopPropagation();

        dispatch({
            type: "CHANGE_CLICKED_ELEMENT",
            payload:{
                elementDetails: props.element
            }
        })
    }

    const handleDragStart = (e: React.DragEvent, type: EditorBtns) => {
        e.stopPropagation()
        if(type === null || type === "__body") return
        e.dataTransfer.setData("componentType", type)
    }

    const handleDeleteElement = (e: React.MouseEvent) => {
        e.stopPropagation();
        dispatch({
            type: "DELETE_ELEMENT",
            payload: {
                elementDetails: props.element
            }
        })
    }
  return (
    <div style={props.element.styles} draggable={props.element.type !== "__body" || !state.editor.liveMode || !state.editor.previewMode} 
        id='innerContainer' onClick={handleClick} onDragStart={(e) => handleDragStart(e, "2Col")} className={clsx('relative p-4 flex transition-all', {
            'h-fit m-4': props.element.type === 'container',
            'h-full': props.element.type === '__body',
            '!border-solid !border-blue-500': state.editor.selectedElement.id === props.element.id && !state.editor.liveMode,
            'border-dashed border-[1px] border-slate-300': !state.editor.liveMode,
        })}>

            {state.editor.selectedElement.id === props.element.id && !state.editor.liveMode && (<>
                <Badge className="absolute -top-[23px] -left-[1px] rounded-none rounded-t-lg ">
                    {state.editor.selectedElement.name}
                </Badge>
                <div className='absolute bg-primary px-2.5 py-1 text-xs font-bold -top-[25px] -right-[1px] rounded-none rounded-t-lg'>
                    <Trash size={16} onClick={handleDeleteElement}/>
                </div>
            </>)}
            {Array.isArray(props.element.content) && props.element.content.map((childElement) => (
                <Recursive key={childElement.id} element={childElement} />
            ))}

    </div>
  )
}

export default TwoColoumnsComponent