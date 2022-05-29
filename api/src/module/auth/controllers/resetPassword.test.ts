import * as Guards from "@auth/guards"
import * as AppError from "@error"
import { cryptService, TokenService } from "@auth/services"
import { EmailService } from "@notifier/email/services"
import { UserService } from "@user/services"
import { execController } from "utils/tests/constants/functions"
import { mockRequest, mockResponse, mockToken, mockUser } from "utils/tests/constants/mocks"
import { resetPassword } from "./resetPassword"

describe('.resetPassword - controller', () => {

  const tokenService = TokenService()
  const userService = UserService()

  const agentGuardSpy = jest.spyOn(Guards, 'UserAgentGuard')
  const userFindOneAndUpdateSpy = jest.spyOn(userService, 'findOneAndUpdate').mockReturnValueOnce(mockUser as any)
  const signSpy = jest.spyOn(cryptService, 'sign')
    .mockImplementationOnce(() => 'new_access_token')
    .mockImplementationOnce(() => 'new_refresh_token')
  const hashSpy = jest.spyOn(cryptService, 'hash')
  const tokenCreateSpy = jest.spyOn(tokenService, 'create').mockReturnValue(mockToken as any)
  const emailSendSpy = jest.spyOn(EmailService, 'send').mockResolvedValueOnce(Promise.resolve())

  const runResetPassword = async () =>
    await execController(resetPassword({
      tokenService,
      userService
    }))

  describe('Success Operation', () => {
    beforeAll(async () => {
      await runResetPassword()
    })

    it('should call userAgentGuard with rt', () => {
      expect(agentGuardSpy).toHaveBeenCalledWith(mockRequest)
    })
    it('should call cryptService.hash with password', () => {
      expect(hashSpy).toHaveBeenCalledWith(mockRequest.body.password)
      expect(hashSpy).toHaveBeenCalledTimes(1)
    })
    it('should call user.findOneAndUpdate', async () => {
      const hashedPassword = hashSpy.mock?.results[0]?.value
      expect(userFindOneAndUpdateSpy).toHaveBeenCalledWith({ id: mockToken.user }, { password: hashedPassword })
    })
    // TODO: Repeated in a lot of tests - Refactor in a helper
    it('should call cryptService.sign', async () => {
      expect(signSpy).toHaveBeenCalledWith({ data: { username: mockUser.username, roles: null } })
      expect(signSpy).toHaveBeenCalledWith({ data: mockUser.id, refresh: true })
      expect(signSpy).toHaveBeenCalledTimes(2)
    })
    it('should call tokenService.create', async () => {
      expect(tokenCreateSpy).toHaveBeenCalledWith({ token: 'new_refresh_token', user: mockToken.user, agent: mockToken.agent })
      expect(tokenCreateSpy).toHaveBeenCalledTimes(1)
    })
    it('should call res.cookie', async () => {
      expect(mockResponse.cookie).toHaveBeenCalledWith('rt', 'new_refresh_token', {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7,
        sameSite: 'strict',
        secure: true
      })
      expect(mockResponse.cookie).toHaveBeenCalledTimes(1)
    })
    // TODO: END
    it('should call EmailService.send', async () => {
      const newAccessToken = signSpy.mock?.results[0]?.value
      if (!newAccessToken) throw new Error('Invalid test, newAccessToken not found')

      expect(emailSendSpy).toHaveBeenCalledWith({
        template: 'resetPassword',
        user: mockUser,
        token: newAccessToken
      })
    })
    it('should call res.status with 200', async () => {
      expect(mockResponse.status).toHaveBeenCalledWith(200)
    })
  })

  describe('Error cases', () => {
    const errorApp = jest.spyOn(AppError, 'AppError')

    beforeEach(() => {
      jest.clearAllMocks()
    })

    it('should throw a error if user not founded to be updated', async () => {
      userFindOneAndUpdateSpy.mockResolvedValueOnce(null)
      await runResetPassword()
      expect(errorApp).toHaveBeenCalledWith('User not found', 404)
    })
  })
})