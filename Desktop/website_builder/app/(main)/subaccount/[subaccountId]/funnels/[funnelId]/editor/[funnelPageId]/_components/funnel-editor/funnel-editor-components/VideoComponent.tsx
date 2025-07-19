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

function getYouTubeEmbedUrl(url: string): string {
  if (!url) return "https://www.youtube.com/embed/Vxq6Qc-uAmE"

  try {
    const parsedUrl = new URL(url)

    // Handle standard YouTube URLs
    if (parsedUrl.hostname.includes("youtube.com")) {
      const videoId = parsedUrl.searchParams.get("v")
      if (videoId) return `https://www.youtube.com/embed/${videoId}`
    }

    // Handle youtu.be short URLs
    if (parsedUrl.hostname === "youtu.be") {
      return `https://www.youtube.com/embed${parsedUrl.pathname}`
    }

    // Fallback: use original if not YouTube
    return url
  } catch {
    return "https://www.youtube.com/embed/Vxq6Qc-uAmE"
  }
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
    
    if(Array.isArray(props.element.content)) return
    const url = getYouTubeEmbedUrl(props.element.content.src)

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
            <iframe src={url} title='Youtube video Player' width={props.element.styles.width || "315"} height={props.element.styles.height || "560"} 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen referrerPolicy="strict-origin-when-cross-origin"/>
        )}

    </div>
  )
}

export default VideoComponent