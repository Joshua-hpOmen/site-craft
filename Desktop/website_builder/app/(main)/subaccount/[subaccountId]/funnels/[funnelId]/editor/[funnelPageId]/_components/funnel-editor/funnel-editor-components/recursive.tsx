import { EditorElement } from '@/providers/editor/editor-provider'
import React from 'react'
import TextComponent from './text'
import Container from './container'
import VideoComponent from './VideoComponent'
import TwoColoumnsComponent from './TwoColoumnsComponent'
import LinkComponent from './LinkComponent'
import ContactForm from './ContactForm'
import ThreeColoumnComponent from './ThreeColoumnComponent'
import ImageComponent from './ImageComponent'
import PaymentComponent from './PaymentComponent'
import CustomComponent from './CustomComponent'

type Props = {
    element: EditorElement
}

const Recursive = (props: Props) => {

    switch (props.element.type) {
        case "text":
            return <TextComponent element={props.element} />//🔴Completed
        case "__body":
            return <Container element={props.element}/>//🔴Completed
        case "container":
            return <Container element={props.element}/>//🔴Completed
        case "video":
            return <VideoComponent element={props.element}/>//🔴Completed
        case "2Col": 
            return <TwoColoumnsComponent element={props.element}/>//🔴Completed
        case "link":
            return <LinkComponent element={props.element}/>//🔴Completed
        case "contactForm":
            return <ContactForm element={props.element}/>//🔴Completed
        case "3Col":
            return <ThreeColoumnComponent element={props.element}/>//🔴Completed
        case "image":
            return <ImageComponent element={props.element}/>//🔴Completed
        case "paymentForm":
            return <PaymentComponent element={props.element}/>
        case "custom":
            return <CustomComponent element={props.element}/>
        default:
            return null
    }


}

export default Recursive