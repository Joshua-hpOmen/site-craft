import { EditorBtns } from '@/lib/constants'
import { EditorElement, useEditor } from '@/providers/editor/editor-provider'
import clsx from 'clsx'
import { ChevronDown, Contact2Icon, ImageIcon, Link2Icon, TypeIcon, Youtube } from 'lucide-react'
import Image from 'next/image'
import React from 'react'
import RecursiveLayoutTree from './_components/RecursiveLayoutTree'

type Props = {}

const Layout = (props: Props) => {
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