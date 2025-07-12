"use client"
import { GeneralNavBarConxtext } from '@/providers/nav-bar'
import React from 'react'

type Props = {}

const CloseSidebar = (props: Props) => {
  const {isVisibleForEditor, setCloseEditor} = React.useContext(GeneralNavBarConxtext)
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true)
    if(isVisibleForEditor) setCloseEditor()
  }, [])

  if(!mounted) return

  return (
    isVisibleForEditor && <div className='fixed inset-0 z-10 bg-black/30' onClick={setCloseEditor}></div>
  )
}

export default CloseSidebar