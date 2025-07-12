import CustomModal from '@/components/forms/CustomModal'
import TicketForm from '@/components/forms/TicketForm'
import { toast } from '@/hooks/use-toast'
import { LaneDetail, TicketAndTags } from '@/lib/constants'
import { deleteTicket, upsertTicket } from '@/lib/queries'
import { useModal } from '@/providers/modal-provider'
import { Lane } from '@prisma/client'
import dayjs from 'dayjs'
import { Contact2, Edit, Link2, MoreHorizontalIcon, Trash, User2Icon } from 'lucide-react'
import Image from 'next/image'
import React from 'react'

type Props = {
    tick: TicketAndTags,
    parrent: React.RefObject<HTMLDivElement | null>,
    lanes: LaneDetail[],
    subaccountId: string,
    setLanes: (lan: LaneDetail[]) => void
}

const TicketComponent = ({tick, parrent, lanes, setLanes, subaccountId}: Props) => {
    const [showContact, setShowContact] = React.useState(false)
    const [showOptions, setShowOption] = React.useState(false)
    const ticketRef = React.useRef<HTMLDivElement>(null)
    const dragTime = React.useRef<ReturnType<typeof setTimeout>>(null)
    const coffX = React.useRef(0)
    const coffY = React.useRef(0)
    const {setOpen} = useModal()

    const handleMouseMove = (e: MouseEvent) => {
        e.preventDefault();
        e.stopImmediatePropagation()
        console.log("hello")
        try {
            if(!ticketRef.current) return
            ticketRef.current.style.position = "absolute"
            ticketRef.current.style.top = (e.clientY - coffY.current).toString() + 'px';
            ticketRef.current.style.left = (e.clientX - coffX.current).toString() + 'px'
            ticketRef.current.style.opacity = "1"
            ticketRef.current.style.cursor = "grabbing"
        } catch (error) {
            if(!ticketRef.current)return
            ticketRef.current.style.position = "";
            ticketRef.current.style.top = "";
            ticketRef.current.style.left = "";
            ticketRef.current.style.zIndex = "";
            ticketRef.current.style.opacity = "";
            ticketRef.current.style.cursor = "pointer"
            document.removeEventListener("mousemove", handleMouseMove)
            document.removeEventListener("mouseup", handleMouseUp)
            return
        }
    }

    const handleMouseUp = async (e: MouseEvent) => {
        e.preventDefault();
        e.stopImmediatePropagation()

        try {
            if(!ticketRef.current) return
            const ticketRight = Number(ticketRef.current.getBoundingClientRect().right) - Number(parrent.current?.getBoundingClientRect().left)

            const numberOfOverlapping = Math.floor((ticketRight/330));
            const lanesCurrent = [...lanes]
            const currentLane = lanesCurrent.find(lanFind => lanFind.id === tick.laneId);
            
            if(!!currentLane){
                try {
                    
                    let ticketIndex;
                currentLane.Tickets.forEach((ti, index) => {
                    if(ti.id === tick.id){
                        ticketIndex = index
                    }
                }) 
                if(typeof(ticketIndex) === "undefined") throw new Error("")
                currentLane.Tickets.splice(ticketIndex, 1)
                } catch (error) {
                    ticketRef.current.style.position = "";
                    ticketRef.current.style.top = "";
                    ticketRef.current.style.left = "";
                    ticketRef.current.style.zIndex = "";
                    ticketRef.current.style.opacity = "";
                    ticketRef.current.style.cursor = "pointer"
                    toast({title: "Oops", description: "Couldnt change ticket", variant: "destructive"})
                    document.removeEventListener("mousemove", handleMouseMove)
                    document.removeEventListener("mouseup", handleMouseUp)

                    return
                }
            }
            lanesCurrent[numberOfOverlapping].Tickets.push({...tick, laneId: lanesCurrent[numberOfOverlapping].id})

            await upsertTicket({name: tick.name, laneId: lanesCurrent[numberOfOverlapping].id, id: tick.id}, tick.Tags)

            setLanes(lanesCurrent)

            ticketRef.current.style.position = "";
            ticketRef.current.style.top = "";
            ticketRef.current.style.left = "";
            ticketRef.current.style.zIndex = "";
            ticketRef.current.style.opacity = "";
            ticketRef.current.style.cursor = "pointer"

            document.removeEventListener("mousemove", handleMouseMove)
            document.removeEventListener("mouseup", handleMouseUp)

        } catch (error) {
            if(!ticketRef.current) return null
            ticketRef.current.style.position = "";
            ticketRef.current.style.top = "";
            ticketRef.current.style.left = "";
            ticketRef.current.style.zIndex = "";
            ticketRef.current.style.opacity = "";
            ticketRef.current.style.cursor = "pointer"
            toast({title: "Oops", description: "Couldnt change ticket", variant: "destructive"})
            document.removeEventListener("mousemove", handleMouseMove)
            document.removeEventListener("mouseup", handleMouseUp)
            return
        }
    }

    const handleMouseDown = (e: React.MouseEvent) =>{
        if(!ticketRef.current) return
        coffX.current = e.clientX - Number(ticketRef.current.offsetLeft);
        coffY.current = e.clientY - Number(ticketRef.current.offsetTop);

        dragTime.current = setTimeout(() => {
            document.addEventListener("mousemove", handleMouseMove)
            document.addEventListener("mouseup", handleMouseUp)
        }, 150)

        window.addEventListener("mouseup", () => {
            if(!dragTime.current) return
            clearTimeout(dragTime.current)
            dragTime.current = null;
        })
        
    }
    

  return (
    <div className='w-[300px] bg-slate-950/50 z-10 p-3 rounded-md' ref={ticketRef} onMouseDown={(e) => {e.stopPropagation();e.preventDefault(); handleMouseDown(e)}}>
        <header className='flex justify-between items-center'>
            <div>
                <div className='text-lg font-semibold'>{tick.name}</div>
                <div className='text-[12px] text-muted-foreground'>{dayjs(tick.createdAt).format("D MMM YYYY")}</div>
            </div>

            <div className='relative'>
                <MoreHorizontalIcon size={20} onClick={() => setShowOption(prev => !prev)}/>
                
                {showOptions && (
                    <>
                        <div className='fixed inset-0 z-10' onClick={(e) => {e.preventDefault(); e.stopPropagation(); setShowOption(false)}}></div>
                        <div className='absolute bg-slate-900 pl-2 right-0 rounded-md py-1 pr-8 z-30 flex flex-col gap-2'>
                            <h1 className='font-semibold border-b-2 border-b-slate-600/30'>Actions</h1>
                            <div className='flex items-center gap-1'  onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault()
                                setShowOption(false)
                                setOpen(<CustomModal title='Edit your ticket' subheading='Edit your tickets straight from this form'>
                                    <TicketForm laneId={tick.laneId} subaccountId={subaccountId} defaultData={tick}/>
                                </CustomModal>)
                            }}><Edit size={17}/> Edit</div>
                            <div className='flex gap-1 items-center' onClick={async (e) => {
                                e.stopPropagation();
                                e.preventDefault()
                                try {
                                    const response = await deleteTicket(tick.id)
                                    toast({
                                        title: "Success",
                                        description: "Deleted ticket"
                                    })
                                    window.location.reload()
                                } catch (error) {
                                    toast({
                                        title: "Oops",
                                        description: "Could not deleted ticket",
                                        variant: "destructive"
                                    })
                                }
                            }}><Trash size={17}/> Trash</div>
                        </div>
                    </>
                )}
            </div>
        </header>

        <section className='flex gap-2 mt-3 flex-wrap'>
            {tick.Tags.map((tagTick, index) => (
                <div key={index} className={`text-${tagTick.color.split("bg-")[1]} ${tagTick.color} bg-opacity-10 px-3 py-1 rounded-md`}>
                    {tagTick.name}
                </div>
            ))}
        </section>

        <section className='text-muted-foreground text-sm mt-2'>
            {tick.description}
        </section>

        <section className='flex items-center gap-2 my-3 relative' onMouseEnter={() => setShowContact(true)} onMouseLeave={() => setShowContact(false)}>
            <Link2 size={20}/>
            contact

            {showContact && <div className='absolute bg-slate-900 flex gap-2 p-3 pr-8 rounded-md top-5 flex-col z-50'> 
                <div className='flex items-center gap-3 pb-2 '>
                    <User2Icon className="rounded-full px-2 bg-blue-700 self-start" size={40}/>
                    <div className='flex flex-col gap-3'>
                        <div className='flex flex-col border-b-2 border-b-slate-700 pb-3'>
                            <span>{tick.Customer?.name || "No customer set"}</span>  
                            {tick.Customer && <span className='text-muted-foreground text-sm'>{tick.Customer.email}</span> }
                        </div>
                        {tick.Customer && <div className='flex justify-center text-muted-foreground items-center gap-2 text-sm'>
                            <Contact2 className='text-muted-foreground'/>
                            <span>Joined {dayjs(tick.Customer.createdAt).format("D MMM YYYY")}</span>
                        </div>}
                    </div>
                </div>
                
            </div>}
        </section>

        <section className='flex justify-between items-center pt border-t-2 border-t-slate-400/15'>

            <div className='flex items-center gap-2 mt-2'>
                <div>
                    {tick.Assigned ? <Image src={tick.Assigned.avatarUrl} alt="User avatart" width={40} height={40} className='rounded-full'/> : <User2Icon className="rounded-full px-2 bg-blue-700" size={30}/>}
                    
                </div>
                <div className='flex flex-col'>
                    <span className='text-sm text-muted-foreground'>Assinged to</span>
                    <span className='text-muted-foreground text-[12px]'>{tick.Assigned?.name || "No assignment"}</span>
                </div>
            </div>

            <div className='text-sm font-semibold'>${Number(tick.value).toFixed(2)}</div>

        </section>

    </div>
  )
}

export default TicketComponent