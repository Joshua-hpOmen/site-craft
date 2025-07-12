import { db } from '@/lib/db'
import { redirect } from 'next/navigation'
import React from 'react'

type Props = {
    params: Promise<{ subaccountId: string }>
}

const page = async (props: Props) => {
    const params = await props.params
    if(!params.subaccountId) return redirect("/unauthorised")

    const pipelineExist = await db.pipeline.findFirst({where: {subAccountId: params.subaccountId}})

    if(pipelineExist) return redirect(`/subaccount/${params.subaccountId}/pipelines/${pipelineExist.id}`)

    try {
        const response  = await db.pipeline.create({
            data: {name : "First pipeline", subAccountId: params.subaccountId}
        })
        return redirect(`/subaccount/${params.subaccountId}/pipelines/${response.id}`)
    } catch {
        console.log("🔴Error, this occured in pipeline: page.tsx")
    }
  return (
    <div>page</div>
  )
}

export default page