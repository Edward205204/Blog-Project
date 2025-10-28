import { singleton } from 'tsyringe'
import { PrismaClient } from '~/generated/prisma/client.js'

@singleton()
export class PrismaService extends PrismaClient {
  constructor() {
    super()
  }
}
