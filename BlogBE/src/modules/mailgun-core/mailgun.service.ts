import { inject, singleton } from 'tsyringe'
import { IMailgunService, MailType } from './mailgun.dto.js'
import nodemailer, { Transporter } from 'nodemailer'
import { MailTemplateService } from './mail-template.service.js'
import { env } from '~/config/env.js'
import { LoggerService } from '../logger-core/logger.service.js'

@singleton()
export class MailgunService implements IMailgunService {
  private transporter: Transporter

  constructor(
    @inject(MailTemplateService) private templateService: MailTemplateService,
    @inject(LoggerService) private logger: LoggerService
  ) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASS
      }
    })
  }

  async sendMail(to: string, type: MailType, data: Record<string, any>): Promise<void> {
    const html = this.templateService.render(type, data)

    await this.transporter.sendMail({
      from: `No Reply <${process.env.SMTP_USER}>`,
      to,
      subject: this.getSubject(type),
      html
    })
  }

  private getSubject(type: MailType): string {
    switch (type) {
      case MailType.VERIFY_EMAIL:
        return 'Please verify your email'
      case MailType.RESET_PASSWORD:
        return 'Reset your password'
      case MailType.NOTIFICATION:
        return 'Notification from our system'
      default:
        return 'Message from us'
    }
  }
}
