import { injectable } from 'tsyringe'
import { PrismaClient } from '~/generated/prisma/client.js'

@injectable()
export class PrismaService extends PrismaClient {
  constructor() {
    super()
  }
}
