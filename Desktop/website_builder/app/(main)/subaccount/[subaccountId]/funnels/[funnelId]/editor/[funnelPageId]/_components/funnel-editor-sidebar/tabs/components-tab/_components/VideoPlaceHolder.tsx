import { EditorBtns } from '@/lib/constants'
import { Youtube } from 'lucide-react'
import React from 'react'

type Props = {}

const VideoPlaceHolder = (props: Props) => {

    const handleOnDragStart = (e: React.DragEvent, type: EditorBtns) => {
        if(type === null) return
        e.dataTransfer.setData("componentType", type)
    }


  return (
    <div  draggable className='h-14 w-14 bg-muted rounded-lg flex items-center justify-center' onDragStart={(e) => { handleOnDragStart(e, "video") }}>
        <Youtube size={40} className='text-muted-foreground'/>
    </div>
  )
}

export default VideoPlaceHolder