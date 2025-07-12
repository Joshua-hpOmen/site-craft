import { getUserAuthDetails, verifyAndAcceptInvitation } from '@/lib/queries'
import { redirect } from 'next/navigation'

type Props = {
  searchParams: Promise<{state: string, code: string}> // Stripe
}

const page = async (props: Props) => {
  const searchParams = await props.searchParams
  const agencyId = await verifyAndAcceptInvitation()

  if(!agencyId) return redirect("/unauthorised")
  const user = await getUserAuthDetails()
  if(!user)return

  const getSubaccountWithAccess = user.Permissions.find(permission => permission.access === true)

  if(searchParams.state){
    const statePath = searchParams.state.split("___")[0]
    const stateSubaccountId = searchParams.state.split("___")[1]
    if(!stateSubaccountId) return redirect("/unauthorised")
    return redirect(`/subaccount/${stateSubaccountId}/${statePath}?code=${searchParams.code}`)
  }

  if(getSubaccountWithAccess) return redirect(`/subaccount/${getSubaccountWithAccess.subAccountId}`)

  return redirect("/unauthorised")
}

export default page