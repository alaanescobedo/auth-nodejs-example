import path from 'path'
import nodemailer from 'nodemailer'
import {
  APP_EMAIL_HOST_PRODUCTION,
  APP_EMAIL_PASSWORD_DEVELOPMENT,
  APP_EMAIL_PASSWORD_PRODUCTION,
  APP_EMAIL_PASSWORD_TEST,
  APP_EMAIL_PORT_PRODUCTION,
  APP_EMAIL_USER_DEVELOPMENT,
  APP_EMAIL_USER_PRODUCTION,
  APP_EMAIL_USER_TEST,
  NODE_ENV
} from '../../../../setup/constants'

//* Config Transport
const transports = {
  production: {
    host: APP_EMAIL_HOST_PRODUCTION,
    port: Number(APP_EMAIL_PORT_PRODUCTION), // port for secure SMTP
    secure: false, // true for 465, false for other ports
    tls: {
      ciphers: 'SSLv3'
    },
    auth: {
      user: APP_EMAIL_USER_PRODUCTION,
      pass: APP_EMAIL_PASSWORD_PRODUCTION // generated ethereal password
    }
  },
  development: {
    host: 'smtp.mailtrap.io',
    port: 2525,
    auth: {
      user: APP_EMAIL_USER_DEVELOPMENT,
      pass: APP_EMAIL_PASSWORD_DEVELOPMENT
    }
  },
  test: {
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
      user: APP_EMAIL_USER_TEST,
      pass: APP_EMAIL_PASSWORD_TEST
    }
  }
}
const transport = NODE_ENV === 'production'
  ? transports.production
  : NODE_ENV === 'development'
    ? transports.development
    : transports.test
    
const transporter = nodemailer.createTransport(transport)

//* Config Template
const pathTemplate = path.join(__dirname, '../templates/_base.ejs')

//* Config renderData
const renderDataConfig = {
  welcome: {
    endpoint: `http://localhost:3000/api/v1/auth/verify?token=`,
    btnLabel: 'Verify Email'
  },
  forgotPassword: {
    endpoint: `http://localhost:3000/reset-password?token=`,
    btnLabel: 'Reset Password'
  },
  resetPassword: {
    endpoint: `http://localhost:3000/reset-password?token=`,
    btnLabel: 'Reset Password'
  }
}
export {
  transport,
  pathTemplate,
  transporter,
  renderDataConfig
}
