import { toast } from '@/hooks/use-toast'
import { TicketAndTags } from '@/lib/constants'
import { createTags, deleteTag, getContact, getLaneTags, getSubaccountTeamMembers, upsertTicket } from '@/lib/queries'
import { zodResolver } from '@hookform/resolvers/zod'
import { Contact, Tag, Ticket, User } from '@prisma/client'
import clsx from 'clsx'
import dayjs from 'dayjs'
import { ChevronsUpDownIcon, Divide, PlusCircleIcon, Search, Trash, User2Icon, X } from 'lucide-react'
import Image from 'next/image'
import React, { ChangeEvent } from 'react'
import { Controller, useForm } from 'react-hook-form'
import * as z from "zod"


type Props = {
    laneId: string,
    subaccountId: string,
    defaultData?: TicketAndTags
}

const formSchema = z.object({
    name: z.string().min(1, {message: "Required"}),
    description: z.string().min(1, {message: "Required"}),
    value: z.number(),
})

const colors = [
    "bg-blue-400",
    "bg-orange-300",
    "bg-rose-400",
    "bg-purple-400",
    "bg-green-400",
]

const user_test_array = [
    {
        id: 1,
        name: "Alex",
        avatarUrl: "/assets/imagePlaceholder.png",
        email: "test.user@gmail.com",
        createdAt: new Date(),
        updatedAt: new Date(),
        role: "SUBACCOUNT_USER",
        agencyId: "1234"
    },
    {
        id: 1,
        name: "Alex",
        avatarUrl: "/assets/imagePlaceholder.png",
        email: "test.user@gmail.com",
        createdAt: new Date(),
        updatedAt: new Date(),
        role: "SUBACCOUNT_USER",
        agencyId: "1234"
    },
    {
        id: 1,
        name: "Alex",
        avatarUrl: "/assets/imagePlaceholder.png",
        email: "test.user@gmail.com",
        createdAt: new Date(),
        updatedAt: new Date(),
        role: "SUBACCOUNT_USER",
        agencyId: "1234"
    },
    {
        id: 1,
        name: "Alex",
        avatarUrl: "/assets/imagePlaceholder.png",
        email: "test.user@gmail.com",
        createdAt: new Date(),
        updatedAt: new Date(),
        role: "SUBACCOUNT_USER",
        agencyId: "1234"
    },
]

