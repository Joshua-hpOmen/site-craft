import CustomModal from '@/components/forms/CustomModal'
import SubAccountDetails from '@/components/forms/SubAccountDetails'
import UserDetails from '@/components/forms/UserDetails'
import { useToast } from '@/hooks/use-toast'
import { deleteSubaccount, deleteUser, getUser } from '@/lib/queries'
import { useModal } from '@/providers/modal-provider'
import { Role } from '@prisma/client'
import { Copy, Edit, EllipsisIcon, Trash } from 'lucide-react'
import Image from 'next/image'
import React from 'react'
import { createPortal } from 'react-dom'

type Props = {
  user: {email: string, name: string, role: Role, avatarUrl: string, id:string}
  agencyName: string,
  index: number
}

const Columns = (props: Props) => {
  const [showModal, setShowModal] = React.useState(false)
  const targetRef = React.useRef<HTMLDivElement>(null)
  const modalRef = React.useRef<HTMLDivElement>(null)
  const {toast} = useToast()
  const {setOpen} = useModal()

  React.useLayoutEffect(() => {
    if(targetRef.current && modalRef.current) {
      const pos = targetRef.current.getBoundingClientRect()
      modalRef.current.style.top = `${pos.bottom + window.scrollY}px`
      modalRef.current.style.left = `${pos.left + window.scrollX - 130}px`
    }
  }, [showModal])


  const handleClick = () => {
    setShowModal(true);
  };

  const handleCopyEmail = () => {
    toast({title: "Copied email", description: "Users email successfully copied!"})
    navigator.clipboard.writeText(props.user.email)
  }

  

  const bgColor = props.user.role === "AGENCY_ADMIN" ? "bg-orange-400" : (props.user.role === "AGENCY_OWNER" ? "bg-emerald-500" : "bg-blue-700")
  const rowBg = (props.index +1) % 2 ===0 ? "bg-slate-800" : "bg-slate-900"

  return (
    <tr className={`${rowBg} overflow-hidden`}>
      <td className='p-3'>
        <div className='flex flex-row gap-2 items-center overflow-x-visible'>
          <Image src={props.user.avatarUrl} alt="User profile" className="rounded-full" height={40} width={40}/>
          <span className='flex flex-col'>
            <span>{props.user.name.split(" ")[0] !== "null" ? props.user.name.split(" ")[0] : "User"}</span>
            <span>{props.user.name.split(" ")[1] !== "null" && props.user.name.split(" ")[1]}</span>
          </span>
        </div>
      </td>
      <td className='p-3'>
        {props.user.email}
      </td>
      <td className='p-3'>
        <div className='bg-slate-700 px-3 py-1 rounded-full whitespace-nowrap text-center max-w-[300px]'>
          Agency - {" "}
          {props.agencyName}
        </div>
      </td>
      <td className='p-3'>
        <div className={`${bgColor} px-4 py-1 rounded-full text-center max-w-[300px]`}>
          {props.user.role}
        </div>
      </td>
      <td className="relative p-3">
        <div ref={targetRef}>
          <EllipsisIcon onClick={() => handleClick()} />
           {showModal && <>
            <div className='fixed inset-0 z-0' onClick={() => setShowModal(false)}></div>
            {createPortal(<div className="fixed bg-slate-900 px-5 py-4 rounded-md z-50 overflow-visible" ref={modalRef} >
              <h1 className='mb-2 font-semibold'>Actions</h1>

              <div className='flex flex-col gap-3'>
                <span className='flex flex-row gap-1 whitespace-nowrap hover:cursor-pointer' onClick={() => handleCopyEmail()}>
                  <Copy/> Copy Email
                </span>
                <span className='flex flex-row gap-1 whitespace-nowrap hover:cursor-pointer' onClick={() => setOpen(<CustomModal title='Edit user details' subheading='You can edit each users information right from your teams page'><UserDetails type="user" id={props.user.id}></UserDetails></CustomModal>, async () => {return {user: await getUser(props.user.id)}})}>
                  <Edit/> Edit Details
                </span>
                <span className='flex flex-row gap-1 whitespace-nowrap hover:cursor-pointer' onClick={async () => {
                  if(props.user.role === "SUBACCOUNT_USER"){
                    await deleteSubaccount(props.user.id)
                  }else if(props.user.role === "AGENCY_ADMIN"){
                    await deleteUser(props.user.id)
                  }else{
                    toast({title: "Failed!", description: "Can not delete agency owner from here.\nTo delete agency go to settings", variant: "destructive"})
                  }
                }}>
                  <Trash/> Remove User
                </span>
              </div>
            </div>, document.body)}
          </>}
        </div>
      </td>
    </tr>
  )
}

export default Columns