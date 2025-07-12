import { EditorBtns } from '@/lib/constants';
import { EditorElement, useEditor } from '@/providers/editor/editor-provider';
import clsx from 'clsx';
import { ChevronDown, Contact2Icon, ImageIcon, Link2Icon, TypeIcon, Youtube } from 'lucide-react';
import Image from 'next/image';
import React from 'react'
import ContainerTypeComponent from './ContainerTypeComponent';


const elementsTypes : {Component: React.ReactNode, label: string, id: EditorBtns, group: "layout" | "element"}[] = [
    {
      Component: <TypeIcon size={24} className="text-muted-foreground" />,
      label: "Text",
      id: "text",
      group: "element"
    },
    {
      Component: <div className='h-10 w-10 bg-muted/70 rounded-lg p-2 flex flex-row gap-[4px]'>
          <div className='border-dashed border-[1px] h-full rounded-sm bg-muted border-muted-foreground/50 w-full'/>
        </div>,
      label: "Container",
      id: "container",
      group: "layout"
    },
    {
      Component:<div className='h-10 w-10 bg-muted/70 rounded-lg p-2 flex flex-row gap-[4px]'>
          <div className='border-dashed border-[1px] h-full rounded-sm bg-muted border-muted-foreground/50 w-full'/>
        </div>,
      label: "Body",
      id: "__body",
      group: "layout"
    },
    {
      Component: <Youtube size={24} className='text-muted-foreground'/>,
      label: 'Video',
      id: "video",
      group: 'element'
    },
    {
      Component:<div className='h-10 w-10 bg-muted/70 rounded-lg p-2 flex flex-row gap-[4px]'>
          <div className='border-dashed border-[1px] h-full rounded-sm bg-muted border-muted-foreground/50 w-full'/>
        </div>,
      label: "2 Cols",
      id: "2Col",
      group: "layout"
    },
    {
      Component:<Contact2Icon size={44}className="text-muted-foreground py-2"/> ,//🔴Completed
      label: 'Contact',
      id: 'contactForm',
      group: 'element',
    },
    {
      Component: <Image src="/stripelogo.png" height={30} width={30} alt="stripe logo" className="object-cover" />,
      label: 'Checkout',
      id: 'paymentForm',
      group: 'element',
    },
    {
      Component: <Link2Icon size={24} className="text-muted-foreground" /> ,//🔴Completed
      label: 'Link',
      id: 'link',
      group: 'element',
    },
    {
      Component: <ImageIcon size={24} className="text-muted-foreground" />,//🔴Completed
      label: 'Image',
      id: "image",
      group: 'element',
    },
    {
      Component: <div className='h-10 w-10 bg-muted/70 rounded-lg p-2 flex flex-row gap-[4px]'>
          <div className='border-dashed border-[1px] h-full rounded-sm bg-muted border-muted-foreground/50 w-full'/>
        </div>,
      label: '3 Cols',
      id: "3Col",
      group: 'layout',
    },
  
  ]

  type Props = {
    elements : EditorElement[]
  }

export const RecursiveLayoutTree = (props: Props) => {
    const  {dispatch} = useEditor();
  
    return props.elements.map(elem => {
      if(Array.isArray(elem.content)){

        const theDisplayingComponent = elementsTypes.find(elementType => elementType.id === elem.type)

             
        return <ContainerTypeComponent elem={elem} theDisplayingComponent={theDisplayingComponent} />

      }else if(!Array.isArray(elem.content)){
        const theDisplayingComponent = elementsTypes.find(elementType => elementType.id === elem.type)
  
        return <div className='flex gap-2 items-center cursor-pointer hover:bg-slate-900 py-2' onClick={(e) => {
          e.stopPropagation()
          dispatch({
            type: "CHANGE_CLICKED_ELEMENT",
            payload: {
              elementDetails: elem
            }
          })
        }}>
          {theDisplayingComponent?.Component} {theDisplayingComponent?.label}
        </div>
      }
    })
  
}

export default RecursiveLayoutTree