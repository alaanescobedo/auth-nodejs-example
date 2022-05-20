
import { NodeMailerService, SendEmailData } from './node-mailer'

interface IEmailService {
  send: ({ user, template, token }: SendEmailData) => Promise<void>
}


class EmailService implements IEmailService {
  private emailProvider: IEmailService
  constructor(emailProvider: IEmailService) {
    this.emailProvider = emailProvider
  }

  async send({ user, template, token = '' }: SendEmailData) {
    return await this.emailProvider.send({ user, template, token })
  }
}

export default new EmailService(NodeMailerService)