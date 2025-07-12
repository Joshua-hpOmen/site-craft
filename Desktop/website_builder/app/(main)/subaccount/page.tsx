import { getUserAuthDetails, verifyAndAcceptInvitation } from '@/lib/queries'
import { redirect } from 'next/navigation'
import React from 'react'

type Props = {
  searchParams: {state: string, code: string} // Stripe
}

const page = async (props: Props) => {
  const agencyId = await verifyAndAcceptInvitation()

  if(!agencyId) return redirect("/unauthorised")
  const user = await getUserAuthDetails()
  if(!user)return

  const getSubaccountWithAccess = user.Permissions.find(permission => permission.access === true)

  if(props.searchParams.state){
    const statePath = props.searchParams.state.split("___")[0]
    const stateSubaccountId = props.searchParams.state.split("___")[1]
    if(!stateSubaccountId) return redirect("/unauthorised")
    return redirect(`/subaccount/${stateSubaccountId}/${statePath}?code=${props.searchParams.code}`)
  }

  if(getSubaccountWithAccess) return redirect(`/subaccount/${getSubaccountWithAccess.subAccountId}`)

  return redirect("/unauthorised")
}

export default page