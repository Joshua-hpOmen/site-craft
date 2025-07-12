import { upsertFunnelPage } from '@/lib/queries'
import { FunnelPage } from '@prisma/client'
import { ArrowDown, Mail } from 'lucide-react'
import React from 'react'

type Props = {
    page: FunnelPage,
    activePage: boolean,
    pages: FunnelPage[],
    setPagesState: (adjPages: FunnelPage[]) => void,
    draggableParentRef: React.RefObject<HTMLDivElement | null>,
    index: number,
    subaccountId: string,
    funnnelId: string
}

const PageDraggable = (props: Props) => {
    const coffX = React.useRef(0)
    const coffY = React.useRef(0)
    const dragEnoughTime = React.useRef<ReturnType<typeof setTimeout> | null>(null)
    const pageRef = React.useRef<HTMLDivElement>(null)

    const handleMouseUp = async (e : MouseEvent) => {
        e.preventDefault()
        if(!props.draggableParentRef.current) return
        if(!pageRef.current) return
        const componenetHeight = 16 * 16

        const topOfParent = props.draggableParentRef.current.getBoundingClientRect().height
        const ourPageBottom = pageRef.current.getBoundingClientRect().bottom

        let indexToInsert = Math.floor((ourPageBottom - topOfParent) /componenetHeight)

        if(indexToInsert > props.pages.length -1 ){
            indexToInsert = props.pages.length -1
        }else if(indexToInsert < 0) {
            indexToInsert = 0
        }else if(indexToInsert === props.index){
            console.log("Hello World")
            pageRef.current.style.position = ""
            pageRef.current.style.top = ""
            pageRef.current.style.position = ""
            pageRef.current.style.zIndex = ""
            pageRef.current.style.opacity = ""
            pageRef.current.style.cursor = ""
            document.removeEventListener("mousemove", handleMouseMove)
            document.removeEventListener("mouseup", handleMouseUp)
            return
        }

        let correctingPagesOrder = [...props.pages]
        correctingPagesOrder = correctingPagesOrder.toSpliced(props.index,1).toSpliced(indexToInsert, 0, props.page)
        correctingPagesOrder.forEach((pageInstance, index) => pageInstance.order = index+1)

        console.log(correctingPagesOrder)
        props.setPagesState(correctingPagesOrder)
        pageRef.current.style.position = ""
        pageRef.current.style.top = ""
        pageRef.current.style.position = ""
        pageRef.current.style.zIndex = ""
        pageRef.current.style.opacity = ""
        pageRef.current.style.cursor = ""

        document.removeEventListener("mousemove", handleMouseMove)
        document.removeEventListener("mouseup", handleMouseUp)

        await Promise.all( correctingPagesOrder.map(correctedPageInstance => upsertFunnelPage(props.subaccountId, correctedPageInstance, props.funnnelId)) )
    }


    const handleMouseMove = (e: MouseEvent) => {
        e.preventDefault();

        if(!pageRef.current) return;
        
        pageRef.current.style.position = "absolute"
        pageRef.current.style.top = (e.clientY - coffY.current).toString() + "px"
        pageRef.current.style.position = (e.clientX - coffX.current).toString() + "px"
        pageRef.current.style.zIndex = "1000"
        pageRef.current.style.opacity = "1"
        pageRef.current.style.cursor = "grabbing"
        pageRef.current.style.width = "100%"
    }


    const clearTimeInterval = () => {
        if(!dragEnoughTime.current) return
        clearTimeout(dragEnoughTime.current)
        dragEnoughTime.current = null
    }

    const handleMouseDown = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if(!pageRef.current) return

        coffX.current = e.clientX - Number(pageRef.current.offsetTop)
        coffY.current = e.clientY - Number(pageRef.current.offsetTop)

        dragEnoughTime.current = setTimeout(() => {
            document.addEventListener("mousemove", handleMouseMove)
            document.addEventListener("mouseup", handleMouseUp)
        }, 250)

        document.addEventListener("mouseup", clearTimeInterval)
    }


  return (
    <div ref={pageRef} className='flex w-full items-center rounded-md h-16 border-2 border-slate-800 my-3 relative cursor-grab' onMouseDown={handleMouseDown}>
        <div className='relative h-full w-14 flex items-center justify-center bg-slate-800'>
            <Mail/>
            <ArrowDown size={18} className='absolute -bottom-2 text-primary'/>
        </div>

        <div className='bg-slate-950/50 h-full flex items-center flex-1 pl-3'>
            {props.page.name}
        </div>

        {props.activePage && <div className='absolute p-1 rounded-full bg-emerald-600 top-4 right-4'></div>}
    </div>
  )
}

export default PageDraggable