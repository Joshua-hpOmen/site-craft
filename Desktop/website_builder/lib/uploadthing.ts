import { generateUploadDropzone, generateUploadButton, generateUploader} from "@uploadthing/react";
import { generateReactHelpers } from "@uploadthing/react";
import { OurFileRouter } from "@/app/api/uploadthing/core";

export const UploadDropzone = generateUploadDropzone<OurFileRouter>()
export const UploadButton = generateUploadButton<OurFileRouter>()
export const UploadUploader = generateUploader<OurFileRouter>()

export const { useUploadThing, uploadFiles } = generateReactHelpers<OurFileRouter>();