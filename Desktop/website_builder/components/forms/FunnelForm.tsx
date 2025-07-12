"use client"
import { toast } from '@/hooks/use-toast'
import { createFunnel, saveActLogNotification } from '@/lib/queries'
import { Funnel } from '@prisma/client'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import * as z from "zod"
import FileUpload from '../global/file-upload'
import clsx from 'clsx'
import Image from 'next/image'
import { zodResolver } from '@hookform/resolvers/zod'

type Props = {
    subaccountId: string,
    defaultData?: Funnel
}

const formSchema = z.object({
    favicon: z.string(),
    name : z.string().min(1, {message: "Required"}),
    subDomainName : z.string().min(1, "Required"),
    description: z.string()
})

const FunnelForm = (props: Props) => {

    const form = useForm<z.infer<typeof formSchema>>({
        mode: "onBlur",
        reValidateMode: "onSubmit",
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: props.defaultData?.name || "",
            favicon: props.defaultData?.favicon || "",
            subDomainName : props.defaultData?.subDomainName  || "",
            description: props.defaultData?.description || ""
        }
    })

    const handleSubmit = async (values: z.infer<typeof formSchema>) => {
        if(!props.subaccountId) return;


        try {
            const response  = await createFunnel(values, props.subaccountId, props.defaultData?.id)
            
            await saveActLogNotification({agencyId: undefined,description: `Successfully created funnel | ${response.name}`, subAccountId: response.subAccountId})
            toast({
                title: "Success",
                description: "Created funnel",
            })
            window.location.reload()
        } catch (error) {
            toast({
                title: "Oops!",
                description: "Failed to create funnel",
                variant: "destructive"
            })
        }
    }

  return (
    <div className='w-full px-16'>
        <header className='text-xl font-semibold mb-3 underline'>Funnel form</header>

        <main>
            <form onSubmit={form.handleSubmit(handleSubmit)}>
                
                <section>
                    <label htmlFor="subAccountLogo" className={clsx('text-xl font-semibold', {"!text-red-800": form.formState.errors.favicon?.message})}>Favicon</label>
                    <Controller 
                        disabled={form.formState.isLoading || form.formState.isSubmitting}
                        name="favicon"
                        control={form.control}
                        render={({field}) => {
                            return <FileUpload apiEndpoint='media' value={field.value} onChange={field.onChange}/>
                        }}
                    />
                    {form.formState.errors.favicon && <span className='text-sm text-red-600'>{form.formState.errors.favicon.message}</span>}
                </section>

                <section>
                    <div className='flex flex-col gap-5 my-4'>
                        <label htmlFor="name" className={clsx('font-semibold text-lg mr-6', {"!text-red-700": form.formState.errors.name})}>Name: </label>
                        <input {...form.register("name")} id="name" type="text" className="border-2 rounded-md broder-white py-4 pl-2 pr-10 focus-visible:outline-none focus-visible:border-4 bg-black" placeholder='Funnel' disabled={form.formState.isLoading || form.formState.isSubmitting}/>
                        {form.formState.errors.name && <span className='text-sm text-red-600'>{form.formState.errors.name.message}</span>}
                    </div>

                    <div className='flex flex-col gap-5 my-4'>
                        <label htmlFor="subdomain" className={clsx('font-semibold text-lg mr-6', {"!text-red-700": form.formState.errors.subDomainName})}>Subdomain: </label>
                        <input {...form.register("subDomainName")} id="subdomain" type="text" className="border-2 rounded-md broder-white py-4 pl-2 pr-10 focus-visible:outline-none focus-visible:border-4 bg-black" placeholder='home' disabled={form.formState.isLoading || form.formState.isSubmitting}/>
                        {form.formState.errors.subDomainName && <span className='text-sm text-red-600'>{form.formState.errors.subDomainName.message}</span>}
                    </div>

                    <div className='flex flex-col gap-5'>
                        <label htmlFor="description" className={clsx({"text-red-700": form.formState.errors.description})}>Description:</label>
                        <textarea placeholder='Description' id='description' {...form.register("description")} className="bg-black border-2 rounded-md py-4 pl-2 pr-10 focus-visible:outline-none focus-visible:border-4"></textarea>
                        {form.formState.errors.description && <span className='text-sm text-red-600'>{form.formState.errors.description.message}</span>}
                    </div>
                </section>

                <div className='w-[100%] mt-5'>
                    {!form.formState.isSubmitting ? <button type="submit" className='px-6 py-3 cursor-pointer bg-blue-600 rounded-md text-base'>Save information</button> : <div className='bg-blue-600 py-3 px-6 rounded-md justify-center items-center flex flex-row gap-2'>
                        <Image className='spiiningLoadingAgencyDetails' width={30} height={30} alt='Loading Image' src="/assets/spinner-solid-svgrepo-com.svg"/> <span className='text-base'>Saving...</span>
                    </div>}
                </div>


            </form>
        </main>
    </div>
  )
}

export default FunnelForm