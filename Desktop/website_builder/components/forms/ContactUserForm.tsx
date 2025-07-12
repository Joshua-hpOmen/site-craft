import { toast } from '@/hooks/use-toast'
import { saveActLogNotification, upsertContact } from '@/lib/queries'
import { zodResolver } from '@hookform/resolvers/zod'
import { Contact } from '@prisma/client'
import clsx from 'clsx'
import Image from 'next/image'
import React from 'react'
import { useForm } from 'react-hook-form'
import * as z from "zod"

type Props = {
    defaultValues ?: Contact,
    subaccountId: string
}

const formSchema = z.object({
    name: z.string().min(1, {message: "Required"}),
    email: z.string().min(1, {message: "Required"}).includes("@", {message: "Invalid email"})
})

const ContactUserForm = (props: Props) => {
    const form = useForm<z.infer<typeof formSchema>>({
        mode : "onBlur",
        reValidateMode: "onSubmit",
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: props.defaultValues?.name || "",
            email: props.defaultValues?.email || "",
        }
    })

    const handleOnSubmit = async (values: z.infer<typeof formSchema>) => {
        if(!props.subaccountId) return
        try {
            const response = await upsertContact(values, props.subaccountId, props.defaultValues?.id)
            await saveActLogNotification({agencyId: undefined, description: `Created contact | ${response.name}`})
            toast({title: "Success", description: "Created a contact"})
            window.location.reload()
        } catch (error) {
            toast({title: "Oops!", description: "Failed to craete contact", variant: "destructive"})
        }
    }

  return (
    <div>
        <div className='text-lg font-semibold'>
            Contact form
        </div>

        <form onSubmit={form.handleSubmit(handleOnSubmit)} className='flex flex-col gap-4'>
            <div className='flex flex-col gap-5 my-4'>
                <label htmlFor="name" className={clsx('font-semibold text-lg mr-6', {"!text-red-700": form.formState.errors.name})}>Name: </label>
                <input {...form.register("name")} id="name" type="text" className="border-2 rounded-md broder-white py-4 pl-2 pr-10 focus-visible:outline-none focus-visible:border-4 bg-black" placeholder='John Doe' disabled={form.formState.isLoading || form.formState.isSubmitting}/>
                {form.formState.errors.name && <span className='text-sm text-red-600'>{form.formState.errors.name.message}</span>}
            </div>

            <div className='flex flex-col gap-5'>
                <label htmlFor="email" className={clsx('font-semibold text-lg mr-6',{'!text-red-600': form.formState.errors.email})}>Email: </label>
                <input {...form.register("email")} id='companyEmail' type="text" className="bg-black border-2 rounded-md broder-white py-4 pl-2 pr-10 focus-visible:outline-none focus-visible:border-4" placeholder='example@service.com' disabled={form.formState.isLoading || form.formState.isSubmitting}/>
                {form.formState.errors.email && <span className='text-sm text-red-600'>{form.formState.errors.email.message}</span>}
            </div>


            {!form.formState.isSubmitting ? <button type="submit" className='px-6 py-2 cursor-pointer bg-blue-600 rounded-md'>Save contact</button> : <div className='bg-blue-600 py-2 px-6 rounded-md justify-center items-center flex flex-row gap-2'>
                <Image className='spiiningLoadingAgencyDetails' width={30} height={30} alt='Loading Image' src="/assets/spinner-solid-svgrepo-com.svg"/> <span className=''>Saving...</span>
            </div>}
            
        </form>
    </div>
  )
}

export default ContactUserForm