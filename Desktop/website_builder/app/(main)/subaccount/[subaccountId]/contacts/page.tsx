import { db } from '@/lib/db'
import { Contact, SubAccount, Ticket } from '@prisma/client'
import React from 'react'
import CreateContactButton from './_components/CreateContactButton'
import { User } from 'lucide-react'
import dayjs from 'dayjs'
import clsx from 'clsx'

type Props = {
    params: {subaccountId: string}
}
type SubaccountWithContacts = SubAccount & {
    Contact : (Contact & {Ticket: Ticket[]})[]
}

const formatTotal = (tickets: Ticket[]) => {
    if(!Boolean(tickets.length)) return "$0.00"
    const valueOfContact = new Intl.NumberFormat(undefined, {
        style: "currency",
        currency: "USD"
    }) 

    const laneAmount  = tickets.reduce((accumulator, currentValue) => accumulator + (Number(currentValue?.value) || 0), 0)

    return valueOfContact.format(laneAmount)
}

const page = async (props: Props) => {

    const contacts = await db.subAccount.findUnique({
        where: {id: props.params.subaccountId},
        include: {
            Contact: {
                include: {Ticket: {select: {value: true}}},
                orderBy: {createdAt: "asc"}
            }
        }
    }) as SubaccountWithContacts

    const allContacts = contacts.Contact
    
  return (
    <div className='py-4 w-full flex mt-4 justify-center'>
        <div className='w-[90%]'>
            <header className='flex justify-between'>
                <section className='text-white text-2xl font-semibold'>Contacts</section>
                <section>
                    <CreateContactButton subaccountId={props.params.subaccountId}/>
                </section>
            </header>

            <main className='w-full my-5 bg-slate-900 p-3 overflow-x-hidden pb-6 hover:overflow-x-auto'>
                <table className='overflow-x-hidden hover:overflow-x-auto h-auto '>
                    <thead>
                        <tr>
                            <th className='min-w-[200px] text-start max-w-[250px]'>Name</th>
                            <th className='min-w-[200px] text-start max-w-[250px]'>Email</th>
                            <th className='min-w-[200px] text-start max-w-[250px]'>Active</th>
                            <th className='min-w-[200px] max-w-[250px] text-start'>Created Date</th>
                            <th className='min-w-[200px] text-start max-w-[250px]'>Total Value</th>
                        </tr>
                    </thead>

                    <tbody >
                        {allContacts.map((contact, index) => (
                            <tr key={index} className={clsx("bg-inherit", {"bg-slate-800/20" : (index%2 === 0)})}>
                                <td className='flex gap-2 items-center py-3'>
                                    <User className='bg-blue-700 rounded-full p-2' size={35}/>
                                    {contact.name} 
                                </td>
                                <td className='py-3'>
                                    {formatTotal(contact.Ticket) === "$0.00" ? (
                                        <div className='bg-red-700 px-8 rounded-full text-center max-w-[60%]'>
                                            Inactive
                                        </div>
                                    ) : (
                                        <div className='bg-blue-700 px-8 rounded-full max-w-[60%]'>
                                            Active
                                        </div>
                                    )}
                                </td>
                                <td className='py-3'>
                                    {contact.email}
                                </td>
                                <td className='py-3'>{dayjs(contact.createdAt).format("D MMM YYYY")}</td>
                                <td className='py-3'>
                                    {formatTotal(contact.Ticket)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </main>
        </div>
    </div>
  )
}

export default page