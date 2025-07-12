import { LaneDetail } from '@/lib/constants'
import { db } from '@/lib/db'
import { getLanesWithTicketAndTags, getPipelineDetails } from '@/lib/queries'
import { redirect } from 'next/navigation'
import React from 'react'
import PipelinePage from './_components/PipelinePage'

type Props = {
    params: {subaccountId: string, pipelineId: string}
}

const page = async (props: Props) => {
    const pipelineDetails = await getPipelineDetails(props.params.pipelineId)
    if(!pipelineDetails) return redirect(`/subaccount/${props.params.subaccountId}/pipelines`)

    const pipelines = await db.pipeline.findMany({where:  {subAccountId: props.params.subaccountId}})
    const lanes = (await getLanesWithTicketAndTags(props.params.pipelineId)) as LaneDetail[]
    const currentPipeline = await db.pipeline.findUnique({where: {id: props.params.pipelineId}})

  return <PipelinePage pipelines={pipelines} lanes={lanes} currentPipeline={currentPipeline} subaccountId={props.params.subaccountId}/>
}

export default page