const TicketForm = (props: Props) => {
    //Tag section
    const [lanesTags, setLanesTags] = React.useState<Tag[]>([])
    const [initialLanesTags, setInitialLanesTags] = React.useState<Tag[]>([])
    const [bgColor, setBgColor] = React.useState<string>()
    const [search, setSearch] = React.useState("")
    const [selectedTags, setSelectedTags] = React.useState<Tag[]>(props.defaultData?.Tags || [])

    //Team member section
    const [allTeamMembers, setAllTeamMember] = React.useState<User[]>()
    const [showPopover, setShowPopover] = React.useState(false)
    const [currentMemberSelected, setCurrentMemberSelected] = React.useState<User>()

    //Contact Portion
    const [contactSearch, setContactSearch] = React.useState("")
    const [selectedContact, setSelectedContact] = React.useState<Contact>()
    const [subaccountContacts, setSubaccountContacts] = React.useState<Contact[]>([])
    const [contactFilter, setContactFilter] = React.useState<Contact[]>([])
    const [opnCustomerModal, setOpnCustomerModal] = React.useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        mode: "onBlur",
        reValidateMode: "onSubmit",
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: props.defaultData?.name || "",
            description: props.defaultData?.description || "",
            value: Number(props.defaultData?.value) || 0,
        }
    })

    React.useEffect(() => {
        const setTags = async () => {
            const tags = await getLaneTags(props.subaccountId)
            setLanesTags(tags)
            setInitialLanesTags(tags)
        }
        
        setTags()
    }, [props.subaccountId, props.defaultData])

    React.useEffect(() => {
        const fetchData = async () => {
            const response = await getSubaccountTeamMembers(props.subaccountId);
            if(response) {setAllTeamMember(response)}
            
            const responseContact = await getContact(props.subaccountId)
            if(responseContact) {
                setSubaccountContacts(responseContact);
                setContactFilter(responseContact); 
                if(!props.defaultData)return
                setSelectedContact(responseContact.find(con => con.id === props.defaultData?.id))
            }
        } 

        fetchData()
    }, [props.subaccountId, props.defaultData])

   

    const handleOnSubmit = async (values : z.infer<typeof formSchema>, tags: Tag[], laneId: string, id?: string, order?: number, customerId?: string) => {
        console.log("hello world")
        if(!props.subaccountId) return
        try {
            const createResponse  = await upsertTicket({...values, laneId,  order, id, customerId}, tags);
            if(createResponse){
                toast({title: "Success", description: "Created ticket"})
            }

            window.location.reload()
        } catch (error) {
            toast({title: "Oops!", description: "Failed to create ticket", variant: "destructive"})
        }
        
    }


    const handleAddTag = async () => {
        if(!search.length){
            toast({
                title: "Oops!",
                description: "Tags needs to have a name.",
                variant: "destructive"
            })
            return
        }
        if (!bgColor){
            toast({
                title: "Oops!",
                description: "Tags needs to have a color.",
                variant: "destructive"
            })
            return
        }

        const response = await createTags(props.subaccountId, search, bgColor)
        setLanesTags(prev => [...initialLanesTags, response])
        setSearch("")
    }

    const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value)
        if(!initialLanesTags) return
        setLanesTags(initialLanesTags.filter(tag => {
            return tag.name.search(new RegExp(e.target.value,"i")) !== -1
        }))
    }

    const handleCustomerSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setContactSearch(e.target.value);
        setContactFilter(subaccountContacts.filter(cont => (
            cont.name.search(new RegExp(e.target.value, "i")) !== -1 || cont.email.search(new RegExp(e.target.value, "i")) !== -1
        )))
    }
  return (
    <div className='w-full px-5'>
        <div className='font-semibold text-xl px-8 my-3'>Ticket Details</div>

        <form onSubmit={() => handleOnSubmit(form.getValues(), selectedTags, props.laneId, props.defaultData?.id, props?.defaultData?.order, selectedContact?.id )} className='flex flex-col gap-3 px-8'>
            <div className="flex flex-col gap-5">
                <label htmlFor="value" className={clsx('font-semibold text-lg mr-6', {'!text-red-700': form.formState.errors.name})}>Ticket Name: </label>
                <input className="bg-black border-2 rounded-md py-4 pl-2 pr-10 focus-visible:outline-none focus-visible:border-4" type="text" {...form.register("name")} id="name" placeholder='Name'/>
                  {form.formState.errors.name && <span className='text-sm text-red-600'>{form.formState.errors.name.message}</span>}
            </div>

            <div className='flex flex-col gap-5'>
                <label htmlFor="description" className={clsx({"text-red-700": form.formState.errors.description})}>Description:</label>
                <textarea placeholder='Description' id='description' {...form.register("description")} className="bg-black border-2 rounded-md py-4 pl-2 pr-10 focus-visible:outline-none focus-visible:border-4"></textarea>
                {form.formState.errors.description && <span className='text-sm text-red-600'>{form.formState.errors.description.message}</span>}
            </div>

            <div className="flex flex-col gap-5">
                <label htmlFor="value" className='font-semibold text-lg mr-6'>Value: </label>
                <input className="bg-black border-2 rounded-md py-4 pl-2 pr-10 focus-visible:outline-none focus-visible:border-4" type="number" {...form.register("value")} id="value" placeholder='Value'/>
            </div>

            {!!selectedTags.length && <div className="min-w-full flex items-center bg-black p-3 gap-2 overflow-x-hidden hover:overflow-x-auto">
                {selectedTags.map(tag => (
                    <div key={tag.id} className='flex items-center'>
                        <div className='h-[80%]'>
                            <div className={`border-${tag.color.split("bg-")[1]} p-3 border-2 ${tag.color} bg-opacity-10 text-${tag.color.split("bg-")[1]} font-semibold rounded-sm`}>{tag.name}</div>
                        </div>
                        <X size={25} className='text-muted-foreground' onClick={() => {
                            setSelectedTags(prev => prev.filter(filtertag => filtertag.id !== tag.id))
                        }}/>
                    </div>
                ))}
            </div>}
            
            
            <div className='flex flex-col gap-5'>
                <label htmlFor="tag" className='font-semibold my-3'>Add Tags:</label>
                <div className='flex gap-3'>
                    {colors.map(color => <div key={color} className={clsx(`border-${color.split("bg-")[1]} p-3 rounded-sm border-2 ${color} bg-opacity-15`, {"border-white": bgColor === color})} onClick={() => setBgColor(color)}></div>)}
                </div>
                
                <div className='flex justify-between relative'>
                    <Search className='absolute top-3 left-4' color='#4B5563'/>
                    <input type="text" name='search' placeholder='Search for tag...' value={search} className="bg-slate-800 w-[100%] py-3 pl-11  pr-2 rounded-md outline-none placeholder:text-gray-600" onChange={(e) => handleSearch(e)}/>
                    <PlusCircleIcon className='absolute top-3 right-4 text-muted-foreground' onClick={() => handleAddTag()}/>
                </div>

                <div>
                    <div className='text-sm text-muted-foreground'>Tags</div>

                    <div className='w-full my-2'>
                        {lanesTags.map(tag => <div className='flex justify-between w-full items-center hover:bg-slate-500/10 p-3 rounded-sm' key={tag.id} onClick={() => {
                            if(selectedTags.find(findtag => tag.id === findtag.id)){
                                toast({
                                    title: "Already applied that tag",
                                    variant: "destructive"
                                })
                                return
                            }
                            setSelectedTags(prev => [...prev, tag])
                        }}>
                            <div className={`${tag.color} bg-opacity-25 border-${tag.color.split("bg-")[1]} p-3  bg-opacity-15 text-${tag.color.split("bg-")[1]} font-semibold rounded-sm`}>{tag.name}</div>
                            <div><Trash onClick={async (e) => {
                                e.stopPropagation()
                                try {
                                    await deleteTag(tag.id)
                                    toast({title: "Deleted tag."})
                                    setLanesTags(prev => prev.filter(filtertag => filtertag.id !== tag.id))
                                    setSelectedTags(prev => prev.filter(filtertag => filtertag.id !== tag.id))
                                } catch (error) {
                                    toast({title: "Oops!", variant: "destructive", description: "Could not delete tag"})
                                }
                            }}/></div>
                        </div>)}

                    </div>
                    {Boolean(!lanesTags.length && search.length) && <div className='text-sm text-muted-foreground text-center'>
                        No tags found...
                    </div>}
                </div>
            </div>
            
            <div className='relative'>
                <div className='text-lg font-semibold'>Assigned to team member</div>
                
                <div className='flex gap-2 justify-between items-center border-2 border-slate-700 hover:bg-slate-900/20 p-3 my-2 rounded-md' onClick={(e) => {e.stopPropagation(); setShowPopover(prev => !prev)}}>
                    {
                        currentMemberSelected ? (
                            <div className='flex gap-3 items-center hover:bg-slate-800 px-3 py-1'>
                                <Image src={currentMemberSelected.avatarUrl} width={40} height={40} alt='User image' className='rounded-full'/>
                                {currentMemberSelected.name}
                            </div>
                        ):(
                            <div className='flex items-center gap-1'>
                                <User2Icon className='bg-blue-700 rounded-full p-2' size={40} />
                                <div className="text-lg">No team member assigned.</div>
                            </div>
                        )
                    }
                    <ChevronsUpDownIcon/>
                </div>

                {showPopover && <>
                    <div className='fixed inset 0 backdrop-blur-md z-10' onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        setShowPopover(false)
                    }}></div>
                    <div className='z-20 bg-slate-900/95 flex flex-col gap-2 rounded-sm' onClick={(e) => e.stopPropagation()}>
                        {allTeamMembers?.map((member, index) => (
                            //@ts-ignore
                            <div className='flex gap-3 items-center hover:bg-slate-800 px-3 py-1' key={index} onClick={() => {setCurrentMemberSelected(member); setShowPopover(false)}}>
                                <Image src={member.avatarUrl} width={40} height={40} alt='User image' className='rounded-full'/>
                                {member.name}
                            </div>
                        ))}
                    </div>
                </>}
            </div>

            

            <div>
                <div className='text-lg font-semibold my-2'>Customers</div>
                
                <div className='flex justify-between items-center border-2 border-slate-800 p-5 rounded-md' onClick={() => setOpnCustomerModal(prev => !prev)}>
                    {!selectedContact ? <span className='font-semibold text-lg'>Select Customer</span> : <div className='flex gap-3  items-center hover:bg-slate-800 px-3'>
                            <div className='bg-blue-700 p-2 px-4 rounded-full text-center'>
                                {selectedContact.name.split(" ")[0][0]} {selectedContact.name.split(" ").length === 2 && selectedContact.name.split(" ")[1][0] }
                            </div>
                            {selectedContact.name}
                        </div>}
                    <ChevronsUpDownIcon/>
                </div>

                {opnCustomerModal && <div>
                    <div className='relative mt-2'>
                        <Search className='absolute top-3 left-4' color='#4B5563'/>
                        <input type="text" name='search' placeholder='Search for customer...' value={contactSearch} className="bg-slate-800 w-[100%] py-3 pl-11  pr-2 rounded-md outline-none placeholder:text-gray-600" onChange={(e) => handleCustomerSearch(e)}/>
                    </div>

                    {<div className='gap-2 flex flex-col my-2'>
                        {Boolean(contactFilter.length) ? contactFilter.map((contact, index) => (
                            <div className='flex gap-3 justify-between items-center hover:bg-slate-800 px-3 py-1 rounded-md' key={index} onClick={() => {
                                setSelectedContact(contact);
                                setOpnCustomerModal(false);
                            }}>
                                <div className='flex gap-3 items-center'>
                                    <div className='bg-blue-700 p-2 px-4 rounded-full text-center'>
                                        {contact.name.split(" ")[0][0]} {contact.name.split(" ").length === 2 && contact.name.split(" ")[1][0] }
                                    </div>
                                    <span className='flex flex-col'>
                                        {contact.name}
                                        <span className='text-muted-foreground text-sm'>
                                            {contact.email}
                                        </span>
                                    </span>
                                </div>

                                <div className='text-muted-foreground text-sm'>
                                    {dayjs(contact.createdAt).format("D MMM YYYY")}
                                </div>
                            </div>
                        )): <div className='text-muted-foreground'>
                            Not contact found    
                        </div>}
                    </div>}    
                </div>}
            </div>

            <div className='w-[100%] flex'>
                {!form.formState.isSubmitting ? <button type="submit" className='px-8 py-2 cursor-pointer bg-blue-600 rounded-sm text-lg'>Save</button> : <div className='bg-blue-600 py-4 px-8 rounded-sm justify-center items-center flex flex-row gap-2 w-[70%] lg:w-[50%]'>
                    <Image className='spiiningLoadingAgencyDetails' width={30} height={30} alt='Loading Image' src="/assets/spinner-solid-svgrepo-com.svg"/> <span className='text-base'>Saving...</span>
                </div>}
            </div>
        </form>
    </div>
  )
}

export default TicketForm