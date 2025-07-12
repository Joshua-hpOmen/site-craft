"use client"
import React from 'react'

type Props = {
  code: string
}

const PreviewComponent = (props: Props) => {
  const previewRef = React.useRef<HTMLIFrameElement>(null)

  React.useEffect(() => {
    if(!previewRef.current) return
    const doc = previewRef.current.contentDocument
    if(!doc) return

    doc.open()
    doc.write(props.code)
    doc.close()
  }, [props.code])
  return (
    <iframe ref={previewRef} title='Preview' className='w-full'/>
  )
}

export default PreviewComponent