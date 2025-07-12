"use client"
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card'
import { Clipboard } from 'lucide-react'
import React from 'react'

const UserInfo = () => {
  return (<div className='flex gap-3'>
  
    <Card className='p-4 bg-muted'>
        <CardTitle className='text-center'>User Info</CardTitle> <br />
        <CardContent>
            <span>Email: </span>
            <CardDescription className='flex items-center flex-row-reverse gap-2 justify-center '><Clipboard className='cursor-pointer' size={17} onClick={() => window.navigator.clipboard.writeText("email1@gmail.com")}/>email1@gmail.com</CardDescription>
        </CardContent>
        <CardContent>
            <span>Password: </span>
            <CardDescription className='flex items-center flex-row-reverse gap-2 justify-center '><Clipboard className='cursor-pointer' size={17} onClick={() => window.navigator.clipboard.writeText("email@@password1@@")}/>email@@password1@@</CardDescription>
        </CardContent>
        </Card>

        <Card className='p-4 bg-muted'>
        <CardTitle className='text-center'>User Info</CardTitle> <br />
        <CardContent>
            <span>Email: </span>
            <CardDescription className='flex items-center flex-row-reverse gap-2 justify-center '><Clipboard className='cursor-pointer' size={17} onClick={() => window.navigator.clipboard.writeText("email2@gmail.com")}/>email2@gmail.com</CardDescription>
        </CardContent>
        <CardContent>
            <span>Password: </span>
            <CardDescription className='flex items-center flex-row-reverse gap-2 justify-center '><Clipboard className='cursor-pointer' size={17} onClick={() => window.navigator.clipboard.writeText("email@@password2@@")}/>email@@password2@@</CardDescription>
        </CardContent>
        </Card>
  </div>)
}

export default UserInfo