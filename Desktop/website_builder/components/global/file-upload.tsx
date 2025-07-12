import { FileIcon, X } from 'lucide-react';
import Image from 'next/image';
import React from 'react'
import { Button } from '../ui/button';
import { OurFileRouter } from '@/app/api/uploadthing/core';
import { UploadDropzone } from '@/lib/uploadthing';
import { Suspense } from 'react';

type Props = {
    apiEndpoint: string,
    onChange: (url?: string) => void,
    value?:string
}

const checkIfImage = (imageType?: string) => {
  switch (imageType) {
    case '"jpg"':
    case '"jpeg"':
    case '"png"':
    case '"svg"':
    case '"pdf"':
      return true;
    default:
      return false;
  }
};

const FileUpload = (props: Props) => {

  const [imageType, setImageType] = React.useState<string>("");
  if (props.value){
    return (
      <div className='flex justify-center items-center flex-col'>
        {(checkIfImage(imageType) || Boolean(props.value.search(new RegExp("https://img.clerk.com/", "i")) !== -1))? <div className='relative w-[80%] h-[200px] flex justify-center items-center my-5 border-white border-dashed border-2'>
              <Image alt="Uploaded Image" src={props.value} className='object-contain rounded-md' sizes='(max-width: 768px) 400px, (max-width: 1200px) 800px, 650px' fill/>
            </div> : <div className='flex flex-row gap-3 justify-center items-center my-3'>
            <FileIcon/>
            <a href={props.value} target='_blank' rel='noopener noreferrer' className='self-end hover:underline ml-2 text-sm text-indigo-500 dark:text-indigo-400'>View Image</a>
        </div>}
            <Button variant="ghost" type="button" onClick={() => props.onChange("")}>
              <X className='h-4 w-4'/>
              Remove Logo
            </Button>
          
      </div>
    )
    
  }

  return (
    <div className='border-gray-600 border-2 rounded-md mt-4'>
      {/* @ts-ignore */}
      <UploadDropzone<OurFileRouter>
        endpoint={props.apiEndpoint}

        onClientUploadComplete={(res) => {
            console.log(res[0].url)
            if(!res || !res.length) return
            let url;
            if(res?.[0].url.startsWith("http://localhost")){
              url = res?.[0].url.split("url=").pop()
            }else{
              url = res?.[0].url
            }
            props.onChange(url)
            setImageType(JSON.stringify(res?.[0].name.split('.').pop()))
        }}

        onUploadError={(err : Error) => {
          console.log(err)
          props.onChange("")
        }}
      />
    </div>
  )
}

export default FileUpload