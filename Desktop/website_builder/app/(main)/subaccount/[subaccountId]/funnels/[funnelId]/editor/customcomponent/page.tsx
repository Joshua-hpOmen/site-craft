import React from 'react'
import CloseSidebar from './_components/CloseSidebar'
import ComponentButton from './_components/ComponentButton'
import ComponentProvider from '@/providers/code-editor-provider'
import EditorComponent from './_components/EditorComponent'
type Props = {
  params : { subaccountId: string, funnelId: string }
}

const page = (props: Props) => {

  return (
    <ComponentProvider>
      <div className='fixed inset-0 px-2 py-3 mt-[85px] h-full'>
          <CloseSidebar/>

          <header className='flex justify-between items-center'>
              <span className='text-3xl font-semibold'>Editor</span>
              <ComponentButton subaccountId={props.params.subaccountId}/>
          </header>

          <br />

          <main className="h-[80%]">
            <EditorComponent/>
          </main>

      </div>
    </ComponentProvider>
  )
}

export default page