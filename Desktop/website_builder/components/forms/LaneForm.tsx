import { toast } from '@/hooks/use-toast'
import { getPipelineDetails, saveActLogNotification, upsertLane } from '@/lib/queries'
import { zodResolver } from '@hookform/resolvers/zod'
import { Lane } from '@prisma/client'
import clsx from 'clsx'
import Image from 'next/image'
import React from 'react'
import { useForm } from 'react-hook-form'
import * as z from "zod"
type Props = {
    pipelineId: string,
    defaultData?:Lane
}

const formSchem = z.object({
    name: z.string().min(1, {message: "Required"})
})

const LaneForm = (props: Props) => {
    const form = useForm<z.infer<typeof formSchem>>({
        mode: "onBlur",
        reValidateMode: "onSubmit",
        resolver: zodResolver(formSchem),
        defaultValues: {
            name: props.defaultData?.name || ""
        }
    })

    const handleOnsubmit = async (values: z.infer<typeof formSchem>) => {
        if(!props.pipelineId) return
        try {
            const response = await upsertLane({
                values,
                id: props.defaultData?.id || undefined,
                pipelineId: props.pipelineId,
                order: props.defaultData?.order || undefined
            })

            const pipelineOwner = await getPipelineDetails(props.pipelineId)
            if(!pipelineOwner) return

            await saveActLogNotification({agencyId: undefined, description: `Updated a lane | ${response?.name}`, subAccountId: pipelineOwner.subAccountId})
            toast({
                title: 'Success',
                description: `Created lane in ${pipelineOwner.name}`,
            })

            window.location.reload()
        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'Oops!',
                description: 'Could not save pipeline details',
            })
        }
    }
  return (
    <form onSubmit={form.handleSubmit(handleOnsubmit)}>
        <div className='flex flex-col gap-5 my-4'>
            <label htmlFor="name" className={clsx('font-semibold text-lg mr-6', {"!text-red-700": form.formState.errors.name})}>Name: </label>
            <input {...form.register("name")} id="name" type="text" className="border-2 rounded-md broder-white py-4 pl-2 pr-10 focus-visible:outline-none focus-visible:border-4 bg-black" placeholder='Craete Task' disabled={form.formState.isLoading || form.formState.isSubmitting}/>
            {form.formState.errors.name && <span className='text-sm text-red-600'>{form.formState.errors.name.message}</span>}
        </div>
        
        {!form.formState.isSubmitting ? <button type="submit" className='px-5 lg:px-8 py-2 cursor-pointer bg-blue-600 rounded-sm text-lg'>Create lane</button> : <div className='bg-blue-600 py-2 px-6 rounded-sm justify-center items-center flex flex-row gap-2'>
            <Image className='spiiningLoadingAgencyDetails' width={30} height={30} alt='Loading Image' src="/assets/spinner-solid-svgrepo-com.svg"/> <span className='text-lg'>Saving...</span>
        </div>}
    </form>
  )
}

export default LaneForm