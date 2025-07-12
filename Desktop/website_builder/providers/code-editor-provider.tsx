"use client"
import React from "react";

interface ComponentProviderProps {
    children: React.ReactNode
}

export type ComponentData = {
    code?: string,
    representationComponent?: string,
    name?: string
}

export type ComponentContextType = {
    data : ComponentData,
    setData : React.Dispatch<React.SetStateAction<ComponentData>>
}

export const ComponentContext = React.createContext<ComponentContextType | undefined>(undefined)

const ComponentProvider: React.FC<ComponentProviderProps> = ({children}) => {
    const [data, setData] = React.useState<ComponentData>({
        code: "",
        name: ""
    }) 

    return(
        <ComponentContext.Provider value={{data, setData}}>
            {children}
        </ComponentContext.Provider>
    )
}

export const useComponent = () => {
    const context = React.useContext(ComponentContext)
    if(!context) throw new Error("Not using component properly")
    return context
}

export default ComponentProvider