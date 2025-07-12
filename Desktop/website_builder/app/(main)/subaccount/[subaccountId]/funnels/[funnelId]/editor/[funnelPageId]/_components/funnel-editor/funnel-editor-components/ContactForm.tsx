"use client"
import React from 'react'
import { Badge } from '@/components/ui/badge'
import { EditorBtns } from '@/lib/constants'
import { EditorElement, useEditor } from '@/providers/editor/editor-provider'
import clsx from 'clsx'
import { Trash } from 'lucide-react'
import * as z from 'zod'
import { toast } from '@/hooks/use-toast'
import { getFunnel, saveActLogNotification, upsertContact } from '@/lib/queries'
import ContactFormForWebsite from '@/components/forms/ContactFormForWebsite'
import { useRouter } from 'next/navigation'

type Props = {
    element: EditorElement
}

const formSchema = z.object({
  name: z.string().min(1, {message: "Required"}),
  email: z.string().min(1, {message: "Required"})
})

const ContactForm = (props: Props) => {
  const {state, dispatch, subaccountId, funnelId, pageDetails} = useEditor()
  const router = useRouter()

  const handleClick = (e: React.MouseEvent) => {

    e.stopPropagation();
    dispatch({
      type: "CHANGE_CLICKED_ELEMENT",
      payload: {
        elementDetails: props.element
      }
    })

  }

  const handleDragStart = (e: React.DragEvent, type: EditorBtns) => {
    e.stopPropagation();
    if(type === null || props.element.type !== "contactForm") return
    e.dataTransfer.setData("componentType", type)
  }

  const handleDeleteElement = (e: React.MouseEvent) => {
    e.stopPropagation()

    dispatch({
      type: "DELETE_ELEMENT",
      payload: {
        elementDetails: props.element
      }
    })
  }

  const goToNextPage = async () => {
    if(!state.editor.liveMode) return

    const funnelPagesDetails = await getFunnel(funnelId)
    if(!funnelPagesDetails || !pageDetails) return

    if(funnelPagesDetails.FunnelPages.length > pageDetails.order + 1){
      const nextPage = funnelPagesDetails.FunnelPages.find(page => page.order === pageDetails.order + 1)
      if(!nextPage) return

      router.replace(`${process.env.NEXT_PUBLIC_SCHEME}${funnelPagesDetails.subDomainName}.${process.env.NEXT_PUBLIC_DOMAIN}/${nextPage.pathName}`)
    }

  }

  const onFormSubmit = async (values: z.infer<typeof formSchema>) => {
    if(!state.editor.liveMode) return;

    try {
      
      const response = await upsertContact({
        ...values
      }, subaccountId)
      
      //WIP Call trigger endpoint
      await saveActLogNotification({
        agencyId: undefined,
        description: `A New contact signed up | ${response?.name}`,
        subAccountId: subaccountId,
      })

      toast({
        title: 'Success',
        description: 'Successfully Saved your info',
      })

      await goToNextPage()

    } catch (error) {
      toast({
        title: 'Oops!',
        description: 'Could not save your information',
        variant: 'destructive',
      })
    }
  }

  return (
    
    <div onClick={handleClick} draggable={!state.editor.liveMode} onDragStart={(e) => handleDragStart(e, "contactForm")}
      className={clsx('p-[2px] w-full m-[5px] relative text-[16px] transition-all flex items-center justify-center',{
        '!border-solid !border-blue-500': state.editor.selectedElement.id === props.element.id,
        'border-dashed border-[1px] border-slate-300': !state.editor.liveMode,
    })}>
        
        {state.editor.selectedElement.id === props.element.id && !state.editor.liveMode && <>
            <Badge className='absolute -top-[23px] -left-[1px] rounded-none rounded-t-lg'>
                {state.editor.selectedElement.name}
            </Badge>

             <div className='absolute bg-primary px-2.5 py-1 text-xs font-bold -top-[25px] -right-[1px] rounded-none rounded-t-lg !text-white'>
                <Trash className='cursor-pointer' size={16} onClick={handleDeleteElement}/>
            </div>
        </>}

        <ContactFormForWebsite title="Contact Us" subTitle="Want a free quote? We can help you" isLive={!!state.editor.liveMode} apiCall={onFormSubmit}/>

    </div>

  )
}

export default ContactForm