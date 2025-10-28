export interface IMailgunService {
  sendMail(to: string, type: MailType, data: Record<string, any>): Promise<void>
}

export interface SendMailOptions {
  type: MailType
  to: string
  subject: string
  text: string
  html?: string
}

export enum MailType {
  VERIFY_EMAIL = 'verify_email',
  RESET_PASSWORD = 'reset_password',
  NOTIFICATION = 'notification'
}
