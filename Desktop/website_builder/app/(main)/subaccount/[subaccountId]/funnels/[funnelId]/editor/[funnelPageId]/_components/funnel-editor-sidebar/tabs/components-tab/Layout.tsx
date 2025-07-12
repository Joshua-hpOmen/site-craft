import { useEditor } from '@/providers/editor/editor-provider'
import React from 'react'
import RecursiveLayoutTree from './_components/RecursiveLayoutTree'


const Layout = () => {
  const {state} = useEditor();
  const [mounted, isMounted] = React.useState(false);

  React.useEffect(() => { isMounted(true) } , [])

  if(!mounted) return

  return (
    <div>
      <h1 className='text-xl font-semibold'>Layers</h1>

      <p className='text-muted-foreground'>View the eidtor in a tree like structure</p> 

      <br />

      {
        <RecursiveLayoutTree elements={state.editor.elements}/>
      }
    </div>
  )
}

export default Layout