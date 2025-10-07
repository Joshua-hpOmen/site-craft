import { ExternalLinkIcon } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

type Props = {
    heading: string,
    paragraph: string,
    link: string
}

const ExploreCards = (props: Props) => {
  return (
    <div>
        <h2 className="text-xl font-bold flex gap-1">{props.heading} <Link href={props.link}><ExternalLinkIcon/></Link></h2> 
        <br />
        <p className="text-sm text-muted-foreground">{props.paragraph}</p>
    </div>
  )
}

export default ExploreCards