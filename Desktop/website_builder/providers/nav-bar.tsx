//This is for a context for general navbar
import React from "react";

interface GeneralNavBarVisibleProps {
    children : React.ReactNode
}

type GeneralNavBarContext = {
    isVisible: boolean,
    isVisibleForEditor: boolean,
    setVisible: () => void
    setClose: () => void
    setCloseEditor : () => void,
    setOpenForEditor: () => void
}
export const GeneralNavBarConxtext  = React.createContext<GeneralNavBarContext>({
    isVisible: true,
    isVisibleForEditor: true,
    setVisible: () => {},
    setClose: () => {},
    setCloseEditor: () => {},
    setOpenForEditor: () => {},
})

const GeneralNavBarProvider : React.FC<GeneralNavBarVisibleProps> = ({children}) => {
    const [isVisible, setIsVisible] = React.useState(true)
    const [isVisibleForEditor, setIsVisibleForEditor] = React.useState(true)
    const setVisible = () => {
        setIsVisible(true)
    }

    const setClose = () => {
        setIsVisible(false)
    }

    const setCloseEditor = () => {
        setIsVisibleForEditor(false)
    }

    const setOpenForEditor = () => {
        setIsVisibleForEditor(true)
    }


    return <GeneralNavBarConxtext.Provider value={{isVisible, isVisibleForEditor, setVisible, setClose, setCloseEditor, setOpenForEditor}}>
        {children}
    </GeneralNavBarConxtext.Provider>
}

export const useGeneralNavbar = () => {
    const context = React.useContext(GeneralNavBarConxtext)
    if(!context) throw new Error("🔴Failed to created navbar context")
    return context
}

export default GeneralNavBarProvider