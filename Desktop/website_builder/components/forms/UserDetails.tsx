"use client"
import { useToast } from '@/hooks/use-toast'
import { AuthUserWithAgencySidebarOptionsSubbAccounts, UserWithPermissionsAndSubAccounts } from '@/lib/constants'
import { changeUserPermissions, getUserAuthDetails, getUserPermissions, saveActLogNotification, updateUser } from '@/lib/queries'
import { useModal } from '@/providers/modal-provider'
import { zodResolver } from '@hookform/resolvers/zod'
import { Permissions, SubAccount, User } from '@prisma/client'
import { useRouter } from 'next/navigation'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import * as z from 'zod';
import FileUpload from '../global/file-upload'
import clsx from 'clsx'
import Image from 'next/image'
import { Switch } from '../ui/switch'
import { v4 } from 'uuid'

type Props = {
    type: string | null,
    id: string,
    subAccounts?: SubAccount[] 
    userDetails?: Partial<User>
}

const userFormSchema = z.object({
    name: z.string().min(1, { message: "Name must have a min length of 1"}),
    email: z.string().includes("@", {message: "Invalid, email must include @"}).min(3,{message: "Invalid email"}),
    logo: z.string().min(1),
    role: z.enum(["AGENCY_OWNER", "AGENCY_ADMIN", "SUBACCOUNT_USER", "SUBACCOUNT_GUEST"])
})


