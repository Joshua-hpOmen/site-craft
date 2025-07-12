import { db } from '@/lib/db'
import { redirect } from 'next/navigation'
import React from 'react'

type Props = {
    params: { subaccountId: string }
}

const page = async (props: Props) => {
    if(!props.params.subaccountId) return redirect("/unauthorised")

    const pipelineExist = await db.pipeline.findFirst({where: {subAccountId: props.params.subaccountId}})

    if(pipelineExist) return redirect(`/subaccount/${props.params.subaccountId}/pipelines/${pipelineExist.id}`)

    try {
        const response  = await db.pipeline.create({
            data: {name : "First pipeline", subAccountId: props.params.subaccountId}
        })
        return redirect(`/subaccount/${props.params.subaccountId}/pipelines/${response.id}`)
    } catch (error) {
        console.log("🔴Error, this occured in pipeline: page.tsx")
    }
  return (
    <div>page</div>
  )
}

export default page