import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ThemeProvider } from "@/components/global/theme-provider"
import QueryProvider from "@/components/global/query-provider";
import { Toaster } from "@/components/ui/toaster"
import { Providers } from './providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'DormTrack',
  description: 'A modern hostel management platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <body className={`${inter.className} h-full`}>
        <Providers>
          {/* <QueryProvider> */}
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              {children}
            </ThemeProvider>
          {/* </QueryProvider> */}
        </Providers>
        <Toaster />
      </body>
    </html>
  )
}
