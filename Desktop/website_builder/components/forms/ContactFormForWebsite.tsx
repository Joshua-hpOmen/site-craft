import { zodResolver } from '@hookform/resolvers/zod'
import clsx from 'clsx'
import Image from 'next/image'
import React from 'react'
import { useForm } from 'react-hook-form'
import * as z from "zod"

const formSchema = z.object({
  name: z.string().min(1, {message: "Required"}),
  email: z.string().min(1, {message: "Required"})
})

type Props = {
    subTitle:  string,
    title: string,
    apiCall: (values: z.infer<typeof formSchema>) => void,
    isLive: boolean
}

const ContactFormForWebsite = (props: Props) => {

    const form = useForm<z.infer<typeof formSchema>>({
        mode: "onBlur",
        reValidateMode: "onSubmit",
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: ""
        }
    })

  return (
    <div className='max-w-[500px] w-[500px] bg-slate-900 p-8 rounded-md'>

        <header>
            <div className='text-lg font-semibold'>{props.title}</div>
            <div className='text-sm text-muted-foreground'>{props.subTitle}</div> <br />
        </header>

            <form onSubmit={form.handleSubmit(props.apiCall)} className="flex flex-col gap-4">
                
                <div className='flex flex-col gap-5'>
                  <label htmlFor="name" className={clsx('mr-6 font-semibold', {'!text-red-700': form.formState.errors.name && props.isLive})}>Name: </label>
                  <input {...form.register("name")} id='city' type="text" className="bg-slate-950/20 border-2 rounded-md py-4 pl-2 pr-10 focus-visible:outline-none focus-visible:border-4" placeholder='John Doe' disabled={form.formState.isLoading || form.formState.isSubmitting}/>
                  {form.formState.errors.name && props.isLive && <span className='text-sm text-red-600'>{form.formState.errors.name.message}</span>}
                </div>

                <div className='flex flex-col gap-5'>
                  <label htmlFor="email" className={clsx('font-semibold mr-6', {'!text-red-700': form.formState.errors.email && props.isLive})}>Email: </label>
                  <input {...form.register("email")} id='email' type="text" className="bg-slate-950/20 border-2 rounded-md py-4 pl-2 pr-10 focus-visible:outline-none focus-visible:border-4" placeholder='example@gmail.com' disabled={form.formState.isLoading || form.formState.isSubmitting}/>
                  {form.formState.errors.email && props.isLive && <span className='text-sm text-red-600'>{form.formState.errors.email.message}</span>}
                </div>

                <div>
                    {!form.formState.isSubmitting ? <button type="submit" className='px-10 py-3 cursor-pointer bg-blue-600 rounded-sm w-auto'>Save</button> : <div className='bg-blue-600 py-3 px-10 rounded-sm justify-center items-center flex flex-row gap-2'>
                        <Image className='spiiningLoadingAgencyDetails' width={30} height={30} alt='Loading Image' src="/assets/spinner-solid-svgrepo-com.svg"/> <span className='text-base'>Saving...</span>
                    </div>}
                </div>
                
            </form>

    </div>
  )
}

export default ContactFormForWebsite