import { Button } from './button'

interface SubmitButtonProps {
  pending: boolean
}

export function SubmitButton({ pending }: SubmitButtonProps) {
  return (
    <Button type='submit' disabled={pending}>
      {pending ? 'Đang đăng nhập...' : 'Đăng nhập'}
    </Button>
  )
}
