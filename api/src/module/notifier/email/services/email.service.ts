
import { NodeMailerService, SendEmailData } from './node-mailer'

interface IEmailService {
  send: ({ user, template, token }: SendEmailData) => Promise<void>
}


class EmailService implements IEmailService {
  private emailProvider: IEmailService
  constructor(emailProvider: IEmailService = NodeMailerService) {
    this.emailProvider = emailProvider
  }

  async send({ user, template, token = '' }: SendEmailData) {
    return await this.emailProvider.send({ user, template, token })
  }
}
const emailService = new EmailService(NodeMailerService)
export { emailService }
export default new EmailService()