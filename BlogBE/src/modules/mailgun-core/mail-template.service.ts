import fs from 'fs'
import path from 'path'
import Handlebars from 'handlebars'
import { singleton } from 'tsyringe'

@singleton()
export class MailTemplateService {
  private templates: Record<string, Handlebars.TemplateDelegate> = {}

  constructor() {
    const templatesDir = path.join(__dirname, '../../templates/mails')

    fs.readdirSync(templatesDir).forEach((file) => {
      if (file.endsWith('.html')) {
        const content = fs.readFileSync(path.join(templatesDir, file), 'utf-8')
        const name = path.basename(file, '.html')
        this.templates[name] = Handlebars.compile(content)
      }
    })
  }

  render(templateName: string, data: Record<string, any>): string {
    const template = this.templates[templateName]
    if (!template) throw new Error(`Template ${templateName} not found`)
    return template(data)
  }
}
