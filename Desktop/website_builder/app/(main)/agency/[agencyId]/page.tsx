import { Progress } from '@/components/ui/progress'
import { db } from '@/lib/db'
import { stripe } from '@/lib/stripe'
import { ChevronLeft, Contact2, DollarSign,  GoalIcon, ShoppingCart } from 'lucide-react'
import React from 'react'
import { AreaChart } from "@tremor/react";
import CircleProgress from '@/components/global/CircleProgress'
import Link from 'next/link'
type Props = {
    params : Promise<{agencyId: string}>,
    searchParams: Promise<{code: string}>
}

const page = async (props: Props) => {
  const params = await props.params;

  let currency = 'USD'
  let sessions
  let totalClosedSessions
  let totalPendingSessions
  let net = 0
  let potentialIncome = 0
  let closingRate = 0
  const currentYear = new Date().getFullYear();
  const startDate = new Date(`${currentYear}-01-01T00:00:00Z`).getTime()/1000
  const endDate = new Date(`${currentYear}-12-31T23:59:59Z`).getTime()/1000

  const agencyDetails = await db.agency.findUnique({where: {id: params.agencyId}})
  if(!agencyDetails) return;

  const subaccounts = await db.subAccount.findMany({ where: {agencyId: params.agencyId} })

  if(agencyDetails.connectAccountId){
    const response = await stripe.accounts.retrieve({ stripeAccount: agencyDetails.connectAccountId })

    currency = response.default_currency?.toUpperCase() || "USD"

    const checkoutSessions = await stripe.checkout.sessions.list({
      created: {gte: startDate, lte: endDate},
      limit: 100
    }, {stripeAccount: agencyDetails.connectAccountId})

    sessions = checkoutSessions.data
    
    totalClosedSessions = checkoutSessions.data.filter(session => session.status === "complete").map(session => ({
      ...session,
      created: new Date(session.created).toLocaleDateString(),
      amount_total: session.amount_total ? session.amount_total /100 : 0
    }))

    totalPendingSessions = checkoutSessions.data.filter(session => session.status === "open").map(session => ({
      ...session,
      created: new Date(session.created).toLocaleDateString(),
      amount_total: session.amount_total ? session.amount_total /100 : 0
    }))

    net = +totalClosedSessions.reduce((accumVal, session) => accumVal + (session.amount_total || 0), 0).toFixed(2)

    potentialIncome = +totalPendingSessions.reduce((accumVal, seesion) => accumVal + (seesion.amount_total || 0), 0).toFixed(2)

    closingRate = + ((totalClosedSessions.length / checkoutSessions.data.length) / 100).toFixed(2) 
  }
  return (
    <div className='relative w-full h-full p-5'>

      {!agencyDetails.connectAccountId && (
        <div className="absolute -top-10 -left-10 right-0 bottom-0 z-10 flex items-center justify-center backdrop-blur-md bg-background/50 flex-col">
          <h1>Connect your stripe</h1>
          <p>You need to connect your stripe account to see metrics</p> <br />

          <div>
            <Link className='flex gap-2 items-center bg-blue-700 px-6 py-3 rounded-md' href={`/agency/${agencyDetails.id}/launchpad`}><ChevronLeft/>Launch Pad</Link>
          </div>

        </div>
      )}

      <h1 className="text-4xl">Dashboard</h1> <br />

      <div className="flex flex-wrap gap-4">

        <div className='w-[350px] relative bg-slate-900 rounded-md p-4'>
          
          <h2 className='text-muted-foreground text-lg flex justify-between items-center mb-3'>Income <DollarSign size={20} className="text-muted-foreground"/></h2>

          <div>
            <header className='text-4xl font-semibold'>{net ? `${currency} ${net.toFixed(2)}` : "$0.00"}</header>

            <small className='text-muted-foreground'>
              For the year: {currentYear}
            </small>

            <p className='text-muted-foreground my-4'>Total revenue generated as reflected in your stripe dashboard.</p>

          </div>

        </div>

        <div className='w-[350px] relative bg-slate-900 rounded-md p-4'>
          
          <h2 className='text-muted-foreground text-lg flex justify-between items-center mb-3'>Potential Income <DollarSign size={20} className="text-muted-foreground"/></h2>

          <div>
            <header className='text-4xl font-semibold'>{potentialIncome ? `${currency} ${potentialIncome.toFixed(2)}` : "$0.00"}</header>

            <small className='text-muted-foreground'>
              For the year: {currentYear}
            </small>

            <p className='text-muted-foreground my-4'>This is how much you can close.</p>

          </div>

        </div>

        <div className='w-[350px] relative bg-slate-900 rounded-md p-4'>
          
          <h2 className='text-muted-foreground text-lg flex justify-between items-center mb-3'>Active Clients <Contact2 size={20} className="text-muted-foreground"/></h2>

          <div>
            <header className='text-4xl font-semibold'>Clients: {subaccounts.length}</header>

            <p className='text-muted-foreground my-4'>Reflects the number of sub accounts you own and manage.</p>

          </div>

        </div>

        <div className='w-[350px] relative bg-slate-900 rounded-md p-4'>
          <header className='text-4xl font-semibold flex justify-between'>Agency Goal <GoalIcon className='text-muted' size={17}/></header>

          <small className='text-muted-foreground my-3'>
            Reflects the number of sub accounts you want to own and manage.
          </small>

          <div className="flex flex-col w-full my-3">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground text-sm">
                Current: {subaccounts.length}
              </span>
              <span className="text-muted-foreground text-sm">
                Goal: {agencyDetails.goal}
              </span>
            </div>
              <Progress value={(subaccounts.length / agencyDetails.goal) * 100} />
            </div>

        </div>


      </div>

      <div className='flex flex-wrap items-start gap-8 my-3'>

        <div className='flex-1'>
          <h1 className='text-2xl my-3 font-semibold'>Transaction History</h1>
          <AreaChart  className="text-sm stroke-primary" data={[ ...(totalClosedSessions || []), ...(totalPendingSessions || []), ]} 
            index="created" categories={['amount_total']} colors={['primary']} yAxisWidth={30} showAnimation={true}/>
        </div>

        <div className='xl:w-[400px] w-full'>
            <h1 className='text-2xl my-3 font-semibold'>Conversions</h1>
            <div>
              <div className='border-2 w-fit border-slate-800 rounded-md p-4'>
                <CircleProgress
                    value={Number(closingRate || 0)}
                    description={
                      <>
                        {sessions && (
                          <div className="flex flex-col">
                            Abandoned
                            <div className="flex gap-2">
                              <ShoppingCart className="text-rose-700" />
                              {sessions.length}
                            </div>
                          </div>
                        )}
                        {totalClosedSessions && (
                          <div className="felx flex-col">
                            Won Carts
                            <div className="flex gap-2">
                              <ShoppingCart className="text-emerald-700" />
                              {totalClosedSessions.length}
                            </div>
                          </div>
                        )}
                      </>
                    }
                  />
              </div>
            </div>
        </div>

      </div>

    </div>
  )
}

export default page