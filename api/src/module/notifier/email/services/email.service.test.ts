import { mockUser } from "utils/tests/constants/mocks"
import EmailService from "./email.service"

describe('email service', () => {
  const token = 'token'
  const template = 'welcome'
  const sendEmail = jest.spyOn(EmailService, 'send').mockImplementation(() => Promise.resolve())

  it('should send email', async () => {
    await EmailService.send({
      user: mockUser,
      template,
      token
    })

    expect(sendEmail).toHaveBeenCalledWith({
      user: mockUser,
      template,
      token
    })
  })
})