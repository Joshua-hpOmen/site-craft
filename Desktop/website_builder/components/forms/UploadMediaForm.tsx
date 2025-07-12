"use client"
import { useToast } from '@/hooks/use-toast'
import { createMedia, saveActLogNotification } from '@/lib/queries'
import { zodResolver } from '@hookform/resolvers/zod'
import clsx from 'clsx'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import * as z from 'zod'
import FileUpload from '../global/file-upload'
import Image from 'next/image'
type Props = {
    subaccountId: string
}

const formSchema = z.object({
    link: z.string().min(1, {message: "Required"}),
    name: z.string().min(1,{message: "Required"})
})

const UploadMediaForm = (props: Props) => {
    const {toast} = useToast();

    const handleOnSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const response = await createMedia(props.subaccountId, values)
            await saveActLogNotification({agencyId: undefined, description: `Uploaded a media file | ${response.name}`, subAccountId: props.subaccountId})
            window.location.reload()
        } catch (error) {
            toast({
                title: "Oops!",
                description: "Failed to upload media file",
                variant: "destructive"
            })
        }
    }

    const form = useForm<z.infer<typeof formSchema>>({
        mode: "onBlur",
        reValidateMode: "onSubmit",
        resolver: zodResolver(formSchema),
        defaultValues: {
            link: "",
            name: ""
        }
    })

    return (
        <div className='flex flex-col gap-4 border-t-2 border-t-slate-800 px-16 py-3 rounded-md mb-4'>
            <div className='flex flex-col items-center'>
                <span className='text-2xl'>Media information</span>
                <span className='text-sm text-muted-foreground'>Please enter the details for your file</span>
            </div>

            <form onSubmit={form.handleSubmit(handleOnSubmit)} className='flex flex-col gap-5'>

                <div className='flex flex-col gap-5'>
                  <label htmlFor="name" className={clsx('font-semibold text-lg mr-6', {'!text-red-700': form.formState.errors.name})}>Media Name: </label>
                  <input {...form.register("name")} id='name' type="text" className="bg-black border-2 rounded-md py-4 pl-2 pr-10 focus-visible:outline-none focus-visible:border-4" placeholder='Logo' disabled={form.formState.isLoading || form.formState.isSubmitting}/>
                  {form.formState.errors.name && <span className='text-sm text-red-600'>{form.formState.errors.name.message}</span>}
                </div>
                
                <div>
                    <label htmlFor="link" className={clsx({"text-red-700": form.formState.errors.link})}>Media Image: </label>
                    <Controller control={form.control} name='link' render={({field}) => (
                        <div>
                            <FileUpload value={field.value} onChange={field.onChange} apiEndpoint="media"/>
                        </div>
                    )}/>
                    {form.formState.errors.link && <span className='text-sm text-red-600'>{form.formState.errors.link.message}</span>}
                </div>

                {!form.formState.isSubmitting ? <button type="submit" className='bg-blue-700 px-5 py-2 rounded-md'>Submit</button>: <div className='bg-blue-600 py-4 px-8 rounded-sm justify-center items-center flex flex-row gap-2 w-[70%] lg:w-[50%]'>
                        <Image className='spiiningLoadingAgencyDetails' width={30} height={30} alt='Loading Image' src="/assets/spinner-solid-svgrepo-com.svg"/> <span className='text-xl'>Saving...</span>
                    </div>
                }
            </form>
        </div>
    )
}

export default UploadMediaForm