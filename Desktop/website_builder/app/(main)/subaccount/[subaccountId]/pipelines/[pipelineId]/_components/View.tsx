"use client"
import CustomModal from '@/components/forms/CustomModal'
import LaneForm from '@/components/forms/LaneForm'
import { getLanes } from '@/lib/queries'
import { useModal } from '@/providers/modal-provider'
import { Pipeline } from '@prisma/client'
import { CirclePlusIcon } from 'lucide-react'
import React from 'react'
import LaneComponent from './Lane'
import { LaneDetail } from '@/lib/constants'

type Props = {
  pipelineCurrent: Pipeline
}

const View = (props: Props) => {
  const {setOpen} = useModal()
  const [lanes, setLanes] = React.useState<LaneDetail[]>([])
  const gridRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const fetchLanes= async () => {
      const lanes = await getLanes(props.pipelineCurrent.id)
      setLanes(lanes)
    }

    fetchLanes()
  }, [props.pipelineCurrent])

  const handleAddLane = async () => {
    setOpen(<CustomModal title='Create a Lane' subheading='Lanes allow you to ground tickets'>
      <LaneForm pipelineId={props.pipelineCurrent.id}/>
    </CustomModal>)
  }
  return (
    <div className='flex w-full flex-col'>
      <header className='flex justify-between items-center my-3 w-full'>
        <section className='font-bold text-xl'>{props.pipelineCurrent.name}</section>

        {/* Creating a new lane */}
        <section>
          <button className='flex gap-1 bg-blue-700 px-3 py-2 rounded-md items-center' onClick={() => handleAddLane()}>
            <CirclePlusIcon size={15}/>
            Add Lane
          </button>
        </section>
      </header>

      {/* Lane Section */}
      
      <div className={`min-h-[900px] bg-slate-900/80 min-w-full overflow-x-hidden flex flex-row hover:overflow-x-auto relative`} ref={gridRef}>
        {lanes.map((lane, index) => (
          <LaneComponent setLanes={setLanes} lanes={lanes} laneInfo={lane} key={index} pipelineId={props.pipelineCurrent.id} subaccountId={props.pipelineCurrent.subAccountId} parrent={gridRef}/>
        ))}
      </div>
    </div>
  )
}

export default View