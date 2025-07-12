import { getDomainContent } from '@/lib/queries'
import EditorProvider from '@/providers/editor/editor-provider'
import { notFound } from 'next/navigation'
import React from 'react'
import FunnelEditor from '../../(main)/subaccount/[subaccountId]/funnels/[funnelId]/editor/[funnelPageId]/_components/funnel-editor'
import { db } from '@/lib/db'

type Props = {
  params: Promise<{ domain : string, path: string }>
}

const page = async (props: Props) => {
  const params = await props.params
  const domainData = await getDomainContent(params.domain.slice(0, -1))
  if(!domainData) return notFound()

  const currentFunnelPage = domainData.FunnelPages.find(page => page.pathName === params.path)
  if(!currentFunnelPage) return notFound()

  await db.funnelPage.update({
    where: {id: currentFunnelPage.id},
    data: {
      visits: {increment: 1}
    }
  })
  
  return (
      <EditorProvider subaccountId={domainData.subAccountId} funnelId={domainData.id} pageDetails={currentFunnelPage}>
        <FunnelEditor funnelPageId={currentFunnelPage.id} liveMode={true}/>
      </EditorProvider>
  )
}

export default page