import CreatePipelineForm from '@/components/forms/CreatePipelineForm'
import { useToast } from '@/hooks/use-toast'
import { deletePipeline, saveActLogNotification } from '@/lib/queries'
import { Pipeline } from '@prisma/client'
import { tree } from 'next/dist/build/templates/app-page'
import React from 'react'

type Props = {
  pipelineCurrent: Pipeline,
  pipelines: Pipeline[],
  subaccountId: string
}

const Settings = (props: Props) => {
  const [showWarningModal, setShowWarningModal] = React.useState(false)
  const [pipeLineCurrent, setPiplineCurrent] = React.useState<Pipeline>()
  const [mounted, setMounted] = React.useState(false)
  const {toast} = useToast();

  React.useEffect(() => {
    setMounted(true)
  }, [])

  
  React.useEffect(() => {
    const setThePipelineOnLoad = () => {
      setPiplineCurrent(props.pipelineCurrent)
    }
    
    setThePipelineOnLoad()
  }, [props.pipelineCurrent])
  
  if(!mounted) return
  
  return (
    <div className='w-full py-6 flex flex-col gap-3 bg-slate-900 rounded-md px-4 mt-2'>
      <CreatePipelineForm subaccountId={props.subaccountId} defaultData={pipeLineCurrent}/> 

      <button onClick={async () => setShowWarningModal(true)} className='py-2 bg-red-700 rounded-md px-4 w-[120px]'>Delete</button>
      {showWarningModal && <div className='fixed flex justify-center items-center inset-0 bg-slate-950/30'>
          <div className='border-2 border-slate-600 rounded-md px-10 py-10 gap-8 flex flex-col items-center justify-center'>
            <section className='flex items-center justify-center flex-col'>
              <div className='text-xl font-semibold'>
                Warning!
              </div>
              <div className='text-muted-foreground text-sm'>
                Once deleted it can not be recovered
              </div>
            </section>
            <div className='flex justify-between gap-4'>
              <button onClick={async () => {
                try {
                  await deletePipeline(props.pipelineCurrent.id)
                  toast({
                    title: "Success!",
                    description: "Pipeline has been deleted."
                  })
                  await saveActLogNotification({agencyId: undefined, description: `The pipeline has been deleted | ${props.pipelineCurrent.name}`, subAccountId: props.subaccountId})
                  window.location.reload()
                } catch (error) {
                  toast({
                    title: "Oops!",
                    description: "Pipeline could not been deleted.",
                    variant: "destructive"
                  })
                }
                
              }} className='py-2 bg-red-700 rounded-md px-4 w-[120px]'>Delete</button>
              <button className='bg-blue-700 rounded-md px-4 w-[120px] py-2' onClick={() =>setShowWarningModal(false)}>Cancel</button>
            </div>
          </div>
        </div>}
    </div>
  )
}

export default Settings