const UserDetails = (props: Props) => {
    const [subAccountPermissions, setSubAccountPermissions] = React.useState<UserWithPermissionsAndSubAccounts | null>(null)

    const {data} = useModal()
    const [loaadingPermissions, setLoadingPermissions] = React.useState<boolean>(false)
    const [authUserData, setAuthUserData] = React.useState<AuthUserWithAgencySidebarOptionsSubbAccounts | null>(null) 
    const {toast} = useToast()

    const handleOnSubmit = async (value: z.infer<typeof userFormSchema>) => {
        if(!props.id) return

        if(props.userDetails || data.user) {
            const updatedUser = await updateUser(value)

            authUserData?.Agency?.SubAccount.filter(sub => {
                authUserData.Permissions.find(permission => {
                    return permission.subAccountId === sub.id && permission.access
                })
            }).forEach(async sub => {
                await saveActLogNotification({
                    agencyId: authUserData.agencyId ? authUserData.agencyId : undefined,
                    description: `Updated information: | ${props.userDetails?.name}`,
                    subAccountId: sub.id
                })
            })

            if(updatedUser){
                toast({
                    title: "Success",
                    description: "Updated user info"
                })
                window.location.reload();
            }else{
                toast({
                    title: "🔴Oops!",
                    description: "Failed to update user info\nplease try again",
                    variant: "destructive"
                })
            }
        }else{
            toast({
                title: "🔴Oops!",
                description: "Failed to update user info\nplease try again",
                variant: "destructive"
            })
        }
    }

    const onChangePermission = async (subbAccountId: string, permission: boolean, permissionId: string | undefined) => {
        if(!Boolean(data.user?.email || props.userDetails?.email)) return
        setLoadingPermissions(true)

        const response = await changeUserPermissions(permissionId || v4(), data.user?.email || props.userDetails?.email || "" , subbAccountId, permission)
        if(props.type === "agency"){
            await saveActLogNotification({agencyId: authUserData?.Agency?.id, description: `Gave ${props.userDetails?.name} access to | ${subAccountPermissions?.Permissions.find(p => p.subAccountId === subbAccountId)?.SubAccount.name}`, subAccountId: subAccountPermissions?.Permissions.find(permission => permission.subAccountId === subbAccountId)?.SubAccount.id})
        }

        if(response){
            toast({
                title: "Success",
                description: "The request was successfull"
            })
            if(subAccountPermissions){
                subAccountPermissions.Permissions.find(permission => ({...permission, access: !permission.access}))
            }
        }else{
            toast({
                title: "🔴Oops!",
                description: "Could not update user permissions\ntry again",
                variant: "destructive"
            })
        }
        setLoadingPermissions(false)
    }

    React.useEffect(() => {
        if(data.user || props.userDetails){
            const fetchData = async () => {
                const response = await getUserAuthDetails();
                if(response) setAuthUserData(response)
            }
            fetchData()
        }
    }, [data])


    const form = useForm<z.infer<typeof userFormSchema>>({
        mode: "onBlur",
        reValidateMode: "onSubmit",
        resolver: zodResolver(userFormSchema),
        defaultValues: {
            name: props.userDetails ? props.userDetails.name : data.user?.name,
            email: props.userDetails ? props.userDetails.email : data.user?.email,
            role: props.userDetails ? props.userDetails.role : data?.user?.role,
            logo: props.userDetails ? props.userDetails.avatarUrl : data.user?.avatarUrl,
        }
    })

    React.useEffect(() => {
        if(!data.user) return
        const getPermissions = async () => {
            if(!data.user) return
            const response  = await getUserPermissions(data.user.id)
            setSubAccountPermissions(response)
        }

        getPermissions()
    }, [data, form])

    React.useEffect(() => {
        if(data) form.reset(data.user)
        if(props.userDetails) form.reset(props.userDetails)

    }, [props.userDetails, data])

  return (
    <div className='px-[10px] mb-5 max-w-[800px]'>
        <div className='border-slate-800 shadow-sm border-2 rounded-md px-[2%] py-6 mb-4'>
            <div className='flex flex-col items-center'>
                <div className='text-lg lg:text-3xl font-semibold'>User Details</div>
                <div className='text-sm text-muted-foreground'>Add or update your information</div>
            </div>
            <form onSubmit={form.handleSubmit(handleOnSubmit)} className='border-2 border-slate-800 rounded-sm shadow-sm px-[2%] lg:px-[5%] my-3 flex flex-col py-8'>
                <div>
                    <div className={clsx('font-semibold text-xl text-muted-foreground', {"text-red-700" : form.formState.errors.logo})}>
                        User avatar:
                    </div>
                    <Controller 
                        disabled={form.formState.isLoading || form.formState.isSubmitting}
                        name="logo"
                        control={form.control}
                        render={({field}) => {
                            return <FileUpload apiEndpoint='avatar' value={field.value} onChange={field.onChange}/>
                        }}
                    />
                    {form.formState.errors.logo && <div>{form.formState.errors.logo.message}</div>}
                </div>
                
                <div className='flex flex-col px-[2%] my-4 gap-5'>
                    <div className='flex flex-col gap-2'>
                        <label className={clsx('font-semibold text-lg mr-6', {"!text-red-700": form.formState.errors.name})} htmlFor="name">User Name:</label>
                        <input type="text" placeholder='John Doe' id="name" {...form.register("name")} className={clsx("border-2 rounded-md broder-white py-4 pl-2 pr-10 focus-visible:outline-none focus-visible:border-4 bg-black", {"border-red-700" : form.formState.errors.name})} disabled={form.formState.isLoading || form.formState.isSubmitting}/>
                        {form.formState.errors.name && <span className='text-sm text-red-600'>{form.formState.errors.name.message}</span>}
                    </div>
                    <div className='flex flex-col gap-2'>
                        <label htmlFor="email" className={clsx('font-semibold text-lg mr-6', {"!text-red-700": form.formState.errors.email})}>Email:</label>
                        <input type="text" {...form.register("email")} id="email" className={clsx("border-2 rounded-md broder-white py-4 pl-2 pr-10 focus-visible:outline-none focus-visible:border-4 bg-black", {"border-red-700" : form.formState.errors.email})} disabled={form.formState.isLoading || form.formState.isSubmitting} />
                        {form.formState.errors.email && <span className='text-sm text-red-600'>{form.formState.errors.email.message}</span>}
                    </div>
                </div>
                
                <div className='flex flex-col mx-[2%] gap-3'>
                    <label htmlFor="role">Role: </label>
                    <select className='border-2 rounded-md broder-white py-4 pl-2 pr-10 focus-visible:outline-none focus-visible:border-4  bg-black' id='role' {...form.register("role")} disabled={data.user?.role !== "AGENCY_ADMIN" || props.userDetails?.role !== "AGENCY_ADMIN"}>
                        <option value="AGENCY_ADMIN" className='hover:!bg-blue-700'>Admin</option>
                        <option value="SUBACCOUNT_USER" className='hover:!bg-blue-700'>Subaccount user</option>
                        <option value="SUBACCOUNT_GUEST" className='hover:!bg-blue-700'>Subaccount guest</option>
                    </select>
                </div>

                
                <div className='flex items-center justify-center my-5'>
                    {!form.formState.isSubmitting ? <button type="submit" className='px-5 lg:px-8 py-3 lg:py-4 cursor-pointer bg-blue-600 rounded-sm text-base lg:text-xl w-[90%] whitespace-nowrap'>Save user information</button> : <div className='bg-blue-600 py-4 px-8 rounded-sm justify-center items-center flex flex-row gap-2 w-[70%] lg:w-[50%]'>
                        <Image className='spiiningLoadingAgencyDetails' width={30} height={30} alt='Loading Image' src="/assets/spinner-solid-svgrepo-com.svg"/> <span className='text-xl'>Saving...</span>
                    </div>}
                </div>
            </form>
            {Boolean(authUserData?.role === "AGENCY_OWNER") && <div className='border-2 border-slate-800 shadow-sm px-[4%] py-8'>
                <div className='flex flex-col items-center'>
                    <div className='text-lg lg:text-3xl font-semibold my-3'>User Permissions</div>
                    <span className='text-muted-foreground text-sm'>You can give subaccounts access to team member accounts by turning on access for each subaccount. This feature is reserved for Agency Owners</span>
                </div>
                <div>
                    {authUserData?.Agency?.SubAccount?.map((sub, index) => {
                        const subPermissionDetials = subAccountPermissions?.Permissions.find(permission => permission.subAccountId === sub.id)
                        

                        return <div key={index} className='flex flex-row justify-between my-4'>
                            <div>{sub.name}</div>
                            <Switch disabled={loaadingPermissions} checked={subPermissionDetials?.access} onCheckedChange={permission => onChangePermission(sub.id, permission, subPermissionDetials?.id)}/>
                        </div>
                    })}
                </div>
            </div> }
        </div>
    </div>
  )
}

export default UserDetails