import { toast } from '@/hooks/use-toast';
import { saveComponent } from '@/lib/queries';
import { zodResolver } from '@hookform/resolvers/zod';
import clsx from 'clsx';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react'
import { useForm } from 'react-hook-form';
import * as z from "zod";

type Props = {
    subaccountId: string,
    name: string,
    code: string
}

const formSchema = z.object({
    name: z.string().min(1, {message: "Required"}),
})

const CustomComponentForm = (props: Props) => {
    const router = useRouter()

   const handleOnSubmit = async (values : z.infer<typeof formSchema>) => {

    try {
        const resposne = await saveComponent(props.subaccountId, props.code, values.name)
        
        toast({
            title: "Success!",
            description: "Saved component"
        })

        router.refresh()
    } catch (error) {
        toast({
            title: "Oops!",
            description: "failed to save component",
            variant: "destructive"
        })
    }

   } 

   const form = useForm<z.infer<typeof formSchema>>({
    mode:"onBlur",
    reValidateMode: "onSubmit",
    resolver: zodResolver(formSchema),
    defaultValues: {
        name: props.name
    }
   })

  return (
    <form onSubmit={form.handleSubmit(handleOnSubmit)}>
        <div className='flex flex-col gap-5'>
            <label htmlFor="name" className={clsx('font-semibold text-lg mr-6', {'!text-red-700': form.formState.errors.name})}>Name: </label>
            <input {...form.register("name")} id='name' type="text" className="bg-black border-2 rounded-md py-4 pl-2 pr-10 focus-visible:outline-none focus-visible:border-4" placeholder="Untitled" disabled={form.formState.isLoading || form.formState.isSubmitting}/>
            {form.formState.errors.name && <span className='text-sm text-red-600'>{form.formState.errors.name.message}</span>}
        </div>
        <br />
        {!form.formState.isSubmitting ? <button type="submit" className='w-full cursor-pointer bg-blue-600 rounded-sm text-base py-3'>Save</button> : <div className='bg-blue-600 w-full rounded-sm justify-center items-center flex flex-row gap-2 py-3'>
            <Image className='spiiningLoadingAgencyDetails' width={30} height={30} alt='Loading Image' src="/assets/spinner-solid-svgrepo-com.svg"/> <span className='text-base'>Saving...</span>
        </div>}
    </form>
  )
}

export default CustomComponentForm