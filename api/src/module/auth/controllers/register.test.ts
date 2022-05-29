import * as Guards from "@auth/guards"
import { cryptService, TokenService } from "@auth/services"
import { execController } from "utils/tests/constants/functions"
import { mockRequest, mockResponse, mockToken, mockUser } from "utils/tests/constants/mocks"
import { UserService } from "@user/services"
import { EmailService } from "@notifier/email/services"
import { register } from "./register"

describe('.register - controller', () => {

  const tokenService = TokenService()
  const userService = UserService()

  const userAgentGuardSpy = jest.spyOn(Guards, 'UserAgentGuard')
  const userCreateSpy = jest.spyOn(userService, 'create')
  const tokenCreateSpy = jest.spyOn(tokenService, 'create')
  const signSpy = jest.spyOn(cryptService, 'sign')
  const emailSendSpy = jest.spyOn(EmailService, 'send')


  // const tokenRevokeSpy = jest.spyOn(tokenService, 'revoke')
  const tokenFindOneSpy = jest.spyOn(tokenService, 'findOne')

  const runRegister = async () =>
    await execController(register({
      tokenService,
      userService
    }))

  describe('Success Operation', () => {

    beforeAll(async () => {
      tokenFindOneSpy.mockReturnValueOnce(mockToken as any)
      tokenCreateSpy.mockReturnValue(mockToken as any)
      signSpy.mockImplementationOnce(() => 'new_access_token')
        .mockImplementationOnce(() => 'new_refresh_token')
      userCreateSpy.mockReturnValue(mockUser as any)
      emailSendSpy.mockResolvedValueOnce(Promise.resolve())

      await runRegister()
    })

    it('should call userAgentGuard with rt', () => {
      expect(userAgentGuardSpy).toHaveBeenCalledWith(mockRequest)
    })
    it('should call user.create with body', () => {
      expect(userCreateSpy).toHaveBeenCalledWith({
        username: mockRequest.body.username,
        email: mockRequest.body.email,
        password: mockRequest.body.password
      })
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
      expect(emailSendSpy).toHaveBeenCalledWith({
        template: 'welcome',
        user: { username: mockUser.username, email: mockUser.email },
        token: 'new_access_token'
      })
    })
    it('should call res.status with 200', async () => {
      expect(mockResponse.status).toHaveBeenCalledWith(200)
    })
  })

  // describe('Error cases', () => {
  //   const errorApp = jest.spyOn(AppError, 'AppError')
  //   const cryptVerifySpy = jest.spyOn(cryptService, 'verify')

  //   beforeEach(async () => {
  //     jest.clearAllMocks()
  //   })

  //   it('should throw a error if refresh token is not found and verification is NOT valid', async () => {
  //     tokenFindOneSpy.mockResolvedValueOnce(null)
  //     cryptVerifySpy.mockReturnValueOnce(null)

  //     await runRegister()
  //     expect(tokenFindOneSpy).toHaveBeenCalledWith({ token: mockRequest.cookies.rt })
  //     expect(tokenFindOneSpy).toHaveBeenCalledTimes(1)

  //     expect(cryptVerifySpy).toHaveBeenCalledTimes(1)
  //     expect(cryptVerifySpy).toHaveBeenCalledWith({ token: mockRequest.cookies.rt, refresh: true })

  //     expect(errorApp).toHaveBeenCalledWith('No Content', 404)
  //   })
  //   it('should throw a error if refresh token is not found and verification is valid', async () => {
  //     tokenFindOneSpy.mockReturnValueOnce(Promise.resolve(null))

  //     cryptVerifySpy.mockReturnValueOnce({ data: mockUser.id } as any)
  //     userFindByIdSpy.mockReturnValueOnce(Promise.resolve(mockUser as any))
  //     const tokenRevokeAllSpy = jest.spyOn(tokenService, 'revokeAll').mockReturnValue(Promise.resolve())
  //     await runRegister()

  //     expect(cryptVerifySpy).toHaveBeenCalledTimes(1)
  //     expect(cryptVerifySpy).toHaveBeenCalledWith({ token: mockRequest.cookies.rt, refresh: true })

  //     expect(userFindByIdSpy).toHaveBeenCalledTimes(1)
  //     expect(userFindByIdSpy).toHaveBeenCalledWith({ id: mockUser.id })

  //     expect(tokenRevokeAllSpy).toHaveBeenCalledWith({ user: mockUser.id })
  //     expect(tokenRevokeAllSpy).toHaveBeenCalledTimes(1)
  //     expect(errorApp).toHaveBeenCalledWith('No Content', 404)

  //   })
  //   it('should throw a error if user is not found in storage', async () => {
  //     tokenFindOneSpy.mockReturnValueOnce(mockToken as any)
  //     userFindByIdSpy.mockReturnValueOnce(Promise.resolve(null))

  //     await runRegister()
  //     expect(tokenFindOneSpy).toHaveBeenCalledWith({ token: mockRequest.cookies.rt })
  //     expect(errorApp).toHaveBeenCalledWith('User not found', 404)
  //   })
  // })
})