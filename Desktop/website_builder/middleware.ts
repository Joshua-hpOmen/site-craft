import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtected = createRouteMatcher(['/subaccount(.*)', '/agency(.*)'])

export default clerkMiddleware(async (auth, req) => {
  const {userId} = await auth();

  if(userId){
    const url = req.nextUrl;
    const searchParams = url.searchParams.toString();
    const hostname = req.headers
    const pathWithSearchParams = `${url.pathname}${searchParams.length > 0 ? `?${searchParams}` : ''}`

    //Checking the subdomain
    const customSubDoman = hostname.get('host')?.split(`${process.env.NEXT_PUBLIC_DOMAIN}`).filter(Boolean)[0];
    if(customSubDoman){
      return NextResponse.rewrite(new URL(`/${customSubDoman}${pathWithSearchParams}`, req.url))
    }else if(url.pathname === '/sign-in' || url.pathname === '/sign-up'){ 
      return NextResponse.redirect(new URL('/agency/sign-in', req.url))
    }else if(url.pathname === '/' || url.pathname === '/site' && url.host === process.env.NEXT_PUBLIC_DOMAIN){
      return NextResponse.rewrite(new URL('/site', req.url))
    }else if (url.pathname.startsWith('/agency') || url.pathname.startsWith('/subaccount')){
      return NextResponse.rewrite(new URL(`${pathWithSearchParams}`, req.url))
    }

  }else if (!userId && isProtected(req)){
    auth.protect()
  }else{
    const url = req.nextUrl;
    const searchParams = url.searchParams.toString();
    const hostname = req.headers
    const pathWithSearchParams = `${url.pathname}${searchParams.length > 0 ? `?${searchParams}` : ''}`

    //Checking the subdomain
    const customSubDoman = hostname.get('host')?.split(`${process.env.NEXT_PUBLIC_DOMAIN}`).filter(Boolean)[0];
    if(customSubDoman){
      return NextResponse.rewrite(new URL(`/${customSubDoman}${pathWithSearchParams}`, req.url))
    }
    if(req.nextUrl.pathname === '/'){
      return NextResponse.rewrite(new URL('/site', req.url))
    }else if (req.nextUrl.pathname === '/sign-in' || req.nextUrl.pathname === '/sign-up'){
      return NextResponse.rewrite(new URL(`/agency${req.nextUrl.pathname}`, req.url))
    }else {
      return NextResponse.redirect(req.url)
    }
  }
  
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};