import AuthHeader from '@/components/shared/auth-header'
import Image from 'next/image'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    template: '%s | Blog Website',
    default: 'Đăng nhập | Blog Website'
  },
  description: 'Đăng nhập vào Blog Website',
  openGraph: {
    title: 'Đăng nhập | Blog Website',
    description: 'Đăng nhập vào Blog Website',
    siteName: 'Blog Website',
    images: ['/login.jpg']
  },
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false
    }
  }
}

export default function AuthLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className='grid min-h-svh lg:grid-cols-5'>
      <header className='flex flex-col gap-4 p-6 md:p-10 col-span-3'>
        <AuthHeader />
        <section className='flex flex-1 items-center justify-center'>
          <div className='w-full max-w-xs'>{children}</div>
        </section>
      </header>
      <figure className='bg-muted relative hidden lg:block col-span-2'>
        <Image
          src='/login.jpg'
          alt='Login background'
          width={500}
          height={500}
          className='absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale'
        />
      </figure>
    </div>
  )
}
