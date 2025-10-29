import { env } from '~/config/env.js'
import { TokenType } from '~/generated/prisma/enums.js'
import { ErrorWithStatus } from './error-status.js'
import { HTTP_STATUS } from '~/constants/http-status.js'

const tokenSecrets: Record<TokenType, string> = {
  [TokenType.email_verification]: env.EMAIL_VERIFICATION_TOKEN_SECRET,
  [TokenType.access]: env.ACCESS_TOKEN_SECRET,
  [TokenType.refresh]: env.REFRESH_TOKEN_SECRET,
  [TokenType.reset_password]: env.RESET_PASSWORD_TOKEN_SECRET
}

export const getTokenSecret = (tokenType: TokenType): string => {
  const secret = tokenSecrets[tokenType]
  if (!secret) throw new ErrorWithStatus(HTTP_STATUS.INTERNAL_SERVER_ERROR, 'Invalid token type')
  return secret
}
