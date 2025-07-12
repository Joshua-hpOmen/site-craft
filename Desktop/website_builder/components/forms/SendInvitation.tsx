import { useToast } from '@/hooks/use-toast'
import { saveActLogNotification, sendInvitation } from '@/lib/queries'
import { zodResolver } from '@hookform/resolvers/zod'
import { Role } from '@prisma/client'
import clsx from 'clsx'
import Image from 'next/image'
import React from 'react'
import { useForm } from 'react-hook-form'
import * as z from "zod" 

type Props = {
    agencyId: string
}

const formSchema = z.object({
    email : z.string().includes("@", {message: "Not a valid email doesnt include '@'"}).min(1, {message: "Not valid email"}),
    role: z.enum(["AGENCY_OWNER","AGENCY_ADMIN", "SUBACCOUNT_USER", "SUBACCOUNT_GUEST"])
})
const SendInvitation = (props: Props) => {
    const {toast} = useToast()


    const handleOnSubmit = async (values: z.infer<typeof formSchema>) => {
        try{
            const response = await sendInvitation(values.role, values.email, props.agencyId)
            await saveActLogNotification({agencyId: props.agencyId, description: `Invited | ${response.email}`, subAccountId: undefined})

            toast({
                title: "Success",
                description: "Sent invitation"
            })
        }catch(err){
            console.log(err)
            toast({
                title: "Oops!",
                description: "Failed to send invitation",
                variant: "destructive"
            })
        }
    }

    const form = useForm<z.infer<typeof formSchema>>({
        mode: "onBlur",
        reValidateMode: "onSubmit",
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            role: Role.SUBACCOUNT_USER
        }
    })

  return (<span className='px-10'>
    <div className='my-5'>
        <div className='text-lg font-bold'>Inviatation</div>
        <div className='text-sm text-muted-foreground'>An invitation will be send to the user. Users who already have an invitiation send out to their email, will not receive another invitation</div>
    </div>
    <form onSubmit={form.handleSubmit(handleOnSubmit)} className='flex flex-col gap-8 items-center'>
        <div className='flex flex-col gap-5  justify-between w-full'>
            <div className='flex flex-col gap-2'>
                <label htmlFor="email" className={clsx('font-semibold text-lg mr-6', {"!text-red-700": form.formState.errors.email})}>Email:</label>
                <input type="text" {...form.register("email")} id="email" className={clsx("border-2 rounded-md broder-white py-4 pl-2 pr-10 focus-visible:outline-none focus-visible:border-4 bg-black", {"border-red-700" : form.formState.errors.email})} disabled={form.formState.isLoading || form.formState.isSubmitting} />
                {form.formState.errors.email && <span className='text-sm text-red-600'>{form.formState.errors.email.message}</span>}
            </div>

            <div className='flex flex-col gap-3'>
                <label htmlFor="role">Role: </label>
                <select className='border-2 rounded-md broder-white py-4 pl-2 pr-10 focus-visible:outline-none focus-visible:border-4  bg-black' id='role' {...form.register("role")} disabled={form.formState.isLoading || form.formState.isSubmitting}>
                    <option value="AGENCY_ADMIN" className='hover:!bg-blue-700'>Agency Admin</option>
                    <option value="SUBACCOUNT_USER" className='hover:!bg-blue-700'>Subaccount user</option>
                    <option value="SUBACCOUNT_GUEST" className='hover:!bg-blue-700'>Subaccount guest</option>
                </select>
            </div>
        </div>

        <div className='flex items-center justify-center my-5'>
            {!form.formState.isSubmitting ? <button type="submit" className='px-6 py-3 cursor-pointer bg-blue-600 rounded-md text-base'>Send invitation</button> : <div className='bg-blue-600 py-3 px-6 rounded-md justify-center items-center flex flex-row gap-2'>
                <Image className='spiiningLoadingAgencyDetails' width={30} height={30} alt='Loading Image' src="/assets/spinner-solid-svgrepo-com.svg"/> <span className='text-xl'>Sending...</span>
            </div>}
        </div>
    </form>
  </span>
  )
}

export default SendInvitation