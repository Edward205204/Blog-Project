import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { CONFIG_ENV } from '@/constants/config.env'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin']
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin']
})

export const metadata: Metadata = {
  metadataBase: new URL(CONFIG_ENV.FE_URL),

  title: {
    template: '%s | Blog Website',
    default: 'Blog Website'
  },
  description: 'Trang Blog chia sẻ kiến thức về lập trình',

  openGraph: {
    title: 'Blog Website',
    description: 'Trang Blog chia sẻ kiến thức về lập trình',
    siteName: 'Blog Website'
  }
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='vi'>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>{children}</body>
    </html>
  )
}
