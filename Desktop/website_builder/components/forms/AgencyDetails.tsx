"use client"
import {zodResolver} from '@hookform/resolvers/zod'
import { Agency } from '@prisma/client'
import * as z from 'zod';
import React from 'react'
import { Controller, useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'
import FileUpload from '../global/file-upload';
import Toggle from '../site/toggleButton';
import { initUser, saveActLogNotification, updateAgencyDetails, upsertAgency } from '@/lib/queries';
import Image from 'next/image';
import { deleteAgency } from '@/lib/queries';
import { v4 } from 'uuid';
import clsx from 'clsx';
import useMobile from '@/hooks/useMobile';

type Props = {
    data ?: Partial<Agency>
}

const FormSchema = z.object({
  name : z.string().min(1, {message : 'Agency must have at least 1 character'}),
  companyEmail: z.string().min(1, {message: "Email is required"}).includes("@", {message: "Invalid email does not contain @"}),
  companyPhone: z.string().min(1, {message : 'Required'}),
  whiteLabel: z.boolean(),
  agencyLogo: z.string().min(1, {message : 'Required'}),
  address: z.string().min(1, {message : 'Required'}),
  city: z.string().min(1, {message : 'Required'}),
  zipCode: z.string().min(1, {message : 'Required'}),
  state: z.string().min(1, {message : 'Required'}),
  country: z.string().min(1, {message : 'Required'}),
  goals: z.coerce.number().positive({message: "Invalid goals must be greater than 0" }).optional(),
})

const AgencyDetails = ({data}: Props) => {
  const isMobile = useMobile();
  const {toast} = useToast();
  const router = useRouter();
  const [deletingAgency, setDeletingAgency] = React.useState<Boolean>(false)
  const [firstClickTrigger, setFirstClickTrigger] = React.useState<Boolean>(false)
  const [sendingGoal, setSendingGoal] = React.useState<boolean>(false)
  
  const handleOnSubmit = async (values: z.infer<typeof FormSchema>) => {
    
    try{

      if(!data?.id){
        console.log("Hello")
        let custId: string

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

        const customerResponse = await fetch("/api/stripe/create-customer", {
          method: "POST",
          headers: {
            "Content-Type" : "application/json"
          },
          body: JSON.stringify(bodyData)
        })

        const customerData: { customerId: string} = await customerResponse.json()
        custId = customerData.customerId

        //WIP idk but its custId again idk what that means stripe related
        await initUser({role: "AGENCY_OWNER"});
        if(!data?.customerId && !custId) return 

        const response = await upsertAgency({
          id: data?.id || v4(),
          name: values.name,
          customerId: data?.customerId || custId || '',
          agencyLogo: values.agencyLogo,
          companyEmail: values.companyEmail,
          companyPhone: values.companyPhone,
          whiteLabel: values.whiteLabel,
          address: values.address,
          city: values.city,
          zipCode: values.zipCode,
          state: values.state,
          country: values.country,
          goal: values.goals,
        })
        
        toast({
          title: "Created Agency."
        })

        if(response) return window.location.reload();
        
      }else {
        toast({
          title: "Oops something went wrong!",
          variant: "destructive",
          description: "Could not create your agency!"
        })
      }
    }catch(err){
      toast({
        title: "Oops something went wrong!",
        variant: "destructive",
        description: "Could not create your agency!"
      })
    }
  }

  const handleDelete = async () => {
    //WIP handle the logic for deleting an agency.
    if(!data?.id) return;

    try {
      setDeletingAgency(true)
      const response = await deleteAgency(data?.id);

      toast({
        title: "Deleted Agency",
        description: "Successfully deleted Agency and all Subaccounts"
      })
    } catch (error) {
      toast({
        title: "Deleting Agency failed.",
        description: "Oops could not delete Agency.\nPlease try again",
        variant: 'destructive'
      })
    }
    setDeletingAgency(false)
    window.location.reload()
  }

  
    
    const form = useForm<z.infer<typeof FormSchema>>({
      resolver: zodResolver(FormSchema),
      mode: 'onBlur',
      reValidateMode: "onSubmit",
      defaultValues : {
        name: data?.name,
        companyEmail: data?.companyEmail,
        companyPhone: data?.companyPhone,
        whiteLabel: data?.whiteLabel || false,
        agencyLogo: data?.agencyLogo,
        address: data?.address,
        city: data?.city,
        zipCode: data?.zipCode,
        state: data?.state,
        country: data?.country,
        goals: data?.goal
      } 
    })

    React.useEffect(() => {
      if(data){
        form.reset(data)
      }
    }, [data])

  return (
    <div className='w-[100%] px-[2%] flex justify-center mb-4' onClick={e => e.stopPropagation()}>
      <div className='border-slate-900 shadow-slate-800 flex gap-5 px-[5px] flex-col shadow-sm border-2 w-[100%] mb-4 py-5 rounded-lg bg-slate-950 max-w-[980px]'>
        <div className=' text-white font-bold text-4xl text-center'>Agency Details</div>
        <div className='text-gray-700 font-semibold text-center'>
          Lets create an agency for your bussiness. You can edit agency settings later from the agency settings tab.
        </div>
        <form className='w-full flex flex-col gap-8' onSubmit={form.handleSubmit(handleOnSubmit, (error) => console.error(error))}>
          {/* The agency Logo */}
          <div className='lg:w-[90%] w-[95%] mx-auto lg:p-8 p-4 shadow-slate-800 shadow-sm border-2 border-slate-900'>
            <label htmlFor="agencyLogo" className={clsx('text-gray-500 text-xl font-semibold', {"!text-red-800": form.formState.errors.agencyLogo?.message})}>Agency Logo</label>
            <Controller 
              disabled={form.formState.isLoading || form.formState.isSubmitting}
              name="agencyLogo"
              control={form.control}
              render={({field}) => {
                return <FileUpload apiEndpoint='agencyLogo' value={field.value} onChange={field.onChange}/>
              }}
            />
            {form.formState.errors.agencyLogo && <span className='text-sm text-red-600'>{form.formState.errors.agencyLogo.message}</span>}
          
            {/* The email and phone */}
            <div className='text-gray-500 text-xl font-semibold mt-10'>Agency Contact</div>
            
            <div className='flex flex-col gap-5 my-4'>
                <label htmlFor="name" className={clsx('font-semibold text-lg mr-6', {"!text-red-700": form.formState.errors.name})}>Company Name: </label>
                <input {...form.register("name")} id="name" type="text" className="border-2 rounded-md broder-white py-4 pl-2 pr-10 focus-visible:outline-none focus-visible:border-4 bg-black" placeholder='Your Agency Name' disabled={form.formState.isLoading || form.formState.isSubmitting}/>
                {form.formState.errors.name && <span className='text-sm text-red-600'>{form.formState.errors.name.message}</span>}
            </div>

          <div className={clsx('flex justify-between w-[100%] my-5', {"flex-col": isMobile})}>
              
              <div className='flex flex-col gap-5'>
                <label htmlFor="companyEmail" className={clsx('font-semibold text-lg mr-6',{'!text-red-600': form.formState.errors.companyEmail})}>Company Email: </label>
                <input {...form.register("companyEmail")} id='companyEmail' type="text" className="bg-black border-2 rounded-md broder-white py-4 pl-2 pr-10 focus-visible:outline-none focus-visible:border-4" placeholder='example@service.com' disabled={form.formState.isLoading || form.formState.isSubmitting}/>
                {form.formState.errors.companyEmail && <span className='text-sm text-red-600'>{form.formState.errors.companyEmail.message}</span>}
              </div>

              <div className='flex flex-col gap-5'>
                <label htmlFor="companyPhone" className={clsx('font-semibold text-lg mr-6', {'!text-red-700': form.formState.errors.companyPhone})}>Company Phone: </label>
                <input {...form.register("companyPhone")} id='companyPhone' type="text" className="bg-black border-2 rounded-md broder-white py-4 pl-2 pr-10 focus-visible:outline-none focus-visible:border-4" placeholder='+270 000 0000' disabled={form.formState.isLoading || form.formState.isSubmitting}/>
                {form.formState.errors.companyPhone && <span className='text-sm text-red-600'>{form.formState.errors.companyPhone.message}</span>}
              </div>
            </div>

            <div>
              <div className='font-semibold text-lg mr-6'>Whitelabel Agency: </div>
              <div className='flex flex-row'>
                <label htmlFor="whiteLabel" className='text-gray-700'>
                  Turning on whitelabel mode will show your agency logo to all sub accounts by default. You can overwrite this functionality through sub account settings.
                </label>
                <Controller
                  disabled={form.formState.isLoading || form.formState.isSubmitting}
                  name='whiteLabel'
                  control={form.control}
                  render={({field}) => {
                    return <Toggle onChange={field.onChange} value={field.value}/>
                  }}
                />
              </div>
            </div>
          </div>

          <div className='lg:w-[90%] w-[95%] mx-auto lg:p-8 p-4 shadow-slate-800 shadow-sm border-2 border-slate-900'>
              {/*Agency Location*/}

              <div className='text-gray-500 text-xl font-semibold'>
                Agency Address
              </div>
              
              <div className='flex flex-col gap-5 my-5'>
                <label htmlFor="address" className={clsx('font-semibold text-lg mr-6', {'!text-red-700': form.formState.errors.address})}>Address:</label>
                <input {...form.register("address")} id="address" type="text" className="bg-black border-2 rounded-md py-4 pl-2 pr-10 focus-visible:outline-none focus-visible:border-4" placeholder='Address' disabled={form.formState.isLoading || form.formState.isSubmitting}/>
                {form.formState.errors.address && <span className='text-sm text-red-600'>{form.formState.errors.address.message}</span>}
              </div>

              <div className={clsx('grid grid-cols-2 grid-rows-2 gap-5 justify-between w-[100%] my-5', {"!grid-cols-1 !grid-rows-4" : isMobile})}>
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
              {data?.id && <div className='my-5'>
                <div className='text-white font-bold text-lg'>Create A Goal</div>
                <div className='text-slate-600'>
                  Create a goal for your agency. As your business grows your goals grow too so dont forget to set the bar higher!
                </div>
                <Controller name='goals' control={form.control} defaultValue={data?.goal} render={({field}) => {
                  return<>
                    <div className='flex flex-row items-center'>
                      <input disabled={form.formState.isSubmitting || form.formState.isLoading || sendingGoal}  type='number' min={1}  placeholder='Sub Account Goal' className={clsx('w-[100%] bg-transparent py-4 border-2 bg-black pl-4 rounded-l-md my-4 focus-visible:border-4 focus-visible:outline-none', {"border-red-700": form.formState.errors.goals})} value={field.value} onChange={async (e) => {
                        if(!data?.id) return;
                        setSendingGoal(true)
                        field.onChange(Number(e.target.value));
                        if(Number(e.target.value) <= 0)return form.setError("goals", {type: "min", message: "Invalid goal must be a min of 0"})
                        form.clearErrors("goals")
                        await updateAgencyDetails(data.id, {goal : Number(e.target.value)})
                        await saveActLogNotification({agencyId: data?.id, description: `Updated the agenct goal to | ${Number(e.target.value)}`})
                        setSendingGoal(false)
                      }}/>
                      <div className='flex flex-row h-[100%] text-xl font-bold'> 
                        <button className={clsx('px-6 border-2 h-[100%] py-[14px] cursor-pointer', {"border-red-700": form.formState.errors.goals})} disabled={form.formState.isLoading || form.formState.isSubmitting || sendingGoal} onClick={async (e: React.MouseEvent<HTMLElement>) => {
                          e.preventDefault()
                          if(!data?.id) return;
                          setSendingGoal(true)
                          const newVal = Number(field.value ?? 0) - 1
                          if(newVal <= 0)return form.setError("goals", {type: "min", message: "Invalid goal must be a min of 0"})
                          form.clearErrors("goals")
                          field.onChange(newVal)
                          if(!data?.id) return;
                          await updateAgencyDetails(data.id, {goal : newVal})
                          await saveActLogNotification({agencyId: data?.id, description: `Updated the agenct goal to | ${newVal}`})
                          setSendingGoal(false)
                        }}>-</button>
                        <button className={clsx('px-6 border-2 h-[100%] py-[14px] cursor-pointer', {"border-red-700": form.formState.errors.goals})} onClick={async (e) => {
                          e.preventDefault()
                          if(!data?.id) return;
                          setSendingGoal(true)
                          const newVal = Number(field.value ?? 0) + 1
                          if(newVal <= 0)return form.setError("goals", {type: "min", message: "Invalid goal must be a min of 0"})
                          form.clearErrors("goals")
                          field.onChange(newVal)
                          if(!data?.id) return;
                          await updateAgencyDetails(data.id, {goal : newVal})
                          await saveActLogNotification({agencyId: data?.id, description: `Updated the agenct goal to | ${newVal}`})
                          setSendingGoal(false)
                        }}>+</button>
                      </div> 
                    </div>
                    {form.formState.errors.goals && <span className='self-end justify-start text-red-700 text-sm'>{form.formState.errors.goals.message}</span>}
                  </>
                }}/>
              </div>}
          </div>
          <div className='w-[100%] justify-center flex'>
            {!form.formState.isSubmitting ? <button type="submit" className='px-5 py-3 cursor-pointer bg-blue-600 rounded-sm text-base w-[70%] lg:w-[50%]'>Save Agency Information</button> : <div className='bg-blue-600 py-3 px-6 rounded-sm justify-center items-center flex flex-row gap-2 w-[70%] lg:w-[50%]'>
                <Image className='spiiningLoadingAgencyDetails' width={30} height={30} alt='Loading Image' src="/assets/spinner-solid-svgrepo-com.svg"/> <span className='text-base'>Saving...</span>
              </div>}
          </div>
        {/* Deleting section */}

        {data?.id && (
          <>
            {/* If user clicked the above button once show message otherwise remove */}
            {firstClickTrigger && <div className='w-[100%] flex justify-center'> 
              <div className='w-[80%] border-2 border-destructive p-4'>
                <div>
                  <div className='text-2xl'>Danger Zone!!</div>
                </div>

                <div className='text-gray-600'>
                    Deleting your agency cannot be undone! This will also delete all sub accounts and all data related to those respective subaccount. Sub accounts will also no longer have access to funnels, contacts, etc.
                </div>

                <div className='w-[100%] flex justify-center items-center flex-row gap-5'>
                  <button onClick={() => handleDelete()} className='px-8 py-4 rounded-md bg-red-700 my-5'>
                    Delete Anyway
                  </button>
                  <button onClick={() => setFirstClickTrigger(false)} className='px-8 py-4 rounded-md bg-blue-600 my-5'>
                    Cancel
                  </button>
                </div>
              </div>
            </div>}

            {!firstClickTrigger && <div className='w-[100%] flex justify-center'>
              <button className="rounded-md px-5 lg:px-10 py-2 lg:py-4 text-lg lg:text-xl lg:font-semibold bg-red-700 w-[70%] lg:w-[50%]" onClick={() => {
                  if(firstClickTrigger){
                    setFirstClickTrigger(false)
                    handleDelete();
                  }else setFirstClickTrigger(true)
              }}>
                {deletingAgency ? "Deleting..." : "Deleted Agency"}
              </button>
            </div>}
          </>
        )}
        </form>

      </div>
    </div>
  )
}

export default AgencyDetails