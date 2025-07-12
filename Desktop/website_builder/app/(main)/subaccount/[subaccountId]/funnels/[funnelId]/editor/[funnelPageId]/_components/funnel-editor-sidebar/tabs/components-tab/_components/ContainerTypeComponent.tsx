import { EditorElement, useEditor } from '@/providers/editor/editor-provider'
import { ChevronDown } from 'lucide-react'
import React from 'react'
import RecursiveLayoutTree from './RecursiveLayoutTree'
import clsx from 'clsx'

type Props = {
    elem: EditorElement,
    theDisplayingComponent: any
}

const ContainerTypeComponent = (props: Props) => {
    const {dispatch} = useEditor()
    const [showChildren, setShowChildren] = React.useState(false)

    if(!Array.isArray(props.elem.content)) return
  return (
        <div className='' onClick={(e) => {
                e.stopPropagation()
                dispatch({
                    type: "CHANGE_CLICKED_ELEMENT",
                    payload: {
                        elementDetails: props.elem
                    }
                })
            }}>

            <div>

                <div className={clsx('flex cursor-pointer border-y-2 border-y-slate-900 hover:bg-slate-900 py-2', {"justify-between items-center": props.elem.content})}>
                <div className='flex items-center'>
                    {props.theDisplayingComponent?.Component} {props.theDisplayingComponent?.label} 
                </div>

                    {props.elem.content.length > 0 && <div onClick={() => setShowChildren(prev => !prev)}><ChevronDown/></div>}
                </div>

            </div>

            {showChildren && props.elem.content.length > 0 && <div className='ml-3 flex flex-col'>
                <RecursiveLayoutTree elements={props.elem.content}/>  
            </div>}

        </div>
  )
}

export default ContainerTypeComponent