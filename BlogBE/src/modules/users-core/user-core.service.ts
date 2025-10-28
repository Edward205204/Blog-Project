import { injectable, inject } from 'tsyringe'
import { Prisma, PrismaClient, User } from '~/generated/prisma/client.js'

import { ErrorWithStatus } from '~/shared/utils/error-status.js'

@injectable()
export class UserService {
  constructor(@inject(PrismaClient) private prisma: PrismaClient) {}

  public async checkEmailDoesNotExistOrFail(email: string): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: {
        email
      }
    })
    if (user) {
      throw new ErrorWithStatus(409, 'Email này đã được sử dụng')
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
  public async findUserByEmailOrFail(email: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: {
        email
      }
    })
    if (!user) {
      throw new ErrorWithStatus(404, 'Không tìm thấy người dùng với email này')
    }
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
      throw new ErrorWithStatus(404, 'Không tìm thấy người dùng')
    }
    return user
  }
}
