"use client"
import { EditorBtns } from "@/lib/constants"
import { EditorAction } from "./editor-actions"
import React, { createContext, Dispatch } from "react"
import { FunnelPage } from "@prisma/client"
import { v4 } from "uuid"

export type DeviceTypes = "Desktop" | "Mobile" | "Tablet"

type ContentType = EditorElement[] | { href?: string, innerText?: string, src?: string, innerHTML?: string }

export type EditorElement = {
    id: string
    styles: React.CSSProperties
    name: string
    type: EditorBtns
    content: ContentType
}

export type Editor = {
    liveMode: boolean
    elements: EditorElement[]
    selectedElement: EditorElement
    device: DeviceTypes
    previewMode: boolean
    funnelPageId: string
}

export type HistoryState = {
    history: Editor[]
    currentIndex: number
}

export type EditorState = {
    editor: Editor
    history: HistoryState
}


const initialEditorState: Editor = {
    elements: [
        {
            content: [],
            id: "__body",
            name: "Body",
            styles: {},
            type: "__body"
        }
    ],
    selectedElement: {
        id: "",
        content: [],
        name: "",
        styles: {},
        type: null
    },
    device: "Desktop",
    previewMode: false,
    liveMode: false,
    funnelPageId: ""
}

const initialHistoryState: HistoryState = {
    history: [initialEditorState], //type of Editor[]
    currentIndex: 0
}

const initialState : EditorState = {
    editor: initialEditorState,
    history: initialHistoryState
}

const addAnElement = (elements: EditorElement[], action: EditorAction) : EditorElement[] => { //🔴Dispactch func
    
    if(action.type !== "ADD_ELEMENT") throw new Error("🔴You sent he wrong action type to the add element editor state")


    return elements.map(item => {

        //we will map over the elements to find the element we dropping the element we want to add to
        if(item.id === action.payload.containerId && Array.isArray(item.content)){
            return {
                ...item,
                content: [...item.content, action.payload.elementDetails]
            }
            //if we dont find the element that means the element should just be on of the elements within the current element
            // so we perform a recursive function within the elements contained within the current element to find out if
            //the element we looking to add to is within that 
        }else if(item.content && Array.isArray(item.content)){
            return {...item, content: addAnElement(item.content, action)}
        }

        //This is the catch or default case as if we dont find the elements id its not within in this stack of elements
        return item

    })
}

const updateAnElement = (elements: EditorElement[], action: EditorAction) : EditorElement[] => { //🔴Dispactch func

    if(action.type !== "UPDATE_ELEMENT") throw new Error("🔴Wrong action sent to updateElements")

    return elements.map(item => {

        if(item.id === action.payload.elementDetails.id){

            return { ...item, ...action.payload.elementDetails }

        }else if (item.content && Array.isArray(item.content)){
            return { ...item, content: updateAnElement(item.content, action)}
        }

        return item
    })        

}

const deleteAnElement = (elements: EditorElement[], action: EditorAction) : EditorElement[] => {//🔴Dispactch func
    if(action.type !== "DELETE_ELEMENT") throw new Error("🔴The wrong action was sent to the delete element")
    
    return elements.filter(item => {
        if (item.id === action.payload.elementDetails.id){
            return false;
        }else if(item.content && Array.isArray(item.content)){
            item.content = deleteAnElement(item.content, action)
        }

        return true
    })
}

const createDeepCopy = (elementContent: ContentType) : ContentType => {

    if(!elementContent) return [];

    if(!Array.isArray(elementContent)) return elementContent

    return elementContent.map(item => (
        { ...item, id: v4(), content: createDeepCopy(item.content)}
    ))

}

const copyToAnElement = (elements: EditorElement[], action: EditorAction): EditorElement[] => {
    if(action.type !== "COPY_ALL_CONTENT") throw new Error("🔴This is an error")
    
    const elementsToCopyFrom = elements.find(elem => elem.id === action.payload.copyFromID)

    return elements.map(elem => {
        if(elem.id === action.payload.copyToID){

            elem =  {
                ...elem,
                ...elementsToCopyFrom,
                id: elem.id
            }

            return elem

        }else if(Array.isArray(elem.content) && elem.content){
            return { ...elem, content : copyToAnElement(elem.content, action) }
        }

        return elem
    })


}

