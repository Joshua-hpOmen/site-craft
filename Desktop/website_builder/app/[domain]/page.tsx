import { db } from '@/lib/db'
import { getDomainContent } from '@/lib/queries'
import EditorProvider from '@/providers/editor/editor-provider'
import { notFound } from 'next/navigation'
import React from 'react'
import FunnelEditor from '../(main)/subaccount/[subaccountId]/funnels/[funnelId]/editor/[funnelPageId]/_components/funnel-editor'

type Props = {
  params : Promise<{ domain: string } >
}

const page = async (props: Props) => {
  const params = await props.params
  const domainData = await getDomainContent(params.domain.slice(0, -1));

  if(!domainData){
    return notFound() 
  }

  const pageData = domainData.FunnelPages.find(page => page.pathName.length === 0)

  if(!pageData) return notFound()

  await db.funnelPage.update({
    where: {id: pageData.id},
    data: {
      visits: {increment: 1}
    }
  })
  
  console.log(pageData)
  
  return (
      <EditorProvider subaccountId={domainData.subAccountId} funnelId={domainData.id} pageDetails={pageData}>
        <FunnelEditor funnelPageId={pageData.id} liveMode={true}/>
      </EditorProvider>
  )
}

export default page