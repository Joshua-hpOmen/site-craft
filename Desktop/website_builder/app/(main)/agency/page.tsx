import AgencyDetails from '@/components/forms/AgencyDetails'
import { getUserAuthDetails, verifyAndAcceptInvitation } from '@/lib/queries'
import { currentUser } from '@clerk/nextjs/server'
import { Plan } from '@prisma/client'
import { redirect } from 'next/navigation'
import React from 'react'

type Props = {
  searchParams : { plan: Plan, state : string, code: string} //plan from prisma which is basically which plan on stripe based on their subscription
                                                             // state has to do with stripe connect
}

const page = async (props: Props) => {

  const searchParams = await props.searchParams

    // Dont forget to add functionality for guest accounts, what is meant by that is subaccount user allowing guest(eg. Customers, etc) to have the ability to come in but not have the ability to edit or make changes
      
    const agencyId = await verifyAndAcceptInvitation();

    //user logic
    const user = await getUserAuthDetails();

    if(agencyId){
      if(user?.role === 'SUBACCOUNT_GUEST' || user?.role === 'SUBACCOUNT_USER'){ // Subaccount guest not yet created(functionality not yet created own side project).
          return redirect('/subaccount') // idk if this is correct comeback and explain
      }else if(user?.role === 'AGENCY_ADMIN' || user?.role === 'AGENCY_OWNER'){

          if(await searchParams.plan){
            return redirect(`agency/${agencyId}/billing?plan=${searchParams.plan}`)
          }else if(await searchParams.state){ // come back and change this cause as of 22/01/2025 i dont really understand entirely what this does
            const statePath = searchParams.state.split('___')[0];
            const stateAgencyId = searchParams.state.split('___')[1];

            if(!stateAgencyId) return redirect("/unauthorised") // Need to create an unauthorised component.

            return redirect(`agency/${stateAgencyId}/${statePath}?code=${searchParams.code}`)// Dont really understand this part since as of 22/01/2025 i dont understand stripe connect but the code is supoosed to stand for something   
          }else{
            return redirect(`/agency/${agencyId}`)
          }
      }else{//Since there are no other roles they are redirected to Unauthorised
        return <div>Not authories</div> //Need unauthorised component
      }
    }

    const authUser = await currentUser();
    if(!authUser) return
  return (
    <div>
      <div className='text-6xl bg-gradient-to-r font-extrabold text-center py-8 from-indigo-100 to-indigo-950 bg-clip-text text-transparent'>
        Create An Agency
      </div>
      <AgencyDetails data={{companyEmail: authUser.emailAddresses[0].emailAddress}} />
    </div>
  )
}

export default page