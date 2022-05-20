import ejs from 'ejs'
import type { IUser } from '../../../../../../common/src/modules/auth/interfaces/auth.interfaces'
import { pathTemplate, renderDataConfig, transporter } from '../config/node-mailer'



export interface SendEmailData {
  user: Pick<IUser, 'username' | 'email'>
  token: string
  template: 'welcome' | 'forgotPassword' | 'resetPassword'
}

export const sendEmail = async ({ user, template, token = '' }: SendEmailData): Promise<void> => {
  const redirectURL = `${renderDataConfig[template].endpoint}${token}`
  const btnLabel = renderDataConfig[template].btnLabel

  const renderData = { template, user: user.username, redirectURL, btnLabel }

  const htmlContent = await ejs.renderFile(pathTemplate, renderData)

  await transporter.sendMail({
    from: '"Auth-Example" <exampple.app@outlook.com>',
    to: `${user.email}`,
    subject: 'Hello ✔',
    text: 'Hello world?',
    html: htmlContent
  })
}

export const NodeMailerService = {
  send: sendEmail
}