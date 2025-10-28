import { SignOptions, sign, verify } from 'jsonwebtoken'
import { injectable } from 'tsyringe'
import { env } from '~/config/env.js'

@injectable()
export class JwtUtils {
  private defaultSecret = env.ACCESS_TOKEN_SECRET
  private defaultExpiresIn = env.ACCESS_TOKEN_EXPIRES_IN as SignOptions['expiresIn']

  /**
   * Sign payload thành JWT.
   * Có thể override secret và expiresIn khi cần.
   */
  public sign(payload: object, options?: { secret?: string; expiresIn?: SignOptions['expiresIn'] }): string {
    return sign(payload, options?.secret ?? this.defaultSecret, {
      expiresIn: options?.expiresIn ?? this.defaultExpiresIn
    })
  }

  /**
   * Verify JWT.
   * Có thể override secret khi cần.
   * Trả về payload với type generic.
   */
  public verify<T = any>(token: string, secret?: string): T | null {
    try {
      return verify(token, secret ?? this.defaultSecret) as T
    } catch {
      return null
    }
  }
}
