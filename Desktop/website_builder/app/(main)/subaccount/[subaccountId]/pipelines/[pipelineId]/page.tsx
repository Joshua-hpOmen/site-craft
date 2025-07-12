import { LaneDetail } from '@/lib/constants'
import { db } from '@/lib/db'
import { getLanesWithTicketAndTags, getPipelineDetails } from '@/lib/queries'
import { redirect } from 'next/navigation'
import React from 'react'
import PipelinePage from './_components/PipelinePage'

type Props = {
    params: Promise<{subaccountId: string, pipelineId: string}>
}

const page = async (props: Props) => {
    const params = await props.params
    const pipelineDetails = await getPipelineDetails(params.pipelineId)
    if(!pipelineDetails) return redirect(`/subaccount/${params.subaccountId}/pipelines`)

    const pipelines = await db.pipeline.findMany({where:  {subAccountId: params.subaccountId}})
    const lanes = (await getLanesWithTicketAndTags(params.pipelineId)) as LaneDetail[]
    const currentPipeline = await db.pipeline.findUnique({where: {id: params.pipelineId}})

  return <PipelinePage pipelines={pipelines} lanes={lanes} currentPipeline={currentPipeline} subaccountId={params.subaccountId}/>
}

export default page