import { Button } from './button'

interface SubmitButtonProps {
  pending: boolean
  text: string
}

export function SubmitButton({ pending, text }: SubmitButtonProps) {
  return (
    <Button type='submit' disabled={pending}>
      {pending ? 'Loading...' : text}
    </Button>
  )
}
