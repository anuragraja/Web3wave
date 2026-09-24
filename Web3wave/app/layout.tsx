import type { Metadata } from 'next'
import { jakarta, spaceGrotesk, jetbrains } from './fonts'
import './globals.css'
import { ScrollToTop } from '@/components/ScrollToTop'
import { SmoothScroll } from '@/components/SmoothScroll'

export const metadata: Metadata = {
  title: "Web3Wave — The Onchain & AI Builder Network",
  description: "The epicenter of Web3, AI & open-source software development. A vibrant ecosystem for developers, founders, creators, and curious builders.",
  keywords: ["Web3Wave", "Web3 Community", "Developers", "Blockchain", "MANIT Web3", "MP Startups", "India Web3"],
  authors: [{ name: "Web3Wave Community" }],
  icons: {
    icon: "/icon.svg",
    apple: "/apple-icon.png",
  },
  openGraph: {
    title: "Web3Wave — Building the Onchain Future",
    description: "Connect with developers, founders, creators, and builders shaping the web3 & AI ecosystem.",
    url: "https://web3wave.in",
    siteName: "Web3Wave",
    locale: "en_US",
    type: "website",
  },
}

import { AuthProvider } from '@/src/context/AuthContext'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${jakarta.variable} ${spaceGrotesk.variable} ${jetbrains.variable} dark`}>
      <body suppressHydrationWarning className="antialiased bg-[#0d0d10] text-[#f4f4f6] min-h-screen relative selection:bg-rose-500/30 selection:text-white">
        <AuthProvider>
          <SmoothScroll>
            <ScrollToTop />
            {children}
          </SmoothScroll>
        </AuthProvider>
      </body>
    </html>
  )
}

