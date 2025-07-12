import CustomModal from '@/components/forms/CustomModal'
import LaneForm from '@/components/forms/LaneForm'
import TicketForm from '@/components/forms/TicketForm'
import { LaneDetail, TicketAndTags } from '@/lib/constants'
import { deleteLane, getPipelineCount, getTicketsAndTags, upsertLane } from '@/lib/queries'
import { useModal } from '@/providers/modal-provider'
import { Lane } from '@prisma/client'
import { EditIcon, MoreVerticalIcon, PlusCircle, TrashIcon } from 'lucide-react'
import React from 'react'
import TicketComponent from './Ticket'

type Props = {
    laneInfo: LaneDetail,
    pipelineId: string,
    subaccountId: string,
    parrent: React.RefObject<HTMLDivElement | null>,
    lanes: LaneDetail[],
    setLanes : (laneArr: LaneDetail[]) => void,
}

const LaneComponent = (props: Props) => {
  const lane = React.useRef<HTMLDivElement>(null)
  const [color, setColor] = React.useState<{red: number, green: number, blue: number}>()
  const [mounted, setMounted] = React.useState(false)
  const [modal, setModal] = React.useState(false)
  const {setOpen} = useModal()
  let coffX  = React.useRef(0);
  let coffY  = React.useRef(0);
  const dragEnoughTime = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const total =  props.laneInfo.Tickets.map(ticket => ticket.value).reduce((acc, current) => acc + Number(current), 0)

  React.useEffect(() => {
    const setRandomColor = () => {
      let randomColor = {red: Math.random()*256, green: Math.random()*256, blue: Math.random()*256}
      setColor(randomColor)
    }

    setRandomColor()
  }, [])

  if(!mounted) return

  const dragMove = (e: MouseEvent) => {
    e.preventDefault();

    if(!lane.current) return
    lane.current.style.position = "absolute"
    lane.current.style.top = (e.clientY - coffY.current).toString() + 'px';
    lane.current.style.left = (e.clientX - coffX.current).toString() + 'px'
    lane.current.style.zIndex = "1000"
    lane.current.style.opacity = "1"
    lane.current.style.cursor = "grabbing"
  }

  const dragEnd = async (e: MouseEvent) => {
    e.preventDefault();
    if(!lane.current) return
    const laneWithoutDragged = [...props.lanes].filter(laneFilter => laneFilter.id !== props.laneInfo.id )
    const laneFixedWidth = 330

    /* Get the position of the draggable relative to the parent */
    const laneRight = Number(lane.current?.getBoundingClientRect().right) - Number(props.parrent.current?.getBoundingClientRect().left)

    //Calculate the amount of divs lanes its overlapping relative to the right side of the dragable
    //@ts-ignore
    const numberOfOverlapping = Math.floor((laneRight / laneFixedWidth))

    laneWithoutDragged.splice(numberOfOverlapping, 0, props.laneInfo);
    for(let i=0; i< laneWithoutDragged.length ; i++ ){
      laneWithoutDragged[i].order = i +1;
    }

    lane.current.style.position = "";
    lane.current.style.top = "";
    lane.current.style.left = "";
    lane.current.style.zIndex = "";
    lane.current.style.opacity = "";
    lane.current.style.cursor = "pointer"
    props.setLanes(laneWithoutDragged)
    
    document.removeEventListener("mousemove", dragMove)
    document.removeEventListener("mouseup", dragEnd)
    
    await Promise.all(
      laneWithoutDragged.map((laneForeachTransform, index) => upsertLane({id: laneForeachTransform.id, pipelineId: props.pipelineId, values: {name: laneForeachTransform.name}, order: Number(index +1)}) )
    )
  }

  const clearTime = () => {
    if(!dragEnoughTime.current) return
    clearTimeout(dragEnoughTime.current)
    dragEnoughTime.current = null
  }

  const dragStart = (e: React.MouseEvent) => {
    e.preventDefault();
    if(!lane.current) return
    coffX.current = e.clientX - Number(lane.current.offsetLeft)
    coffY.current = e.clientY - Number(lane.current.offsetTop)

    dragEnoughTime.current = setTimeout(() => {
      document.addEventListener("mouseup", dragEnd)
      document.addEventListener("mousemove", dragMove)
    }, 150)

    document.addEventListener("mouseup", clearTime)
  }

  return (
    <div ref={lane} className='min-w-[330px] bg-transparent p-6 z-10 min-h-full' onMouseDown={dragStart}>

      <header className='flex justify-between border-b-2 border-b-slate-500/20 pb-2 gap-3'>
        <div className='flex gap-2 items-center'>
          <div className="p-2 rounded-full" style={{background: `rgb(${color?.red}, ${color?.green}, ${color?.blue})`}}></div>
          <div className='font-semibold text-lg'>{props.laneInfo.name}</div>
        </div>

        <div className='flex gap-2 items-center'>
          <div className='bg-white px-4 rounded-full text-black font-semibold'>
            ${total.toFixed(2)}
          </div>
          <div className='relative'>
            <MoreVerticalIcon size={15} onClick={(e) => {e.preventDefault(); e.stopPropagation(); setModal(true)}}/>

            {modal && <>
              <div className='flex inset-0 z-10 fixed' onClick={(e) => {e.preventDefault(); e.stopPropagation(); setModal(false)}}></div>
              <div className='bg-slate-950 rounded-md flex flex-col gap-5 absolute -top-0 right-4 p-5 z-20 !pr-10'>
                <div className='border-b-slate-500/30 border-b-2'>Actions</div>  
                <div className='flex gap-2 cursor-pointer' onClick={async () => {
                    setModal(false);
                    setOpen(<CustomModal title="Edit lane" subheading="Edit your lanes details right in this form">
                      <LaneForm pipelineId={props.pipelineId} defaultData={props.laneInfo}/>
                    </CustomModal>)
                  }}><EditIcon/>Edit</div>  
                <div className='flex gap-2 cursor-pointer items-center' onClick={async () => {
                  setModal(false)
                  setOpen(<CustomModal title={'Create a ticket'} subheading={'Tickets are a greate way to keep track of tasks'}>
                      <TicketForm laneId={props.laneInfo.id} subaccountId={props.subaccountId}/>
                  </CustomModal>)
                }}><PlusCircle/>Ticket</div>
                <div className='flex gap-2 cursor-pointer' onClick={async () => {
                    await deleteLane(props.laneInfo.id)
                    window.location.reload()
                  }}>
                  <TrashIcon/>Trash  
                </div> 
                
              </div>
            </>}

          </div>
        </div>
      </header>

      <main className='flex flex-col gap-3 my-3 relative'>
          {props.laneInfo.Tickets.map((tick, index) => (
            <TicketComponent lanes={props.lanes} setLanes={props.setLanes} tick={tick} key={index} parrent={props.parrent} subaccountId={props.subaccountId}/>
          ))}
      </main>
      
    </div>
  )
}

export default LaneComponent