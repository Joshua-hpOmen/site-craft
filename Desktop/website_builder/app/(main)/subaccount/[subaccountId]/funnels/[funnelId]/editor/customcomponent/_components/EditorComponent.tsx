"use client"
import { GeneralNavBarConxtext } from '@/providers/nav-bar'
import { Editor } from '@monaco-editor/react'
import { LaptopIcon,Smartphone, TabletIcon } from 'lucide-react'
import React from 'react'

import { createPortal } from 'react-dom'
import { useComponent } from '@/providers/code-editor-provider'
import { Input } from '@/components/ui/input'
import { CustomComponents } from '@prisma/client'
import PreviewComponent from './PreviewComponent'
import { getCustomComponent } from '@/lib/queries'

type Props = {
    component?: string
}

const EditorComponent = (props: Props) => {
    const inputRef = React.useRef<HTMLInputElement>(null)
    const [mounted, setMounted] = React.useState(false)
    const {isVisibleForEditor, setCloseEditor} = React.useContext(GeneralNavBarConxtext)
    const {data, setData} = useComponent()

    const component = React.useMemo(async () => {
        if(!props.component) return
        const dataComponent = await getCustomComponent(props.component)
        if(!dataComponent) return

        return setData({
            code: dataComponent.innerHTML,
            name: dataComponent.name
        })
    }, [props.component])

    React.useEffect(() => {
        setMounted(true)
    }, [])


    if(!mounted) return

    const handleEditorOnchange = (e?: string) => {
        setData(prev => ({
            ...prev,
            code: e
        }))
    }

    const handleEditorWillMount = (monaco: any) => {
        monaco.languages.typescript.javascriptDefaults.setEagerModelSync(true);
    }
  return (
    <main className='h-full flex flex-col my-8 '>
        {isVisibleForEditor && <div className='fixed inset-0' onClick={setCloseEditor}></div>}

        <div className='flex flex-col-reverse lg:flex-row-reverse flex-1 px-4 gap-3 justify-end'>
            <section className='flex justify-center flex-1 min-h-[500px] lg:h-full max-w-[900px] bg-white'> 
                <PreviewComponent code={data.code || "<section>Hello World</section>"}/>
            </section>


            <section className='justify-center flex w-full lg:w-[600px] h-[600px] lg:h-full relative'>

                <div className='w-[30%] absolute -top-10 left-0 z-20 '>
                    <Input className='border-2 border-blue-700 focus-visible:border-none rounded-b-none w-full' ref={inputRef} value={data.name} onChange={(e) => setData(prev => ({...prev, name: e.target.value}))}/>
                    {(inputRef.current?.value === "Untitled" || !inputRef.current?.value) && <div className='absolute right-2 top-3 p-[6px] rounded-full bg-white'></div>}
                </div>

                <Editor height="100%" width="100%" options={{
                    minimap : { enabled : false }
                }} defaultLanguage="html" theme='vs-dark' onChange={(e) => handleEditorOnchange(e)} beforeMount={(monaco) => handleEditorWillMount(monaco)} value={data.code} defaultValue='<section>Hello World</section>'/>

            </section>
        </div>
    </main>
  )
}

export default EditorComponent