// Not needed anymore!

"use server"
import React from 'react'
import { saveActLogNotification, updateAgencyDetails } from '@/lib/queries';

type Props = {
    onChange: () => void,
    id?: string,
    value: number
}

const Goal = (props: Props) => {
  return (
    <input  type='number' placeholder='Sub Account Goal' className='w-[100%] bg-transparent py-4 border-2 bg-black pl-4 rounded-md my-4 focus-visible:border-4 focus-visible:outline-none' value={props.value} onChange={async () => {
        props.onChange();
        if(!props.id) return;
        await updateAgencyDetails(props.id, {goal : props.value})
        await saveActLogNotification({agencyId: props.id, description: `Updated the agenct goal to | ${props.value}`})
    }}/>
  )
}

export default Goal

