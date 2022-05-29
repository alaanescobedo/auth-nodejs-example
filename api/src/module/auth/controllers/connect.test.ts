import { cryptService, TokenService } from '@auth/services'
import * as AppError from '@error'
import UserService from '@user/services'
import { mockUser, mockToken, mockRequest, mockResponse } from 'utils/tests/constants/mocks'
import { connect } from './connect'
import { execController } from "utils/tests/constants/functions"

const userService = UserService()
const tokenService = TokenService()

describe('.connect - controller', () => {



  const runConnect = async () =>
    await execController(connect({
      userService,
      tokenService
    }))

  const userFindOneSpy = jest.spyOn(userService, 'findOne')
  const compareSpy = jest.spyOn(cryptService, 'compare')
  const findOneTokenSpy = jest.spyOn(tokenService, 'findOne')
  const revokeSpy = jest.spyOn(tokenService, 'revoke')



  describe('Success Operation', () => {
    const signSpy = jest.spyOn(cryptService, 'sign')
    const createSpy = jest.spyOn(tokenService, 'create')

    beforeAll(async () => {
      userFindOneSpy.mockReturnValue(mockUser as any)
      compareSpy.mockImplementation(() => Promise.resolve(true))
      findOneTokenSpy.mockReturnValue(mockToken as any)
      signSpy.mockImplementationOnce(() => 'new_access_token')
        .mockImplementationOnce(() => 'new_refresh_token')
      createSpy.mockReturnValue(mockToken as any)

      await runConnect()
    })

    it('should call userService.findOne', async () => {
      expect(userFindOneSpy).toHaveBeenCalledWith({ email: mockRequest.body.email })
      expect(userFindOneSpy).toHaveBeenCalledTimes(1)
    })
    it('should call cryptService.compare', async () => {
      expect(compareSpy).toHaveBeenCalledWith(mockRequest.body.password, mockUser.password)
      expect(compareSpy).toHaveBeenCalledTimes(1)
    })
    it('should call tokenService.findOne', async () => {
      expect(findOneTokenSpy).toHaveBeenCalledWith({ token: mockRequest.cookies.rt })
      expect(findOneTokenSpy).toHaveBeenCalledTimes(1)
    })
    it('should call tokenService.revoke', async () => {
      expect(revokeSpy).toHaveBeenCalledWith({ name: 'rt', value: mockRequest.cookies.rt })
      expect(revokeSpy).toHaveBeenCalledTimes(1)
    })
    // TODO: Repeated in a lot of tests - Refactor in a helper
    it('should call cryptService.sign', async () => {
      expect(signSpy).toHaveBeenCalledWith({ data: { username: mockUser.username, roles: null } })
      expect(signSpy).toHaveBeenCalledWith({ data: mockUser.id, refresh: true })
      expect(signSpy).toHaveBeenCalledTimes(2)
    })
    it('should call tokenService.create', async () => {
      expect(createSpy).toHaveBeenCalledWith({ token: 'new_refresh_token', user: mockToken.user, agent: mockToken.agent })
      expect(createSpy).toHaveBeenCalledTimes(1)
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
    // TODO: End
    it('should call res.status 200', async () => {
      expect(mockResponse.status).toHaveBeenCalledWith(200)
      expect(mockResponse.status).toHaveBeenCalledTimes(1)
    })
  })

  describe('Error cases', () => {
    const errorApp = jest.spyOn(AppError, 'AppError')

    it('should expect "User not found, 400" if user not Found', async () => {
      userFindOneSpy.mockReturnValueOnce(Promise.resolve(null))

      await runConnect()
      expect(errorApp).toHaveBeenCalledWith('User not found', 404)
    })
    it('should expect error if password not match', async () => {
      compareSpy.mockImplementationOnce(() => Promise.resolve(false))

      await runConnect()
      expect(errorApp).toHaveBeenCalledWith('Invalid credentials', 401)
    })
    it('should expect error if token not found', async () => {
      findOneTokenSpy.mockReturnValueOnce(Promise.resolve(null))
      const revokeAllSpy = jest.spyOn(tokenService, 'revokeAll').mockReturnValue(Promise.resolve())

      await runConnect()
      expect(revokeAllSpy).toHaveBeenCalledWith({ user: mockUser.id })
      expect(errorApp).toHaveBeenCalledWith('Invalid refresh token', 401)
    })
  })

})

