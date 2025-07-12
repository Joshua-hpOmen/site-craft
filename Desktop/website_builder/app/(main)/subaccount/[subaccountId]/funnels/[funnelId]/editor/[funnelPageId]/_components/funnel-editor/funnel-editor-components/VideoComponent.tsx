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

const VideoComponent = (props: Props) => {
    const {state, dispatch} = useEditor()

    const handleDragStart = (e: React.DragEvent, type: EditorBtns) => {
        e.stopPropagation();
        if(type === null)return

        e.dataTransfer.setData("componentType", type)

    }

    const handleOnClick = (e:React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation()

        dispatch({
            type: "CHANGE_CLICKED_ELEMENT",
            payload: {
                elementDetails: props.element
            }
        })
    }

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation()
        dispatch({
            type: "DELETE_ELEMENT",
            payload: {
                elementDetails: props.element
            }
        })
    }


  return (
    <div style={props.element.styles} onClick={handleOnClick} draggable={!state.editor.liveMode} onDragStart={(e) => handleDragStart(e, "video")}
        className={clsx("p-[2px] w-full m-[5px] relative text-[16px] transition-all flex items-center justify-center", {
            "!border-blue-500 !border-solid": state.editor.selectedElement.id === props.element.id,
            "border-dashed border-[1px] border-slate-300": !state.editor.previewMode
        })}
    >
        {state.editor.selectedElement.id === props.element.id && !state.editor.liveMode && <>
            <Badge className='absolute -top-[23px] -left-[1px] rounded-none rounded-t-lg'>
                {props.element.name}
            </Badge>
            <div className='absolute bg-primary px-2.5 py-1 text-xs font-bold -top-[25px] -right-[1px] rounded-none rounded-t-lg !text-white'>
                <Trash onClick={handleDelete}/>    
            </div>
        </>}

        {!Array.isArray(props.element.content) && (
            <iframe src={props.element.content.src ? props.element.content.src.search(new RegExp("www.youtube.com", "i")) !== -1 ? props.element.content.src.split("www.youtube.com")[0] + 'embed' + props.element.content.src.split("www.youtube.com")[1] : props.element.content.src  : "https://www.youtube.com/embed/Vxq6Qc-uAmE"} title='Youtube video Player' width={props.element.styles.width || "315"} height={props.element.styles.height || "560"} 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen referrerPolicy="strict-origin-when-cross-origin"/>
        )}

    </div>
  )
}

export default VideoComponent