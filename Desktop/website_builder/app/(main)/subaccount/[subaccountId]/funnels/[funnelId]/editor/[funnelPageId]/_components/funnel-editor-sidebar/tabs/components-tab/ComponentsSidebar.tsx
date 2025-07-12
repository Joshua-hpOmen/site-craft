import { EditorBtns } from '@/lib/constants'
import { ChevronDown, Code, Code2, Plus } from 'lucide-react'
import React from 'react'
import TextPlaceHolder from './_components/TextPlaceHolder'
import ContainerPlaceholder from './_components/ContainerPlaceholder'
import VideoPlaceHolder from './_components/VideoPlaceHolder'
import TwoColoumnsPlaceholder from './_components/TwoColoumnsPlaceholder'
import ContactFormComponentPlaceholder from './_components/ContactFormComponentPlaceholder'
import CheckoutPlaceholder from './_components/CheckoutPlaceholder'
import LinkPlaceholder from './_components/LinkPlaceholder'
import ImagePlaceHolder from './_components/ImagePlaceHolder'
import ThreeColPlaceholder from './_components/ThreeColPlaceholder'
import Link from 'next/link'
import { useEditor } from '@/providers/editor/editor-provider'
import { CustomComponents } from '@prisma/client'
import { getCustomComponents } from '@/lib/queries'
import CustomComponentPlaceholder from './_components/CustomComponentPlaceholder'

type Props = {
  subaccountId: string,
  funnelId: string
}

const ComponentsSidebar = (props: Props) => {
  const [showElements, setShowElements] = React.useState(true)
  const [showLayout, setShowLayout] = React.useState(true);
  const [showCustomComponents, setShowCustomComponents] = React.useState(true)
  const [customComponents, setCustomComponents] = React.useState<CustomComponents[]>([])

  const elements : {Component: React.ReactNode, label: string, id: EditorBtns, group: "layout" | "element"}[] = [
    {
      Component: <TextPlaceHolder/>,//🔴Completed
      label: "Text",
      id: "text",
      group: "element"
    },
    {
      Component: <ContainerPlaceholder/>,//🔴Completed
      label: "Container",
      id: "container",
      group: "layout"
    },
    {
      Component: <VideoPlaceHolder/>,//🔴Completed
      label: 'Video',
      id: "video",
      group: 'element'
    },
    {
      Component: <TwoColoumnsPlaceholder/>,//🔴Completed
      label: "2 Cols",
      id: "2Col",
      group: "layout"
    },
    {
      Component: <ContactFormComponentPlaceholder />,//🔴Completed
      label: 'Contact',
      id: 'contactForm',
      group: 'element',
    },
    {
      Component: <CheckoutPlaceholder />,//🔴Completed
      label: 'Checkout',
      id: 'paymentForm',
      group: 'element',
    },
    {
      Component: <LinkPlaceholder />,//🔴Completed
      label: 'Link',
      id: 'link',
      group: 'element',
    },
    {
      Component: <ImagePlaceHolder />,//🔴Completed
      label: 'Image',
      id: "image",
      group: 'element',
    },
    {
      Component: <ThreeColPlaceholder />,//🔴Completed
      label: '3 Cols',
      id: 'paymentForm',
      group: 'layout',
    },
  
  ]

  React.useEffect(() => {
    const fetchData = async () => {
      const response = await getCustomComponents(props.subaccountId)
      
      setCustomComponents(response)
    }

    fetchData()
  },[])

  return (
    <div>
      <header>
        <h1 className='text-lg'>Components</h1>
        <p className='text-muted-foreground text-sm'>You can drag and drop elements on the canvas</p>
      </header>

      <br />

      <main>

        <div>
          <h2 className='flex justify-between' onClick={() => setShowLayout(prev => !prev)}>Layout <ChevronDown/></h2> <br />

          {showLayout && 
            <div className='flex flex-wrap gap-2' >
              {elements.filter(elem => elem.group === "layout").map(element => (
                <div onClick={e => e.stopPropagation()} className='flex flex-col items-center justify-center' key={element.id}>
                  {element.Component}

                  <span className='text-muted-foreground'>{element.label}</span>

                </div>
              ))}
            </div>
          }

        </div>

        <br />

        <div>
          <h2 className='flex justify-between' onClick={() =>  setShowElements(prev => !prev)}>Elements <ChevronDown/></h2> <br />

          {showElements &&
            <div className='flex flex-wrap gap-2' >
              {elements.filter(ele => ele.group === "element").map(element => (
                <div className='flex flex-col items-center justify-center' key={element.id}>
                  {element.Component}

                  <span className='text-muted-foreground'>{element.label}</span>

              </div>
            ))}
            </div>
          }

        </div>

        <br />

        <div>
          <h2 className='flex justify-between' onClick={() =>  setShowCustomComponents(prev => !prev)}>Custom Components <ChevronDown/></h2> <br />

          {showCustomComponents && customComponents && <div className='my-4'>
            {customComponents.map((component, index) => (
              <CustomComponentPlaceholder key={index} component={component} funnelId={props.funnelId} subaccountId={props.subaccountId}/>
            ))}
          </div>}

          <div>
            <Link className='w-14' href={`/subaccount/${props.subaccountId}/funnels/${props.funnelId}/editor/customcomponent`}>
              <div className="bg-slate-900 rounded-md flex items-center p-3 w-14 text-center">
                <Plus size={40} className='text-muted-foreground'/>
              </div>
            </Link>
          </div>

        </div>

      </main>

    </div>
  )
}

export default ComponentsSidebar