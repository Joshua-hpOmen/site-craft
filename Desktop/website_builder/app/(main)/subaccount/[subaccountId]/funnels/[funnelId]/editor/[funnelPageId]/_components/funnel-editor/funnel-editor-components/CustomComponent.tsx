import { Badge } from '@/components/ui/badge'
import { EditorBtns } from '@/lib/constants'
import { EditorElement, useEditor } from '@/providers/editor/editor-provider'
import clsx from 'clsx'
import { Trash } from 'lucide-react'
import React from 'react'

type Props = {
    element: EditorElement
}

const CustomComponent = (props: Props) => {
    const { state, dispatch } = useEditor()
    const previewRef = React.useRef<HTMLIFrameElement>(null)
    
    React.useEffect(() => {
    if(!previewRef.current) return
    if(Array.isArray(props.element.content)) return
    const doc = previewRef.current.contentDocument
    if(!doc) return

    doc.open()
    doc.write(props.element.content.innerHTML || "<section>Hello World</section>")
    doc.close()
    }, [props.element.content])

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();

        dispatch({
            type: "CHANGE_CLICKED_ELEMENT",
            payload: {
                elementDetails: props.element
            }
        })
    }

    const handleDrag = (e: React.DragEvent, type: EditorBtns) => {
        e.stopPropagation();
        if(type === null) return
        e.dataTransfer.setData("customComponent", type)
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

    if(Array.isArray(props.element.content)) return <> </>

  return (
    <div draggable={!state.editor.liveMode} onClick={handleClick} style={props.element.styles} onDragStart={(e) => handleDrag(e, "custom")}
        className={clsx("p-4 w-full m-[5px] relative text-[16px] transition-all", {
            "!border-blue-500": state.editor.selectedElement.id === props.element.id,
            "!border-solid" : state.editor.selectedElement.id === props.element.id,
            "border-dashed border-[1px] border-slate-300" : !state.editor.liveMode
        })}>
        <iframe ref={previewRef}></iframe>

        {state.editor.selectedElement.id === props.element.id && !state.editor.liveMode && <>
            <Badge className='absolute -top-[23px] -left-[1px] rounded-none rounded-t-lg'>
                {state.editor.selectedElement.name}
            </Badge>

            <div className='absolute bg-primary px-2.5 py-1 text-xs font-bold -top-[25px] -right-[1px] rounded-none rounded-t-lg !text-white'>
                <Trash className='cursor-pointer' size={16} onClick={handleDeleteElement}/>
            </div>
        </>}
    </div>
  )
}

export default CustomComponent