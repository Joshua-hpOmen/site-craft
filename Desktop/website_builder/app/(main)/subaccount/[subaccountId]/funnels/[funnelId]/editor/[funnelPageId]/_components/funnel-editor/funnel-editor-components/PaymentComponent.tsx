"use client"
import Loading from '@/components/global/loading'
import { Badge } from '@/components/ui/badge'
import { toast } from '@/hooks/use-toast'
import { EditorBtns } from '@/lib/constants'
import { getFunnel, getSubAccountDetails } from '@/lib/queries'
import { getStripe } from '@/lib/stripe/stripe-client'
import { EditorElement, useEditor } from '@/providers/editor/editor-provider'
import { EmbeddedCheckout, EmbeddedCheckoutProvider } from '@stripe/react-stripe-js'
import clsx from 'clsx'
import { Trash } from 'lucide-react'
import React from 'react'

type Props = {
    element: EditorElement
}

const PaymentComponent = (props: Props) => {
  const { state, dispatch, subaccountId, funnelId } = useEditor();
  const [mounted, setMounted] = React.useState(false)
  const [clientSecret, setClientSecret] = React.useState("");
  const [liveProducts, setLiveProducts] = React.useState([]);
  const [subAccountConnectAccId, setSubAccountConnectAccId] = React.useState("");
  const options = React.useMemo(() => ({ clientSecret }), [clientSecret])

  React.useEffect(() => {
    setMounted(true)
  }, [])

  React.useEffect(() => {
    if(!subaccountId) return;

    const fetchData = async () => {

      const subaccountDetails = await getSubAccountDetails(subaccountId);
      if(subaccountDetails){
        if(!subaccountDetails.connectAccountId) return;

        setSubAccountConnectAccId(subaccountDetails.connectAccountId)
      }

    }

    fetchData();

  }, [subaccountId])

  React.useEffect(() => {

    if(funnelId){
      const fetchData = async () => {

        const funnelData = await getFunnel(funnelId)
        setLiveProducts(JSON.parse(funnelData?.liveProducts || "[]"))
      }

      fetchData()
    }

  }, [funnelId])

  React.useEffect(() => {

    if(liveProducts.length && subaccountId && subAccountConnectAccId){

      const getClientSecret = async () => {

        try {
          
          const body = JSON.stringify({
            subAccountConnectAccId,
            prices: liveProducts,
            subaccountId
          })

          const response = await fetch(`${process.env.NEXT_PUBLIC_URL}api/stripe/create-checkout-session`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body
            }
          )

          const responseJSON = await response.json()

          if(!responseJSON) throw new Error("something went wrong");
          if(responseJSON.error) throw new Error(responseJSON.error);

          if (responseJSON.clientSecret) setClientSecret(responseJSON.clientSecret)

          console.log("🔴This is the clientSecret", clientSecret)

        } catch (error) {
          toast({
            open: true,
            className: 'z-[100000]',
            variant: 'destructive',
            title: 'Oppse!',
            //@ts-ignore
            description: error.message,
          })
        }

      }

      getClientSecret()
    }else{
      console.log("🔴Account info is missing")
      
    }

  }, [liveProducts, subaccountId, subAccountConnectAccId])


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
    e.stopPropagation()
    if(type === null) return

    e.dataTransfer.setData("componentType", type)
  }

  const handleDeleteElement = (e: React.MouseEvent) => {
    e.stopPropagation();

    dispatch({
      type: "DELETE_ELEMENT",
      payload: {
        elementDetails: props.element
      }
    })
  }

  if(!mounted) return;

  console.log(clientSecret)

  return (
    <div draggable={!state.editor.liveMode} onDragStart={(e) => handleDragStart(e, "paymentForm")} onClick={handleClick} style={props.element.styles}
      className={clsx('p-[2px] w-full m-[5px] relative text-[16px] transition-all flex items-center justify-center',{
          '!border-blue-500 !border-solid': state.editor.selectedElement.id === props.element.id,
          'border-dashed border-[1px] border-slate-300': !state.editor.liveMode,
        }
      )}
    >
      {state.editor.selectedElement.id === props.element.id && !state.editor.liveMode && <>
          <Badge className='absolute -top-[23px] -left-[1px] rounded-none rounded-t-lg'>
              {state.editor.selectedElement.name}
          </Badge>

            <div className='absolute bg-primary px-2.5 py-1 text-xs font-bold -top-[25px] -right-[1px] rounded-none rounded-t-lg !text-white'>
              <Trash className='cursor-pointer' size={16} onClick={handleDeleteElement}/>
          </div>
      </>}

      <div className="border-none transition-all w-full">
        <div className="flex flex-col gap-4 w-full">

          {options.clientSecret && subAccountConnectAccId && (
            <div className="text-white">
              <EmbeddedCheckoutProvider
                stripe={getStripe(subAccountConnectAccId)}
                options={options} 
              >
                <EmbeddedCheckout />
              </EmbeddedCheckoutProvider>
            </div>
          )}

          {!options.clientSecret && ( <div className="flex items-center justify-center w-full h-40"> <Loading /> </div> ) }

        </div>
      </div>

    </div>
  )
}

export default PaymentComponent