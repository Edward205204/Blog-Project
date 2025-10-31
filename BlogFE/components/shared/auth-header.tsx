import URL from '@/constants/url'
import { HomeIcon } from 'lucide-react'

export default function AuthHeader() {
  return (
    <div className='flex justify-center gap-2 md:justify-start'>
      <a href={URL.HOME} className='flex items-center gap-2 font-medium'>
        <div className='bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md'>
          <HomeIcon className='size-4' />
        </div>
        Welcome to our blog
      </a>
    </div>
  )
}
