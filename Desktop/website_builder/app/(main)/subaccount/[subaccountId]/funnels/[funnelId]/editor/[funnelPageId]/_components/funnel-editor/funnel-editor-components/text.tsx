"use client"
import { Badge } from '@/components/ui/badge'
import { EditorBtns } from '@/lib/constants'
import { EditorElement, useEditor } from '@/providers/editor/editor-provider'
import clsx from 'clsx'
import { Trash } from 'lucide-react'
import React from 'react'

type Props = {
    element: EditorElement
}

const TextComponent = (props: Props) => {
    const { state, dispatch } = useEditor()

    const styles = props.element.styles

    const handleDeleteElement = () => {
        dispatch({
            type: "DELETE_ELEMENT",
            payload: { elementDetails: props.element }
        })
    }

    const handleOnClickBody = (e: React.MouseEvent) => {

        e.stopPropagation()
        dispatch({
            type: "CHANGE_CLICKED_ELEMENT",
            payload: { elementDetails: props.element }
        })
    }

    const handleDragStart = (e: React.DragEvent, type: EditorBtns) => {
        e.stopPropagation()
        if(!type) return 
        
        e.dataTransfer.setData("componentType", type)
        e.dataTransfer.setData("componentCopyingID", props.element.id);
    }

  return (
    <div draggable={!state.editor.previewMode || !state.editor.liveMode} onDragStart={(e) =>{ handleDragStart(e, "text") }} style={styles} onClick={handleOnClickBody} className={clsx("p-[2px] w-full m-[5px] relative text-[16px] transition-all", {
        "!border-blue-500": state.editor.selectedElement.id === props.element.id,
        "!border-solid" : state.editor.selectedElement.id === props.element.id,
        "border-dashed border-[1px] border-slate-300" : !state.editor.liveMode
    })}>

        {/* Edit text box functionality */}

        {state.editor.selectedElement.id === props.element.id && !state.editor.liveMode && <>
            <Badge className='absolute -top-[23px] -left-[1px] rounded-none rounded-t-lg'>
                {state.editor.selectedElement.name}
            </Badge>

             <div className='absolute bg-primary px-2.5 py-1 text-xs font-bold -top-[25px] -right-[1px] rounded-none rounded-t-lg !text-white'>
                <Trash className='cursor-pointer' size={16} onClick={handleDeleteElement}/>
            </div>
        </>}

        {/* Text component content itself */}

        <span contentEditable={!state.editor.liveMode} onBlur={e => {
            const spanElement = e.target as HTMLSpanElement
            dispatch({
                type: "UPDATE_ELEMENT",
                payload: {
                    elementDetails: { 
                        ...props.element,
                        content: { innerText: spanElement.innerText }
                    },
                }
            })
        }}>
            { !Array.isArray(props.element.content) && props.element.content.innerText }
        </span>

    </div>
  )
}

export default TextComponent