const editorReducer = (state: EditorState = initialState, action : EditorAction) : EditorState => {
    switch (action.type){
        case "ADD_ELEMENT": //🟢New case
            const updatedEditorState = {
                ...state.editor,
                elements: addAnElement(state.editor.elements, action)
            }

            //The slicing is because if we do an undo we dont want to copy the future states as we have made changes now so slicing
            // up to the current index plus one gives you all the previous state up to and including the current state

            const updatedHistory = [...state.history.history.slice(state.history.history.length > 4 ? state.history.currentIndex - 3 : 0, state.history.currentIndex + 1), {...updatedEditorState}]

            const newEidtorState = {
                ...state,
                editor: updatedEditorState,
            
                history: {
                    ...state.history,
                    history: updatedHistory,
                    currentIndex: updatedHistory.length - 1
                }
            }

            return newEidtorState

        case "UPDATE_ELEMENT": //🟢New case
            const updatedElements = updateAnElement(state.editor.elements, action)

            const updatedElementIsSelected = state.editor.selectedElement.id === action.payload.elementDetails.id

            const updatedEditorStateWithUpdate = {
                ...state.editor,
                elements: updatedElements,
                selectedElement: updatedElementIsSelected ? action.payload.elementDetails : { 
                    id: "",
                    content: [],
                    name: "",
                    styles: {},
                    type: null
                }
            }

            const updatedHistoryWithUpdate = [
                ...state.history.history.slice(state.history.history.length > 4 ? state.history.currentIndex - 3 : 0, state.history.currentIndex + 1),
                { ...updatedEditorStateWithUpdate }
            ]
            
            const updatedEditor = {
                ...state,
                editor: updatedEditorStateWithUpdate,
                history: {
                    ...state.history,
                    history: updatedHistoryWithUpdate,
                    currentIndex: updatedHistoryWithUpdate.length - 1
                }
            }

            return updatedEditor

        case "DELETE_ELEMENT": //🟢New case

            const updatedDeletedElement = deleteAnElement(state.editor.elements, action)

            const updatedEditorStateForDeleted = {
                ...state.editor,
                elements: [ ...updatedDeletedElement ],
                selectedElement: {
                    id: "",
                    content: [],
                    name: "",
                    styles: {},
                    type: null
                }
            }

            const updateHistoryWithDeleted = [
                ...state.history.history.slice(0, state.history.currentIndex + 1 ),
                { ...updatedEditorStateForDeleted }
            ]

            const updatedEditorAftDel = {
                ...state,
                editor: updatedEditorStateForDeleted,
                history: {
                    ...state.history,
                    history: updateHistoryWithDeleted,
                    currentIndex: updateHistoryWithDeleted.length - 1
                }
            }


            return updatedEditorAftDel

        case "CHANGE_CLICKED_ELEMENT": //🟢New case

            const clickedState = {
                ...state,
                editor: {
                    ...state.editor,
                    selectedElement: action.payload.elementDetails || {
                        id: "",
                        content: [],
                        name: "",
                        styles: {},
                        type: null
                    }
                },
                history: {
                    ...state.history,
                    history: [
                        ...state.history.history.slice(state.history.history.length > 4 ? state.history.currentIndex - 3 : 0, state.history.currentIndex + 1),
                        { ...state.editor }
                    ],
                    currentIndex: state.history.currentIndex + 1
                }
            }

            return clickedState

        case "CHANGE_DEVICE": //🟢New case

            const changeDeviceState = {
                ...state,
                editor : {
                    ...state.editor,
                    device: action.payload.device
                }
            }

            return changeDeviceState

        case "TOGGLE_PREVIEW_MODE": //🟢New case

            const toggleState = {
                ...state,
                editor: {
                    ...state.editor,
                    previewMode: !state.editor.previewMode
                }
            }

            return toggleState

        case "TOGGLE_LIVE_MODE": //🟢New case

            const toggleLiveMode = {
                ...state,
                editor: {
                    ...state.editor,
                    liveMode: action.payload ? action.payload.value : !state.editor.liveMode
                }
            }

            return toggleLiveMode

        case "REDO": //🟢New case

            //Checking if there is anything we can redo to
            if(state.history.currentIndex < state.history.history.length -1) {  
                const nextIndex = state.history.currentIndex + 1
                const nextEditorElementState = {...state.history.history[nextIndex]}

                const redoState = {
                    ...state,
                    editor: nextEditorElementState,
                    history: {
                        ...state.history,
                        currentIndex: nextIndex
                    }
                }

                return redoState
            }

            return state

        case "UNDO": //🟢New case

            if(state.history.currentIndex > 0){
                const previousIndex = state.history.currentIndex - 1
                const previousIndexElementState = { ...state.history.history[previousIndex] }

                const undoState = {
                    ...state,
                    editor: previousIndexElementState,
                    history: {
                        ...state.history,
                        currentIndex: previousIndex
                    }
                }

                return undoState
            }

            return state

        case "LOAD_DATA": //🟢New case

            return {
                ...initialState,
                editor: {
                    ...initialState.editor,
                    elements: action.payload.elements || initialEditorState.elements,
                    liveMode: !!action.payload.withLive
                }
            }

        case "SET_FUNNELPAGE_ID": //🟢New case

            const {funnelPageId} = action.payload

            const updatedEditorStateWithFunnelPageId = {
                ...state.editor,
                funnelPageId
            }

            const updateHistoryWithFunnelPageId = [
                ...state.history.history.slice(0, state.history.currentIndex + 1),
                { ...updatedEditorStateWithFunnelPageId }
            ]


            const funnelPageIdState = {
                ...state,
                editor: updatedEditorStateWithFunnelPageId,
                history: {
                    ...state.history,
                    history: updateHistoryWithFunnelPageId,
                    currentIndex: updateHistoryWithFunnelPageId.length - 1
                }
            }

            return funnelPageIdState

        case "COPY_ALL_CONTENT":
            const updateElement = copyToAnElement(state.editor.elements, action)

            const editorState = { ...state.editor, updateElement }

            const updatedHIstoryAfterCopy = [...state.history.history.slice(0, state.history.currentIndex + 1), {...editorState } ]

            const newEditorStateAfterCopy = {
                ...state,
                editor: editorState,
                history: {
                    ...state.history,
                    history: updatedHIstoryAfterCopy,
                    currentIndex: updatedHIstoryAfterCopy.length - 1
                }
            }

            return newEditorStateAfterCopy

        default : //🟢New case
            return state
    }
}

export type EditorContextData = {
    device: DeviceTypes,
    previewMode: boolean,
    setDevice: (device: DeviceTypes) => void,
    setPreviewMode: (previewMode: boolean) => void,
}

export const EditorContext = createContext<{state: EditorState, dispatch: Dispatch<EditorAction>, subaccountId: string, funnelId: string, pageDetails: FunnelPage | null}>(
    {
        state: initialState,
        dispatch: () => undefined,
        subaccountId: "",
        funnelId: "",
        pageDetails: null
    }
)

type EditorProps = {
    children: React.ReactNode,
    subaccountId: string,
    funnelId: string, 
    pageDetails: FunnelPage
}

const EditorProvider = (props: EditorProps) => {
    const [state, dispatch] = React.useReducer(editorReducer, initialState)

    return (
        <EditorContext.Provider value={{state, dispatch, subaccountId: props.subaccountId, funnelId: props.funnelId, pageDetails: props.pageDetails}}>
            {props.children}
        </EditorContext.Provider>
    )
}

export const useEditor = () => {
    const editorContext = React.useContext(EditorContext)
    if(!editorContext) throw new Error("🔴Use editor hook failed")
    return editorContext
}

export default EditorProvider