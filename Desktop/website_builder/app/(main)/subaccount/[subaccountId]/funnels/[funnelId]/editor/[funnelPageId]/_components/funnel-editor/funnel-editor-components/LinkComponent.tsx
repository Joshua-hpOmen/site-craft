"use client"
import { Badge } from '@/components/ui/badge'
import { EditorBtns } from '@/lib/constants'
import { EditorElement, useEditor } from '@/providers/editor/editor-provider'
import clsx from 'clsx'
import { Trash } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

type Props = {
    element: EditorElement
}

const LinkComponent = (props: Props) => {
  const  {state, dispatch} = useEditor()


  const handleDragStart = (e: React.DragEvent, type: EditorBtns) => {
    e.stopPropagation()
    if(type !== "link" || type === null) return

    e.dataTransfer.setData("componentType", type)
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

  const handleDeleteElement = (e: React.MouseEvent) => {
    e.stopPropagation()

    dispatch({
      type: "DELETE_ELEMENT",
      payload: {
        elementDetails: props.element
      }
    })
  }

  return (
    <div onClick={handleClick} onDragStart={(e) => handleDragStart(e, "link")} draggable style={props.element.styles} className={clsx("p-[2px] w-full m-[5px] relative text-[16px] transition-all", {
        "!border-blue-500": state.editor.selectedElement.id === props.element.id,
        "!border-solid" : state.editor.selectedElement.id === props.element.id,
        "border-dashed border-[1px] border-slate-300" : !state.editor.liveMode
    })}>

      {state.editor.selectedElement.id === props.element.id && !state.editor.liveMode && <>
          <Badge className='absolute -top-[23px] -left-[1px] rounded-none rounded-t-lg'>
              {state.editor.selectedElement.name}
          </Badge>

            <div className='absolute bg-primary px-2.5 py-1 text-xs font-bold -top-[25px] -right-[1px] rounded-none rounded-t-lg !text-white'>
              <Trash className='cursor-pointer' size={16} onClick={handleDeleteElement}/>
          </div>
      </>}

      {!Array.isArray(props.element) && !state.editor.liveMode && (
        <span contentEditable={!state.editor.liveMode} onBlur={(e) => {

          dispatch({
            type: "UPDATE_ELEMENT",
            payload: {
              elementDetails: {
                ...props.element,
                content: { innerText : e.target.innerText}
              }
            }
          })

        }}>
          {!Array.isArray(props.element.content) && props.element.content.innerText}
        </span>
      )}

      {!Array.isArray(props.element.content) && state.editor.liveMode && (
        <Link target="_blank" href={props.element.content.href || "#"}>
          {props.element.content.innerText}
        </Link>
      )}

    </div>
  )
}

export default LinkComponent