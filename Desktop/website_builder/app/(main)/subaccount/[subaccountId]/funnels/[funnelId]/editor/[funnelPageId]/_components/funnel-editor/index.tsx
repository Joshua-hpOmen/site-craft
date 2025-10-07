"use client"
import { getFunnelPageDetails } from '@/lib/queries'
import { useEditor } from '@/providers/editor/editor-provider'
import clsx from 'clsx'
import { EyeOff } from 'lucide-react'
import React from 'react'
import Recursive from './funnel-editor-components/recursive'

type Props = {
    funnelPageId: string,
    liveMode?: boolean
}

const index = (props: Props) => {
    const { state, dispatch } = useEditor()

    React.useEffect(() => {
        if(props.liveMode){
            dispatch({
                type: "TOGGLE_LIVE_MODE",
                payload: { value: true }
            })
        }
    }, [])
    
    React.useEffect(() => {

        const fetchData = async () => {

            const response = await getFunnelPageDetails(props.funnelPageId)

            if(!response) return

            dispatch({
                type: "LOAD_DATA",
                payload: {
                    elements: response.content ? JSON.parse(response.content) : "",
                    withLive: !!props.liveMode
                }
            })
        }

        fetchData()


    }, [props.funnelPageId])

    const handleClick = () => {
        dispatch({
            type: "CHANGE_CLICKED_ELEMENT",
            payload: {}
        })
    }

    const handleUnPreview = () => {
        dispatch({
            type: "TOGGLE_PREVIEW_MODE",
        })
        dispatch({
            type: "TOGGLE_LIVE_MODE"
        })
    }

    if(state.editor.liveMode){
        console.log(state.editor.elements)
    }

  return (
    <div className={clsx("h-full scrollable-element bg-background rounded-md", 
        {"!w-[850px]": state.editor.device === "Tablet"},
        {"!w-[420px]": state.editor.device === "Mobile"},
        {"!w-full": state.editor.device === "Desktop"}
    )} onClick={handleClick}>
        {state.editor.previewMode && state.editor.liveMode && <button className='fixed top-0 left-0 z-[100] bg-slate-600 rounded-md w-6 h-6' onClick={handleUnPreview}>
            <EyeOff/>    
        </button>}

        {Array.isArray(state.editor.elements) && state.editor.elements.map(childEl => <Recursive key={childEl.id} element={childEl}/> )}
    </div>
  )
}

export default index