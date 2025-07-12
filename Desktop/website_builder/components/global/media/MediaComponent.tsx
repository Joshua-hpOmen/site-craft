"use client"
import MediaUploadButton from '@/components/global/media/MediaUploadButton'
import { Media } from '@prisma/client'
import { FolderSearch, MoreHorizontal, Search } from 'lucide-react'
import Image from 'next/image'
import React from 'react'
import MediaCard from './MediaCard'

type Props = {
  data: Media[],
  subaccountId: string
}

const MediaComponent = (props: Props) => {
  const [searchMedia, setSearchMedia] = React.useState("")
  const [mediaFilter, setMediaFileter] = React.useState(props.data)
  const handleMediaSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchMedia(e.target.value)
    setMediaFileter(props.data.filter((media) => (media.name.search(new RegExp(e.target.value, "i")) !== -1)))
  }

  return (
    <div className='w-full h-full'>
      <div className='flex flex-row justify-between items-center w-full'>
        <div className='text-4xl'>Media Files</div>
        <div><MediaUploadButton subaccountId={props.subaccountId}/></div>
      </div>

      <div className='w-[100%] flex justify-center relative my-5'>
        <Search className='absolute top-3 left-[2%] 2xl:left-[1%]' color='#4B5563' size={20}/>
        <input type="search" name="searchSideBarOptions" id="searchSideBarOptions" placeholder='Search Sidebar Options' className="pl-12 bg-slate-800 py-3 w-[100%] pr-2 rounded-md outline-none placeholder:text-gray-600 text-sm" value={searchMedia} onChange={(e) => handleMediaSearch(e)}/>
      </div>

      {(mediaFilter.length > 0) ? <div className='flex flex-wrap gap-3 items-center'>
        {mediaFilter.map((media, index) => <MediaCard media={media} index={index} subAccountId={props.subaccountId} key={index}/>)}
      </div> : <div className='w-full text-muted flex flex-col items-center'>
        <FolderSearch size={300}/>
        <span className='text-muted-foreground'>Empty! No files to show</span>
      </div>}

    </div>
  )
}

export default MediaComponent