import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Analytics } from '@vercel/analytics/react'
import Link from 'next/link'
import './globals.css'
import Navbar from "@/components/navbar"

export const metadata: Metadata = {
  title: "LoopOut",
  description: "Sistem Manajemen Tiket IT",
  icons: {
    icon: "/Welcome.gif",
},
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  )
}