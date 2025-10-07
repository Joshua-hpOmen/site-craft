"use client"
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card'
import { CheckCircle2Icon, Clipboard } from 'lucide-react'
import React from 'react'

const UserInfo = () => {

    const [selectedEmail, setSelectedEmail] = React.useState(false)
    const [selectedPassword, setSelectedPassword] = React.useState(false)

  return <div className='flex gap-3'>
  
    <Card className='p-4 bg-muted'>
        <CardTitle className='text-center'>User Info</CardTitle> <br />
        <CardContent>
            <span>Email: </span>
            <CardDescription className='flex items-center flex-row-reverse gap-2 justify-center '>
                {!selectedEmail ? <Clipboard className='cursor-pointer' size={17} onClick={() => {
                      window.navigator.clipboard.writeText("email1@gmail.com");
                      setSelectedEmail(true);
                      setTimeout(() => setSelectedEmail(false), 1000)
                  }
                }/> : <span className='border rounded-full'>
                    <CheckCircle2Icon size={17}/>    
                </span>}
                email1@gmail.com
            </CardDescription>
        </CardContent>
        <CardContent>
            <span>Password: </span>
            <CardDescription className='flex items-center flex-row-reverse gap-2 justify-center '>
                {!selectedPassword ? <Clipboard className='cursor-pointer' size={17} onClick={() => {
                    window.navigator.clipboard.writeText("email@@password1@@");
                    setSelectedPassword(true);
                    setTimeout(() => setSelectedPassword(false), 1000)
                } }/> : <span className='border rounded-full'>
                    <CheckCircle2Icon size={17}/>    
                </span>}
                email@@password1@@

            </CardDescription>
        </CardContent>
    </Card>
        
  </div>
}

export default UserInfo