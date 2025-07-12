"use client"
import { Badge } from '@/components/ui/badge'
import { defaultStyles, EditorBtns } from '@/lib/constants'
import { EditorElement, useEditor } from '@/providers/editor/editor-provider'
import clsx from 'clsx'
import React from 'react'
import { v4 } from 'uuid'
import Recursive from './recursive'
import { Trash } from 'lucide-react'
import { getCustomComponent } from '@/lib/queries'

type Props = {
    element: EditorElement
}

const Container = (props: Props) => {
    const { state, dispatch } = useEditor()

    const handleOnDrop = async (e: React.DragEvent<HTMLDivElement>, id: string ) => {
        e.stopPropagation()
        const componentType = e.dataTransfer.getData("componentType") as EditorBtns
        const copyToID = v4()
        const customComponentInnerHTML = e.dataTransfer.getData("customComponent")


        switch (componentType) {
            
            case "text"://🟢New Case

                dispatch({
                    type: "ADD_ELEMENT",
                    payload: {
                        containerId: id,
                        elementDetails: {   
                            content: { innerText :  "Text element" },
                            id: copyToID,
                            name: "Text",
                            styles: {
                                color: "black",
                                ...defaultStyles
                            },
                            type: "text"
                        }
                    }
                })

                //Come back and finish the copy all inner contents feature

                /* if(componentContent){

                    dispatch({
                        type: "COPY_ALL_CONTENT",
                        payload: {
                            copyFromID: componentContent,
                            copyToID: copyToID
                        }
                    })

                } */

                break;
            case "container": //🟢New Case

                dispatch({
                    type: "ADD_ELEMENT",
                    payload: {
                        containerId: props.element.id,
                        elementDetails: {
                            content: [],
                            id: v4(),
                            name: "Container",
                            styles: { ...defaultStyles },
                            type: "container"
                        }
                    }
                }) 

                break;
            case "video":

                dispatch({
                    type: "ADD_ELEMENT",
                    payload: {
                        containerId: id,
                        elementDetails: {
                            content: {
                                src: ""
                            },
                            id: v4(),
                            name: "Video",
                            styles: {},
                            type: "video"
                        }
                    }
                })

                break;
            case "2Col":

                dispatch({
                    type: "ADD_ELEMENT",
                    payload: {
                        containerId: id,
                        elementDetails: {
                            content: [
                                {
                                    content: [],
                                    id: v4(),
                                    name: "Container",
                                    styles: { ...defaultStyles, width: '100%' },
                                    type: "container"
                                },
                                {
                                    content: [],
                                    id: v4(),
                                    name: "Container",
                                    styles: { ...defaultStyles, width: '100%' },
                                    type: "container"
                                }
                            ],
                            id: v4(),
                            name: "Two Coloumns",
                            styles: {...defaultStyles},
                            type: "2Col"
                        }
                    }
                })
                break;
            case "link":
                dispatch({
                    type: "ADD_ELEMENT",
                    payload: {
                        containerId: id,
                        elementDetails: {
                            content: {
                                innerText: "Link Element",
                                href: ""
                            },
                            id: v4(),
                            name: "Link",
                            styles: {...defaultStyles, color: "black"},
                            type: "link"
                        }
                    }
                })
                break;
            case "3Col":

                dispatch({
                    type: "ADD_ELEMENT",
                    payload: {
                        containerId: id,
                        elementDetails: {
                            content: [
                                {
                                    content: [],
                                    id: v4(),
                                    name: "Container",
                                    styles: { ...defaultStyles, width: '100%' },
                                    type: "container"
                                },
                                {
                                    content: [],
                                    id: v4(),
                                    name: "Container",
                                    styles: { ...defaultStyles, width: '100%' },
                                    type: "container"
                                },
                                {
                                    content: [],
                                    id: v4(),
                                    name: "Container",
                                    styles: { ...defaultStyles, width: '100%' },
                                    type: "container"
                                }
                            ],
                            id: v4(),
                            name: "Three Coloumns",
                            styles: {...defaultStyles},
                            type: "3Col"
                        }
                    }
                })

                break;
            case "contactForm":

                dispatch({
                    type: "ADD_ELEMENT",
                    payload: {
                        containerId: id,
                        elementDetails: {
                            content: [],
                            id: v4(),
                            name: "Contact form",
                            styles: { ...defaultStyles },
                            type: "contactForm"
                        }
                    }
                })

                break;
            case "image":

                dispatch({
                    type: "ADD_ELEMENT",
                    payload: {
                        containerId: id,
                        elementDetails: {
                            content: { src: "" },
                            id: v4(),
                            name: "Image",
                            styles: { width: "400px", height: "340px"},
                            type: "image"
                        }
                    }
                })

                break;
            case "paymentForm":
                dispatch({
                    type: "ADD_ELEMENT",
                    payload: {
                        containerId: id,
                        elementDetails: {
                            content: [],
                            id: v4(),
                            name: "Payment form",
                            styles: {},
                            type: "paymentForm"
                        }
                    }
                })
                break
            default: //🟢New Case
                break;
        }

        if(customComponentInnerHTML){

            const customComponentData = await getCustomComponent(customComponentInnerHTML)
            dispatch({
                type: "ADD_ELEMENT",
                payload: {
                    containerId: id,
                    elementDetails: {
                        content : { innerHTML: customComponentData?.innerHTML },
                        id: v4(),
                        name: customComponentData?.name || "Comoponent",
                        styles: {},
                        type: "custom"
                    }
                }
            })
        }
    }

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault() }

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, type: EditorBtns) => {
        //If drags of containers dont work remove this
        e.stopPropagation()

        e.dataTransfer.setData("componentType", type || "")
    }

    const handleOnClick = (e: React.MouseEvent) => {
        e.stopPropagation()
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
    <div onDrop={e => handleOnDrop(e, props.element.id)} onDragOver={handleDragOver} onClick={handleOnClick} draggable={props.element.type !== "__body"} onDragStart={e => handleDragStart(e, "container")} style={props.element.styles} className={clsx("relative p-4 transition-all group", {
        "max-w-full w-full": props.element.type === "container" || props.element.type === "2Col",
        "h-fit": props.element.type === "container",
        "h-full scroll scrollable-element": props.element.type === "__body",
        "flex flex-col md:!flex-row": props.element.type === "2Col",
        "!border-blue-500": state.editor.selectedElement.id === props.element.id && !state.editor.liveMode && state.editor.selectedElement.type !== "__body",
        "!border-yellow-400 !border-4": state.editor.selectedElement.id === props.element.id && !state.editor.liveMode && state.editor.selectedElement.type === "__body",
        "!border-solid": state.editor.selectedElement.id === props.element.id && !state.editor.liveMode,
        "border-dashed border-[1px] border-slate-300": !state.editor.liveMode
    })}>
        <Badge className={clsx("absolute -top-[23px] -left-[1px] rounded-none rounded-t-lg hidden", {"block": state.editor.selectedElement.id  === props.element.id && !state.editor.liveMode, "top-0": state.editor.selectedElement.type === "__body"})}>
            {props.element.name}
        </Badge>

        {Array.isArray(props.element.content) && props.element.content.length > 0  && props.element.content.map((content, index) => (
            <Recursive element={content} key={index} />
        ))}

        {!state.editor.liveMode && state.editor.selectedElement.id === props.element.id && state.editor.selectedElement.type !== "__body" && <div className='absolute bg-primary px-2.5 py-1 text-xs font-bold -top-[25px] -right-[1px] rounded-none rounded-t-lg'>
            <Trash size={16} onClick={handleDeleteElement}/>
        </div>}

    </div>
  )
}

export default Container