"use client"
import FunnelPagePlaceholder from '@/components/icons/funnel-page-placeholder'
import { Badge } from '@/components/ui/badge'
import { EditorBtns } from '@/lib/constants'
import { EditorElement, useEditor } from '@/providers/editor/editor-provider'
import clsx from 'clsx'
import { Trash } from 'lucide-react'
import Image from 'next/image'
import React from 'react'

type Props = {
    element: EditorElement
}

const ImageComponent = (props: Props) => {
  const {state, dispatch} = useEditor();

  const handleDragStart = (e: React.DragEvent, type : EditorBtns) => {
    e.stopPropagation();
    if(type === null) return

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
  
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch({
      type: "CHANGE_CLICKED_ELEMENT",
      payload: {
        elementDetails: props.element
      }
    })
  }

  if(!Array.isArray(props.element.content)){
    console.log(props.element.content.src)
  }

  return (
    <div draggable={!state.editor.liveMode} onClick={handleClick} style={props.element.styles} onDragStart={(e) => handleDragStart(e, "image")} 
      className={clsx('p-[2px] w-full m-[5px] relative text-[16px] transition-all flex items-center justify-center',{
          '!border-solid !border-blue-500': state.editor.selectedElement.id === props.element.id,
          'border-dashed border-[1px] border-slate-300': !state.editor.liveMode,
      })}>

        {state.editor.selectedElement.id === props.element.id && !state.editor.liveMode && <>
            <Badge className='absolute -top-[23px] -left-[1px] rounded-none rounded-t-lg'>
                {state.editor.selectedElement.name}
            </Badge>

             <div className='absolute bg-primary px-2.5 py-1 text-xs font-bold -top-[25px] -right-[1px] rounded-none rounded-t-lg !text-white'>
                <Trash className='cursor-pointer' size={16} onClick={handleDeleteElement}/>
            </div>
        </>}
        
        {!Array.isArray(props.element.content) && props.element.content.src ? <Image unoptimized alt='Image' src={props.element.content.src || ""} onError={(e) => {
          const target = e.target as HTMLImageElement 
          target.onerror = null;
          target.src = ""
        }}
          width={props.element.styles.width?.toString().endsWith('px') ? Number(props.element.styles.width?.toString().split('p')[0]) : Number(props.element.styles.width)} 
          height={props.element.styles.height?.toString().endsWith('px') ? Number(props.element.styles.height?.toString().split('p')[0]) : Number(props.element.styles.height)}/>
        :<div className="cursor-pointer w-full bg-black relative group">
          <FunnelPagePlaceholder />
        </div>}

      </div>
  )
}

export default ImageComponent