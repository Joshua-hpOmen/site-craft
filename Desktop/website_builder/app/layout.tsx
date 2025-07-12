import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import {ClerkProvider} from '@clerk/nextjs'
import { ThemeProvider } from "@/components/theme-provider";
import ModalProvider from "@/providers/modal-provider";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SiteCraft",
  description: "All In One Solution for Agencies",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      
      <html lang="en" suppressHydrationWarning>
          <ClerkProvider>
            <body
              className={`${geistSans.variable} ${geistMono.variable} antialiased`}
              >
              <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
                <ModalProvider>
                  {children}
                  <Toaster/>
                </ModalProvider>
              </ThemeProvider>
            </body>
          </ClerkProvider>
      </html>
  );
}
