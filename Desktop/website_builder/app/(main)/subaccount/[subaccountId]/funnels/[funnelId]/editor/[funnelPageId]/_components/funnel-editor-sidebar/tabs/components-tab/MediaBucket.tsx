"use client"
import MediaComponent from '@/components/global/media/MediaComponent'
import { getMedia } from '@/lib/queries'
import { Media } from '@prisma/client'
import React from 'react'

type Props = {
  subaccountId: string
}

const MediaBucket = (props: Props) => {
  const [mediaData, setMediaData] = React.useState<Media[]>([])
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {

    const fetchData = async () => {
      const response  = await getMedia(props.subaccountId)
      setMediaData(response)
      console.log("Hello")
      setMounted(true)
    }

    fetchData()
  }, [props.subaccountId])

  if(!mounted) return

  console.log(mediaData)

  return (
    <div>
      <MediaComponent data={mediaData} subaccountId={props.subaccountId} />
    </div>
  )
}

export default MediaBucket