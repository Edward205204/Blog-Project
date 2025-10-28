import { injectable, inject } from 'tsyringe'
import { Prisma, User } from '~/generated/prisma/client.js'

import { ErrorWithStatus } from '~/shared/utils/error-status.js'
import { PrismaService } from '../prisma-core/prisma.service.js'
import { HTTP_STATUS } from '~/constants/http-status.js'

@injectable()
export class UserService {
  constructor(@inject(PrismaService) private prisma: PrismaService) {}

  public async checkEmailDoesNotExistOrFail(email: string): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: {
        email
      }
    })
    if (user) {
      throw new ErrorWithStatus(HTTP_STATUS.CONFLICT, 'Email is already in use')
    }
  }

  public async createUser(data: Prisma.UserCreateInput): Promise<User> {
    const user = await this.prisma.user.create({
      data
    })
    return user
  }

  /**
   * Tìm user bằng email.
   * Nếu KHÔNG có, ném lỗi 404 (Not Found).
   */
  public async findUserByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        email
      }
    })

    return user
  }

  /**
   * Tìm user bằng ID.
   * Nếu KHÔNG có, ném lỗi 404.
   */
  public async findUserByIdOrFail(id: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: {
        id
      }
    })
    if (!user) {
      throw new ErrorWithStatus(HTTP_STATUS.NOT_FOUND, 'User not found')
    }
    return user
  }
}
