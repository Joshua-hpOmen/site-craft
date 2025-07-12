"use client"
import { useEditor } from '@/providers/editor/editor-provider'
import { Database,Plus, SettingsIcon, SquareStackIcon } from 'lucide-react'
import React from 'react'
import Settings from './tabs/components-tab/Settings'
import MediaBucket from './tabs/components-tab/MediaBucket'
import Layout from './tabs/components-tab/Layout'
import clsx from 'clsx'
import useMobile from '@/hooks/useMobile'
import ComponentsSidebar from './tabs/components-tab/ComponentsSidebar'

type Props = {
  subaccountId: string
}

const index = (props: Props) => {
  const {state,  funnelId} = useEditor()
  const mobile = useMobile()
  const [selectedPage, setSelectedPage] = React.useState('settings')
  const [sidebarOpen, setSidebarOpen] = React.useState(true)
  return (
    !mobile && <div className={clsx('h-full max-h-full py-3 flex flex-row-reverse bg-background justify-start', {"hidden": state.editor.previewMode})}>

      <section className='flex flex-col h-full border-l-2 px-2 border-l-slate-900 gap-2 w-16'>
        
        <span className={clsx("cursor-pointer p-3 rounded-md", {"bg-slate-900": selectedPage === "settings"})} onClick={() => { 
          setSelectedPage("settings");
          if(selectedPage === "settings"){
            setSidebarOpen(prev => !prev) 
          }else {
            setSidebarOpen(true)
          }
        }}>
          <SettingsIcon size={24}/>
        </span>

        <span className={clsx("cursor-pointer p-3 rounded-md", {"bg-slate-900": selectedPage === "components"})} onClick={() => { 
          setSelectedPage("components");
          if(selectedPage === "components"){
            setSidebarOpen(prev => !prev) 
          }else {
            setSidebarOpen(true)
          }
        }}>
          <Plus size={24}/>
        </span>

        <span className={clsx("cursor-pointer p-3 rounded-md", {"bg-slate-900": selectedPage === "layers"})} onClick={() => { 
          setSelectedPage("layers");
          if(selectedPage === "layers"){
            setSidebarOpen(prev => !prev) 
          }else {
            setSidebarOpen(true)
          }
        }}>
          <SquareStackIcon size={24}/>
        </  span>

        <span className={clsx("cursor-pointer p-3 rounded-md", {"bg-slate-900": selectedPage === "media"})} onClick={() => { 
          setSelectedPage("media");
          if(selectedPage === "media"){
            setSidebarOpen(prev => !prev) 
          }else {
            setSidebarOpen(true)
          }
        }}>
          <Database size={24}/>
        </span>

      </section>

      {sidebarOpen && 
        <section className='min-w-80 w-80 border-l-2 border-l-slate-900 px-3 scrollable-element max-h-full scrollable-element duration-500 ease-in-out transition-all'>
          { 
            selectedPage === "" ? "" : selectedPage === "settings" ? <Settings/> : selectedPage === "components" ? <ComponentsSidebar subaccountId={props.subaccountId} funnelId={funnelId}/> :  selectedPage === "layers" ? <Layout/> : selectedPage === "media" &&  <MediaBucket subaccountId={props.subaccountId} />
          }
        </section>
      }

    </div>
  )
}

export default index