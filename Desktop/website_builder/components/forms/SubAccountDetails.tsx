"use client"
import {zodResolver} from '@hookform/resolvers/zod'
import * as z from 'zod';
import React from 'react'
import { Controller, useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'
import FileUpload from '../global/file-upload';
import { initUser, upsertSubbaccount } from '@/lib/queries';
import Image from 'next/image';
import { v4 } from 'uuid';
import clsx from 'clsx';
import { Agency, SubAccount } from '@prisma/client';
import useMobile from '@/hooks/useMobile';
import { useModal } from '@/providers/modal-provider';
import { X } from 'lucide-react';


type Props = {
    agencyDetails: Agency,
    userId: string,
    userName: string,
    details?: Partial<SubAccount>
}

const FormSchema = z.object({
  name : z.string().min(1, {message : 'Agency must have at least 1 character'}),
  companyEmail: z.string().min(1, {message: "Email is required"}).includes("@", {message: "Invalid email does not contain @"}),
  companyPhone: z.string().min(1, {message : 'Required'}),
  subAccountLogo: z.string().min(1, {message : 'Required'}),
  address: z.string().min(1, {message : 'Required'}),
  city: z.string().min(1, {message : 'Required'}),
  zipCode: z.string().min(1, {message : 'Required'}),
  state: z.string().min(1, {message : 'Required'}),
  country: z.string().min(1, {message : 'Required'}),
  goals: z.number().positive(),
})

const SubAccountDetails = (props: Props) => {
    
    const {toast} = useToast();
    const isMobile = useMobile();
  const handleOnSubmit = async (values: z.infer<typeof FormSchema>) => {
    
    try{
        if(props.userId){

            const bodyData = {
            //This is for stripe hence it being structured like this.
            email: values.companyEmail,
            name: values.name,
            shipping: {
                address:{
                city: values.city,
                country: values.country,
                line1: values.address,
                postal_code: values.zipCode,
                state: values.state
                },
                name: values.name
            },
            address:{
                city: values.city,
                country: values.country,
                line1: values.address,
                postal_code: values.zipCode,
                state: values.state
                },
            }

            //WIP idk but its custId again idk what that means stripe related
            const response = await upsertSubbaccount({
                id: props.userId|| v4(),
                name: values.name,
                subAccountLogo: values.subAccountLogo,
                companyEmail: values.companyEmail,
                companyPhone: values.companyPhone,
                address: values.address,
                city: values.city,
                zipCode: values.zipCode,
                state: values.state,
                country: values.country,
                goal: values.goals,
                connectAccountId: null,
                agencyId: props.agencyDetails.id,
            })
            
                toast({
                title: "Created Subaccount."
                })
                
                if(response) return window.location.reload();
        }else {
            toast({
            title: "Oops something went wrong!",
            variant: "destructive",
            description: "Could not create your subaccount! no user id"
            })
        }

        window.location.reload()

    }catch(err){
      console.error(err);
      toast({
        title: "Oops something went wrong!",
        variant: "destructive",
        description: "Could not create your subaccount!"
      })
    }
  }

    
    const form = useForm<z.infer<typeof FormSchema>>({
      mode: 'onBlur',
      reValidateMode: "onSubmit",
      resolver: zodResolver(FormSchema),
      defaultValues : {
        name: props.details?.name,
        companyEmail: props.details?.name,
        companyPhone: props.details?.name,
        subAccountLogo: props.details?.subAccountLogo,
        address: props.details?.address,
        city: props.details?.city,
        zipCode: props.details?.zipCode,
        state: props.details?.state,
        country: props.details?.country,
        goals: props.details?.goal
      } 
    })
    form.setValue('goals', 1)

    React.useEffect(() => {
      if(props.details){
        form.reset(props.details)
      }
    }, [props.details])

  return (
    <div className='w-[100%] px-[5%] flex justify-center py-4 mb-8'>
      <div className='border-slate-800 shadow-black-800  flex gap-5 flex-col shadow-md border-2 w-[100%] py-6 rounded-lg bg-slate-950'>
        <div className='font-semibold text-xl text-center'>
          Subaccount information
        </div>
        <form className='w-full flex flex-col gap-8' onSubmit={form.handleSubmit(handleOnSubmit)}>
          {/* The agency Logo */}
          <div className='w-[90%] mx-auto p-8 shadow-slate-800 shadow-sm border-2 border-slate-900'>
            <label htmlFor="subAccountLogo" className={clsx('text-gray-500 text-xl font-semibold', {"!text-red-800": form.formState.errors.subAccountLogo?.message})}>Subbaccount Logo</label>
            <Controller 
              disabled={form.formState.isLoading || form.formState.isSubmitting}
              name="subAccountLogo"
              control={form.control}
              render={({field}) => {
                return <FileUpload apiEndpoint='subAccountLogo' value={field.value} onChange={field.onChange}/>
              }}
            />
            {form.formState.errors.subAccountLogo && <span className='text-sm text-red-600'>{form.formState.errors.subAccountLogo.message}</span>}
          
            {/* The email and phone */}
            <div className='text-gray-500 text-xl font-semibold mt-10'>Account Contact</div>
            
            <div className='flex flex-col gap-5 my-4'>
                <label htmlFor="name" className={clsx('font-semibold text-lg mr-6', {"!text-red-700": form.formState.errors.name})}>Account Name: </label>
                <input {...form.register("name")} id="name" type="text" className="border-2 rounded-md broder-white py-4 pl-2 pr-10 focus-visible:outline-none focus-visible:border-4 bg-black" placeholder='The account Name' disabled={form.formState.isLoading || form.formState.isSubmitting}/>
                {form.formState.errors.name && <span className='text-sm text-red-600'>{form.formState.errors.name.message}</span>}
            </div>

            <div className={clsx('flex justify-between w-[100%] my-5 flex-wrap', {"flex-col": isMobile})}>
              
              <div className='flex flex-col gap-5'>
                <label htmlFor="companyEmail" className={clsx('font-semibold text-lg mr-6',{'!text-red-600': form.formState.errors.companyEmail})}>Account Email: </label>
                <input {...form.register("companyEmail")} id='companyEmail' type="text" className="bg-black border-2 rounded-md broder-white py-4 pl-2 pr-10 focus-visible:outline-none focus-visible:border-4" placeholder='example@service.com' disabled={form.formState.isLoading || form.formState.isSubmitting}/>
                {form.formState.errors.companyEmail && <span className='text-sm text-red-600'>{form.formState.errors.companyEmail.message}</span>}
              </div>

              <div className='flex flex-col gap-5'>
                <label htmlFor="companyPhone" className={clsx('font-semibold text-lg mr-6', {'!text-red-700': form.formState.errors.companyPhone})}>Account Phone: </label>
                <input {...form.register("companyPhone")} id='companyPhone' type="text" className="bg-black border-2 rounded-md broder-white py-4 pl-2 pr-10 focus-visible:outline-none focus-visible:border-4" placeholder='+270 000 0000' disabled={form.formState.isLoading || form.formState.isSubmitting}/>
                {form.formState.errors.companyPhone && <span className='text-sm text-red-600'>{form.formState.errors.companyPhone.message}</span>}
              </div>
            </div>
          </div>

          <div className='w-[90%] mx-auto p-8 shadow-slate-800 shadow-sm border-2 border-slate-900'>
              {/*Subaccount Location*/}

              <div className='text-gray-500 text-xl font-semibold'>
                Subaccount Address
              </div>
              
              <div className='flex flex-col gap-5 my-5'>
                <label htmlFor="address" className={clsx('font-semibold text-lg mr-6', {'!text-red-700': form.formState.errors.address})}>Address:</label>
                <input {...form.register("address")} id="address" type="text" className="bg-black border-2 rounded-md py-4 pl-2 pr-10 focus-visible:outline-none focus-visible:border-4" placeholder='Address' disabled={form.formState.isLoading || form.formState.isSubmitting}/>
                {form.formState.errors.address && <span className='text-sm text-red-600'>{form.formState.errors.address.message}</span>}
              </div>

              <div className={clsx('grid grid-cols-2 grid-rows-2 gap-5 justify-between w-[100%] mt-5', {'!grid-rows-4 !grid-cols-1': isMobile})}>
                <div className='flex flex-col gap-5'>
                  <label htmlFor="city" className={clsx('font-semibold text-lg mr-6', {'!text-red-700': form.formState.errors.city})}>City: </label>
                  <input {...form.register("city")} id='city' type="text" className="bg-black border-2 rounded-md py-4 pl-2 pr-10 focus-visible:outline-none focus-visible:border-4" placeholder='California' disabled={form.formState.isLoading || form.formState.isSubmitting}/>
                  {form.formState.errors.city && <span className='text-sm text-red-600'>{form.formState.errors.city.message}</span>}
                </div>

                <div className='flex flex-col gap-5'>
                  <label htmlFor="state" className={clsx('font-semibold text-lg mr-6', {'!text-red-700': form.formState.errors.state})}>State: </label>
                  <input {...form.register("state")} id='state' type="text" className="bg-black border-2 rounded-md py-4 pl-2 pr-10 focus-visible:outline-none focus-visible:border-4" placeholder='Los Angeles' disabled={form.formState.isLoading || form.formState.isSubmitting}/>
                  {form.formState.errors.state && <span className='text-sm text-red-600'>{form.formState.errors.state.message}</span>}
                </div>
                
                <div className='flex flex-col gap-5'>
                  <label htmlFor="zipCode" className={clsx('font-semibold text-lg mr-6', {'!text-red-700': form.formState.errors.zipCode})}>Zip Code: </label>
                  <input {...form.register("zipCode")} id='zipCode' type="text" className="bg-black border-2 rounded-md py-4 pl-2 pr-10 focus-visible:outline-none focus-visible:border-4" placeholder='0000' disabled={form.formState.isLoading || form.formState.isSubmitting}/>
                  {form.formState.errors.zipCode && <span className='text-sm text-red-600'>{form.formState.errors.zipCode.message}</span>}
                </div>

                <div className='flex flex-col gap-5'>
                  <label htmlFor="country" className={clsx('font-semibold text-lg mr-6', {'!text-red-700': form.formState.errors.country})}>Country: </label>
                  <input {...form.register("country")} id='country' type="text" className="bg-black border-2 rounded-md py-4 pl-2 pr-10 focus-visible:outline-none focus-visible:border-4" placeholder='United States' disabled={form.formState.isLoading || form.formState.isSubmitting}/>
                  {form.formState.errors.country && <span className='text-sm text-red-600'>{form.formState.errors.country.message}</span>}
                </div>

              </div>
              
          </div>
          <div className='w-[100%] justify-center flex'>
            {!form.formState.isSubmitting ? <button type="submit" className='px-6 py-3 cursor-pointer bg-blue-600 rounded-md'>Save information</button> : <div className='bg-blue-600 py-3 px-6 rounded-md justify-center items-center flex flex-row gap-2'>
                <Image className='spiiningLoadingAgencyDetails' width={30} height={30} alt='Loading Image' src="/assets/spinner-solid-svgrepo-com.svg"/> <span>Saving...</span>
              </div>}
          </div>
        </form>
    
      </div>
    </div>
  )
}

export default SubAccountDetails