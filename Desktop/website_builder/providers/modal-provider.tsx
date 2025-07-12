"use client"

import { PriceList } from "@/lib/constants"
import { Agency, Plan, User } from "@prisma/client"
import React from "react"

interface ModalProviderProps{
    children: React.ReactNode
}

export type ModalData = {
    user?: User,
    agency?: Agency,
    plans?: {
        defaultPriceId: Plan,
        plans: PriceList["data"]
    }
}

type ModalContextType = {
    data: ModalData,
    isOpen: boolean,
    setOpen: (modal: React.ReactNode, fetchData ?: () => Promise<any>) => void,
    setClose: () => void
}

export const ModalContext = React.createContext<ModalContextType>({
    data: {},
    isOpen: false,
    setOpen: (modal: React.ReactNode, fetchData ?: () => Promise<any>) => {},
    setClose: () => {}
})

const ModalProvider : React.FC<ModalProviderProps> = ({children}) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const [data, setData] = React.useState<ModalData>({});
    const [showingModal, setShowingModal] = React.useState<React.ReactNode>(null)
    /* Modals create hydration errors should be because of shadcn if you use it */
    // const [isMounted, setIsMounted] = React.useState(false)

    //React.useEffect(() => {
    //    setIsMounted(true)
    //}, [])

    const setOpen = async (modal: React.ReactNode, fetchData?: () => Promise<any>) => {
        if(modal){
            if (!!fetchData){
                const fethcedData = await fetchData();
                setData(prev => ({...prev, ...fethcedData}))
            }

            setShowingModal(modal)
            setIsOpen(true)
        }
    }

    const setClose = () => {
        setIsOpen(false),
        setData({})
    }

    return <ModalContext.Provider value={{data, setOpen, setClose, isOpen}}>
        {children}
        {showingModal}
    </ModalContext.Provider>

}

export const useModal = () => {
        const context = React.useContext(ModalContext);
        if(!context) throw new Error("useModal not used within a ModalProvider")
        return context  
}

export default ModalProvider