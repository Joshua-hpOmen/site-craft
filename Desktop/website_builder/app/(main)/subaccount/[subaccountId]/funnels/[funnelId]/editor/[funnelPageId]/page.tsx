import { db } from '@/lib/db'
import { redirect } from 'next/navigation'
import React from 'react'
import EditorProvider from '@/providers/editor/editor-provider'
import FunnelEditorNavigation from './_components/FunnelEditorNavigation'
import FunnelEditorSidebar from "./_components/funnel-editor-sidebar"
import FunnelEditor from "./_components/funnel-editor"

type Props = {
  params : {subaccountId: string, funnelId:string, funnelPageId: string}
}

const page = async (props: Props) => {
  if(!props.params.subaccountId) return;

  const funnelPageDetails = await db.funnelPage.findUnique({where: {id : props.params.funnelPageId}})
  if(!funnelPageDetails) redirect(`subaccount/${props.params.subaccountId}/funnels/${props.params.funnelId}`)

  return (
   <div className='fixed inset-0 bg-background z-30 flex flex-col h-screen'>
      <EditorProvider subaccountId={props.params.subaccountId} funnelId={props.params.funnelId}  pageDetails={funnelPageDetails} >
        {/* Navigation - fixed height */}
        <FunnelEditorNavigation funnelId={props.params.funnelId} funnelPageDetails={funnelPageDetails} subaccountId={props.params.subaccountId} />

        <div className='flex flex-1 overflow-hidden'>
          <div className='flex-1 overflow-auto min-h-full flex justify-center'>
            <FunnelEditor funnelPageId={funnelPageDetails.id} />
          </div>

          <div className='border-l'>
            <FunnelEditorSidebar subaccountId={props.params.subaccountId} />
          </div>
        </div>

      </EditorProvider>
    </div>
  )
}

export default page