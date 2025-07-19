import { Media } from '@prisma/client'
import { Copy, MoreHorizontal, Trash } from 'lucide-react'
import Image from 'next/image'
import React from 'react'
import dayjs from "dayjs"
import { useToast } from '@/hooks/use-toast'
import { deleteMedia, saveActLogNotification } from '@/lib/queries'

type Props = {
    media: Media,
    index: number,
    subAccountId: string
}

const MediaCard = (props: Props) => {
    const [showModal, setShowModal] = React.useState(false)
    const {toast} = useToast()
    const [deletingModal, setDeleteModal] = React.useState(false);
    const handleDelete = async () => {
        try{
            const response = await deleteMedia(props.media.id);
            await saveActLogNotification({agencyId: undefined, description:`Deleted a media file | ${response.name}`, subAccountId: response.subAccountId})
            toast({
                title: "Success",
                description: "Deleted media file"
            })
            window.location.reload()
        }catch(err){
            toast({
                title: "Oops!",
                description: "Failed to delete media",
                variant: "destructive"
            })
        }
    }
  return (
    <div className='w-[320px] h-[280px] flex flex-col justify-between bg-slate-900 px-5 py-4 rounded-sm' key={props.index}>
        <div className='relative rounded-md mb-2'>
            <Image
                src={props.media.link}
                alt='Media Image'
                width={230}
                height={200}
                className='rounded-md !w-[230px] !h-[200px]'
            />
        </div>
        <div className='flex flex-row justify-between'>
            <div>
                <div className='text-muted-foreground text-sm font-semibold'>
                    {`${dayjs(props.media.createdAt).format("ddd MMM DD YYYY")}`}
                </div>
                <div>
                    {props.media.name}
                </div>
            </div>
            <div className='relative'>
                <MoreHorizontal onClick={() => setShowModal(true)}/>

                {showModal && <>
                    <div className='fixed top-0 bottom-0 right-0 left-0' onClick={() => setShowModal(false)}></div>
                    <div className='w-[180px] bg-slate-900 rounded-md px-4 py-3 absolute right-3 top-2 flex flex-col gap-3' onClick={e => e.stopPropagation()}>
                        <div>Actions</div>
                        <div className='flex flex-row gap-1 cursor-pointer' onClick={() => {navigator.clipboard.writeText(props.media.link); toast({title: "Copied link to clipboard"}) }}>
                            <Copy/> Copy image link
                        </div>
                        <div className='flex flex-row gap-1 relative cursor-pointer' onClick={() => {setDeleteModal(true)}}>
                            <Trash/> Delete

                            {deletingModal && <>
                                <div className='fixed z-10 inset-0 bg-slate-900/50' onClick={(e) => {e.stopPropagation();setDeleteModal(false)}}></div>
                                <div className='fixed z-40 top-auto left-[10%] lg:left-[30%] max-w-[800px]'>
                                        <div className='border-2 border-destructive p-4 bg-slate-900 w-[90%] lg:w-[70%]'>
                                            <div>
                                            <div className='text-2xl'>Danger Zone!!</div>
                                            </div>

                                            <div className='text-gray-600'>
                                                Deleting your agency cannot be undone! This will also delete all sub accounts and all data related to those respective subaccount. Sub accounts will also no longer have access to funnels, contacts, etc.
                                            </div>

                                            <div className='w-[100%] flex justify-center items-center flex-row gap-5'>
                                            <button onClick={(e) => {e.stopPropagation();handleDelete()}} className='px-8 py-4 rounded-md bg-red-700 my-5'>
                                                Delete Anyway
                                            </button>
                                            <button onClick={(e) => {e.stopPropagation();setDeleteModal(false)}} className='px-8 py-4 rounded-md bg-blue-600 my-5'>
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </>}
                        </div>
                    </div>
                </>}
            </div>
        </div>
    </div>
  )
}

export default MediaCard