import { toast } from '@/hooks/use-toast'
import { deleteFunnelPage, getFunnels, saveActLogNotification, upsertFunnelPage } from '@/lib/queries'
import { zodResolver } from '@hookform/resolvers/zod'
import { FunnelPage } from '@prisma/client'
import clsx from 'clsx'
import { CopyPlusIcon, Trash } from 'lucide-react'
import Image from 'next/image'
import React from 'react'
import { useForm } from 'react-hook-form'
import { v4 } from 'uuid'
import * as z from "zod"

type Props = {
    subaccountId :string,
    funnelId: string, 
    order: number,
    defaultData?: FunnelPage 
}

const formSchema = z.object({
    name: z.string().min(1, {message: "Required"}),
    pathName: z.string()
})

const CreateFunnelPageForm = (props: Props) => {

    const form = useForm<z.infer<typeof formSchema>>({
        mode: "onBlur",
        reValidateMode: "onSubmit",
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            pathName: ""
        }
    })

    React.useEffect(() => {
        if(props.defaultData){
            form.reset({name: props.defaultData.name, pathName: props.defaultData.pathName})
        }
    }, [props.defaultData])

    const handleOnSubmit = async (values : z.infer<typeof formSchema>) => {
        if(props.order !== 0 && !values.pathName) {
            return form.setError("pathName", {message: "Page doesnt have path"})
        }


        try {
            
            const response = await upsertFunnelPage(props.subaccountId, {...values, id: props.defaultData?.id, order: props.defaultData?.order || props.order, pathName: values.pathName}, props.funnelId)

            await saveActLogNotification({
                agencyId: undefined,
                description: `Updated a funnel page | ${response?.name}`,
                subAccountId: props.subaccountId,
            })


            toast({
                title: 'Success',
                description: 'Saves Funnel Page Details',
            })
            window.location.reload()
        } catch (error) {
            console.log(error)
            toast({
                variant: 'destructive',
                title: 'Oops!',
                description: 'Couldnt Save Funnel Page Details',
            })
        }
    }

    return (
        <div>
            <header>
                <h1 className='font-semibold text-xl'>Funnel Page</h1> <br />

                <p className='text-sm text-muted-foreground'>
                    Funnel pages are flow in the order they are created by default. <br />
                    You can move them around to change their order.
                </p>
                <br />
            </header>

            <form onSubmit={form.handleSubmit(handleOnSubmit)} className='flex flex-col gap-3'>

                <div className='flex flex-col gap-5'>
                    <label htmlFor="city" className={clsx('font-semibold text-lg mr-6', {'!text-red-700': form.formState.errors.name})}>Name: </label>
                    <input {...form.register("name")} id='city' type="text" className="bg-slate-950/40 border-2 rounded-md py-4 pl-2 pr-10 focus-visible:outline-none focus-visible:border-4" placeholder='Home' disabled={form.formState.isLoading || form.formState.isSubmitting}/>
                    {form.formState.errors.name && <span className='text-sm text-red-600'>{form.formState.errors.name.message}</span>}
                </div>

                <div className='flex flex-col gap-5'>
                    <label htmlFor="state" className={clsx('font-semibold text-lg mr-6', {'!text-red-700': form.formState.errors.pathName})}>Pathname: </label>
                    <input {...form.register("pathName")} id='state' type="text" className="bg-slate-950/40 border-2 rounded-md py-4 pl-2 pr-10 focus-visible:outline-none focus-visible:border-4" placeholder='/features' disabled={form.formState.isLoading || form.formState.isSubmitting || props.order === 0}/>
                    {form.formState.errors.pathName && <span className='text-sm text-red-600'>{form.formState.errors.pathName.message}</span>}
                </div>

                <br />

                <div className='w-full items-center flex gap-2'>
                    {!form.formState.isSubmitting ? <button type="submit" className='px-6 py-3 cursor-pointer bg-blue-600 rounded-md'>Save information</button> : <div className='bg-blue-600 py-3 px-6 rounded-md justify-center items-center flex flex-row gap-2'>
                        <Image className='spiiningLoadingAgencyDetails' width={30} height={30} alt='Loading Image' src="/assets/spinner-solid-svgrepo-com.svg"/> <span>Saving...</span>
                    </div>}

                    {!!props.defaultData?.id && (
                        <div className='flex items-center gap-3'>
                            <button type="button" className="flex justify-center border-2 p-2 self-end border-destructive text-destructive rounded-md bg-destructive/20" disabled={form.formState.isSubmitting || form.formState.isLoading} onClick={async () => {
                                if(!props.defaultData?.id) return
                                const response = await deleteFunnelPage(props.defaultData.id)

                                await saveActLogNotification({
                                    agencyId: undefined,
                                    description: `Deleted a funnel page | ${response?.name}`,
                                    subAccountId: props.subaccountId,
                                })
                            }}>
                                <Trash size={30}/>
                            </button>

                            <button type="button" disabled={form.formState.isSubmitting || form.formState.isLoading} onClick={async () => {
                                if(!props.defaultData) return
                                const response = await getFunnels(props.subaccountId)
                                const lastFunnelPage = response.find((funnel) => funnel.id === props.funnelId )?.FunnelPages.length

                                await upsertFunnelPage(
                                    props.subaccountId, { ...props.defaultData, id: v4(), order: lastFunnelPage || 0, visits : 0, name: `${props.defaultData.name} Copy`, pathName: `${props.defaultData.pathName}copy`},  props.funnelId
                                )

                                toast({
                                    title: 'Success',
                                    description: 'Saves Funnel Page Details',
                                })
                            }}>
                                <CopyPlusIcon/>
                            </button>
                        </div>
                    )}
                </div>

            </form>

        </div>
    )
}

export default CreateFunnelPageForm