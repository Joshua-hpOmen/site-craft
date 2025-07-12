import { createUploadthing, FileRouter } from "uploadthing/next";
import { auth } from "@clerk/nextjs/server";

const f = createUploadthing();

const authenticateUser = async () => {
  const user = await auth();
  if (!user) throw new Error("Unauthorized");
  // accessible in onUploadComplete as `metadata`
  return user;
};

// FileRouter for your app, can contain multiple FileRoutes
export const OurFileRouter = {
  subAccountLogo: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(authenticateUser)
    .onUploadComplete(async () => {}),
  avatar: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(authenticateUser)
    .onUploadComplete(async () => {}),
  agencyLogo: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(authenticateUser)
    .onUploadComplete(async () => {}),
  media: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(authenticateUser)
    .onUploadComplete(async () => {}),
} satisfies FileRouter;

export type OurFileRouter = typeof OurFileRouter;