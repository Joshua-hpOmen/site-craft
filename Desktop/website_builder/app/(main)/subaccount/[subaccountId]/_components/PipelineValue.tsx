"use client"
import { Progress } from '@/components/ui/progress'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import { getPipelines } from '@/lib/queries'
import { Prisma } from '@prisma/client'
import React from 'react'

type Props = {
    subaccountId: string
}

const PipelineValue = (props: Props) => {
    const [pipelines, setPipelines] = React.useState<Prisma.PromiseReturnType<typeof getPipelines>>([])
    const [selectedPipelineId, setSelectedPipelinID] = React.useState("")
    const [pipelineClosedValue, setPipelineClosedValue] = React.useState(0)

    React.useEffect(() => {
        const fetchData = async () => {
            const response = await getPipelines(props.subaccountId);
            setPipelines(response)
            setSelectedPipelinID(response[0].id)
        }

        fetchData()
    }, [props.subaccountId])

    const totalPipelineValue = React.useMemo(() => {

        const selectePipelineDetails = pipelines.find(pipe => pipe.id === selectedPipelineId)
        if(!selectePipelineDetails) return

        const totalForSelectedPipeline = selectePipelineDetails.Lane.map(
                lane => lane.Tickets.reduce((acuMvale,tick) => acuMvale + Number(tick.value || 0), 0)
                
        ).reduce((accVal, lan) => accVal + lan ,0)

        setPipelineClosedValue(totalForSelectedPipeline)
        return totalForSelectedPipeline

    }, [pipelines, selectedPipelineId])


    const pipeLineRate = React.useMemo(() => {
        const selectePipelineDetails = pipelines.find(pipe => pipe.id === selectedPipelineId)
        if(!selectePipelineDetails) return 0;

        return ((pipelineClosedValue + 5000) / pipelineClosedValue) * 100

    }, [pipelineClosedValue])

  return (
    <div className='flex gap-3 flex-col'>
        <h1>Pipeline value</h1>
        <small>Pipeline Progress</small>

        <div>
            <div className='flex justify-between text-muted-foreground'><span>Closed ${pipelineClosedValue}</span> <span>Total ${pipelineClosedValue + 5000}</span></div>
            <Progress value={pipeLineRate} className='h-2' color='green'/>
        </div>

        <div className='text-muted-foreground text-sm'>
            Total value of all tickets in the given pipeline except the last lane. Your last lane is considered your closing lane in every pipeline
        </div>

        <Select value={selectedPipelineId} onValueChange={setSelectedPipelinID}>

          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select a pipeline" />
          </SelectTrigger>

          <SelectContent>
            <SelectGroup>
              <SelectLabel>Pipelines</SelectLabel>

                {pipelines.map((pipeline) => (
                    <SelectItem value={pipeline.id} key={pipeline.id} >
                        {pipeline.name}
                    </SelectItem>
                ))}

            </SelectGroup>
          </SelectContent>

        </Select>

    </div>
  )
}

export default PipelineValue