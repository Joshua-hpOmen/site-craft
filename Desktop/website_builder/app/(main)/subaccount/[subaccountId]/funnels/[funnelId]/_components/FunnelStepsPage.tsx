"use client"
import { useModal } from '@/providers/modal-provider'
import { Funnel, FunnelPage } from '@prisma/client'
import { Check, ExternalLink, LucideEdit } from 'lucide-react'
import React from 'react'
import PageDraggable from './PageDraggable'
import CustomModal from '@/components/forms/CustomModal'
import CreateFunnelPageForm from '@/components/forms/CreateFunnelPageForm'
import FunnelPagePlaceholder from '@/components/icons/funnel-page-placeholder'
import Link from 'next/link'

type Props = {
  funnel: Funnel,
  pages: FunnelPage[]
}

const FunnelStepsPage = (props: Props) => {
  const [clickedPage, setClickedPage] = React.useState<FunnelPage | undefined>(props.pages[0])
  const [pagesState, setPagesState] =React.useState(props.pages)
  const {setOpen} = useModal()
  const draggableParentRef = React.useRef<HTMLDivElement>(null)

  return (
    <div className='w-full flex-1 flex flex-col xl:flex-row mb-2'>

      <section className='xl:min-h-full bg-slate-900 flex-[0.4] py-3 px-6 flex flex-col justify-between'>

        <main>
          <header className='flex gap-1 items-center text-xl font-semibold'> <Check/> Funnel Steps</header>

          <div ref={draggableParentRef} className='relative'>
            {!pagesState.length ? <div className="text-center text-muted-foreground py-6"> No Pages </div> : pagesState.map((page, index) => <div key={index} onClick={() => setClickedPage(page)}>
              <PageDraggable activePage={clickedPage?.id === page.id} page={page} index={index} pages={pagesState} setPagesState={setPagesState} draggableParentRef={draggableParentRef} subaccountId={props.funnel.subAccountId} funnnelId={props.funnel.id}/>
            </div>)}
          </div>

        </main>

        <section className='w-full flex justify-center'>

          <button className='px-6 py-3 rounded-md bg-blue-700 my-3' onClick={() => setOpen(
            <CustomModal title=" Create or Update a Funnel Page" subheading="Funnel Pages allow you to create step by step processes for customers to follow">
              <CreateFunnelPageForm subaccountId={props.funnel.subAccountId} funnelId={props.funnel.id} order={pagesState.length}/>
            </CustomModal>
          )}>Create new steps</button>

        </section>


      </section>

      <section className='xl:min-h-full bg-slate-800 xl:flex-[0.6] p-4'>
        {!Boolean(pagesState.length || clickedPage) ?  <div className="h-[600px] flex items-center justify-center text-muted-foreground">
              Create a page to view page settings.
          </div> : <div className='w-full h-full bg-slate-900 px-6 py-3 rounded-md '>
          
            <header>
              <h1 className='text-lg text-muted-foreground'>Page Name</h1>
              <h2 className='text-2xl font-semibold'>{clickedPage?.name}</h2>
            </header>

            <main className='w-full'>

              <Link href={`/subaccount/${props.funnel.subAccountId}/funnels/${props.funnel.id}/editor/${clickedPage?.id}`} className='w-full flex flex-col gap-3 my-5 border-2 border-slate-700 rounded-md p-3 hover:!px-4 hover:!border-slate-600'>
                <div className="cursor-pointer w-full bg-black relative group">
                  <FunnelPagePlaceholder />
                  <LucideEdit size={80} className='absolute opacity-0 group-hover:opacity-100 top-1/2 left-1/2 z-20 text-muted-foreground'/>
                </div>

                <Link target="_blank" onClick={(e) => e.stopPropagation()} className='flex items-center gap-1 ml-2 hover:underline hover:text-blue-700' href={`${process.env.NEXT_PUBLIC_SCHEME}${props.funnel.subDomainName}.${process.env.NEXT_PUBLIC_DOMAIN}/${clickedPage?.pathName}`}>
                  <ExternalLink/> {`${process.env.NEXT_PUBLIC_SCHEME}${props.funnel.subDomainName}.${process.env.NEXT_PUBLIC_DOMAIN}/${clickedPage?.pathName}`}
                </Link>

              </Link>
              
              <div className='w-full border-2 border-slate-700 rounded-md p-4'>
                <CreateFunnelPageForm subaccountId={props.funnel.subAccountId} funnelId={props.funnel.id} defaultData={clickedPage} order={clickedPage?.order || 0} /> 
              </div>

            </main>
          
          </div>}

      </section>
    </div>
  )
}

export default FunnelStepsPage