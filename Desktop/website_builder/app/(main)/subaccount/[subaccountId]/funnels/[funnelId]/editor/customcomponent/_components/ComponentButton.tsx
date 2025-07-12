"use client"
import React from 'react'
import { useModal } from '@/providers/modal-provider'
import CustomModal from '@/components/forms/CustomModal'
import CustomComponentForm from '@/components/forms/CustomComponentForm'
import { useComponent } from '@/providers/code-editor-provider'
import { saveComponent } from '@/lib/queries'
import { toast } from '@/hooks/use-toast'


type Props = {
    subaccountId: string,
    componentId?: string
}

const ComponentButton = (props: Props) => {
  const {setOpen} = useModal()
  const { data } = useComponent()

  const handleOnClick = async () => {
    if(props.componentId){
      try {
        await saveComponent(props.subaccountId, data.code || "<section>Hello World</section>", data.name || "Untitled", props.componentId)

        toast({
          title: "Success",
          description: "Save Component"
        })
      } catch (error) {
        console.log(error)
        toast({
          title: "Oops!",
          description: "Couldnt save component",
          variant: "destructive"
        })
      }finally{
        return
      }
    }
    setOpen(
        <CustomModal title={"Save Component"} subheading={"You can create your own custom components"} >
            <CustomComponentForm subaccountId={props.subaccountId} code={data.code || ""} name={data.name || "Untitled"}/>
        </CustomModal>
    )
  }
  return (
    <button className='bg-blue-700 px-6 py-2 rounded-md' onClick={handleOnClick}>Save</button>
  )
}

export default ComponentButton