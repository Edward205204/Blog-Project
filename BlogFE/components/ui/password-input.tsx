'use client'

import { cn } from '@/lib/utils'
import { EyeIcon, EyeOffIcon } from 'lucide-react'
import { Input } from './input'
import { useState } from 'react'

interface PasswordInputProps extends React.ComponentProps<'input'> {
  wrapperClassName?: string
  inputClassName?: string
  iconClassName?: string
}

export default function PasswordInput({
  wrapperClassName,
  inputClassName,
  iconClassName,
  type = 'password',
  ...props
}: PasswordInputProps) {
  const [inputType, setInputType] = useState<'password' | 'text'>(type as 'password' | 'text')
  return (
    <div className={cn('relative', wrapperClassName)}>
      <Input type={inputType} className={cn(inputClassName)} {...props} />
      {inputType === 'password' ? (
        <EyeIcon
          className={cn('absolute right-2 top-1/2 -translate-y-1/2 size-4 cursor-pointer select-none', iconClassName)}
          onClick={() => setInputType('text')}
        />
      ) : (
        <EyeOffIcon
          className={cn('absolute right-2 top-1/2 -translate-y-1/2 size-4 cursor-pointer select-none', iconClassName)}
          onClick={() => setInputType('password')}
        />
      )}
    </div>
  )
}
