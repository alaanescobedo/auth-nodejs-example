import * as Guards from "@auth/guards"
import * as AppError from "@error"
import { cryptService, TokenService } from "@auth/services"
import { execController } from "utils/tests/constants/functions"
import { mockRequest, mockResponse, mockToken, mockUser } from "utils/tests/constants/mocks"
import { refreshToken } from "./refreshToken"
import { UserService } from "@user/services"

describe('.refreshToken - controller', () => {

  const tokenService = TokenService()
  const userService = UserService()

  const cookieGuardSpy = jest.spyOn(Guards, 'CookieGuard')
  const tokenRevokeSpy = jest.spyOn(tokenService, 'revoke')
  const tokenCreateSpy = jest.spyOn(tokenService, 'create')
  const tokenFindOneSpy = jest.spyOn(tokenService, 'findOne')
  const userFindByIdSpy = jest.spyOn(userService, 'findById')

  const runRefresh = async () =>
    await execController(refreshToken({
      tokenService,
      userService
    }))

  describe('Success Operation', () => {
    const signSpy = jest.spyOn(cryptService, 'sign')

    beforeAll(async () => {
      tokenFindOneSpy.mockReturnValueOnce(mockToken as any)
      tokenCreateSpy.mockReturnValue(mockToken as any)
      signSpy.mockImplementationOnce(() => 'new_access_token')
        .mockImplementationOnce(() => 'new_refresh_token')
      userFindByIdSpy.mockReturnValue(mockUser as any)

      await runRefresh()
    })

    it('should call CookieGuard with rt', () => {
      expect(cookieGuardSpy).toHaveBeenCalledWith(mockRequest.cookies.rt)
    })
    it('should call res.clearCookie', async () => {
      expect(mockResponse.clearCookie).toHaveBeenCalledWith('rt', {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7,
        sameSite: 'strict',
        secure: true
      })
    })
    it('should call token.findOne', async () => {
      expect(tokenFindOneSpy).toHaveBeenCalledWith({ token: mockRequest.cookies.rt })
    })
    it('should call token.revoke', async () => {
      expect(tokenRevokeSpy).toHaveBeenCalledWith({ token: mockRequest.cookies.rt })
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
    it('should call user.findById', async () => {
      expect(userFindByIdSpy).toHaveBeenCalledWith({ id: mockToken.user })
      expect(userFindByIdSpy).toHaveBeenCalledTimes(1)
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
    it('should return a 200 status code', async () => {
      expect(mockResponse.status).toHaveBeenCalledWith(200)
    })
  })

  describe('Error cases', () => {
    const errorApp = jest.spyOn(AppError, 'AppError')
    const cryptVerifySpy = jest.spyOn(cryptService, 'verify')

    beforeEach(async () => {
      jest.clearAllMocks()
    })

    it('should throw a error if refresh token is not found and verification is NOT valid', async () => {
      tokenFindOneSpy.mockResolvedValueOnce(null)
      cryptVerifySpy.mockReturnValueOnce(null)

      await runRefresh()
      expect(tokenFindOneSpy).toHaveBeenCalledWith({ token: mockRequest.cookies.rt })
      expect(tokenFindOneSpy).toHaveBeenCalledTimes(1)

      expect(cryptVerifySpy).toHaveBeenCalledTimes(1)
      expect(cryptVerifySpy).toHaveBeenCalledWith({ token: mockRequest.cookies.rt, refresh: true })

      expect(errorApp).toHaveBeenCalledWith('No Content', 404)
    })
    it('should throw a error if refresh token is not found and verification is valid', async () => {
      tokenFindOneSpy.mockReturnValueOnce(Promise.resolve(null))

      cryptVerifySpy.mockReturnValueOnce({ data: mockUser.id } as any)
      userFindByIdSpy.mockReturnValueOnce(Promise.resolve(mockUser as any))
      const tokenRevokeAllSpy = jest.spyOn(tokenService, 'revokeAll').mockReturnValue(Promise.resolve())
      await runRefresh()

      expect(cryptVerifySpy).toHaveBeenCalledTimes(1)
      expect(cryptVerifySpy).toHaveBeenCalledWith({ token: mockRequest.cookies.rt, refresh: true })

      expect(userFindByIdSpy).toHaveBeenCalledTimes(1)
      expect(userFindByIdSpy).toHaveBeenCalledWith({ id: mockUser.id })

      expect(tokenRevokeAllSpy).toHaveBeenCalledWith({ user: mockUser.id })
      expect(tokenRevokeAllSpy).toHaveBeenCalledTimes(1)
      expect(errorApp).toHaveBeenCalledWith('No Content', 404)

    })
    it('should throw a error if user is not found in storage', async () => {
      tokenFindOneSpy.mockReturnValueOnce(mockToken as any)
      userFindByIdSpy.mockReturnValueOnce(Promise.resolve(null))

      await runRefresh()
      expect(tokenFindOneSpy).toHaveBeenCalledWith({ token: mockRequest.cookies.rt })
      expect(errorApp).toHaveBeenCalledWith('User not found', 404)
    })
  })
})