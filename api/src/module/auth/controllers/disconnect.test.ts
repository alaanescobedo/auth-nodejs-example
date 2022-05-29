import * as Guards from "@auth/guards"
import * as AppError from "@error"
import { TokenService } from "@auth/services"
import { execController } from "utils/tests/constants/functions"
import { mockRequest, mockResponse } from "utils/tests/constants/mocks"
import { disconnect } from './disconnect'

describe('.disconnect - controller', () => {

  const tokenService = TokenService()
  const cookieGuardSpy = jest.spyOn(Guards, 'CookieGuard')
  const existSpy = jest.spyOn(tokenService, 'exists').mockResolvedValueOnce(Promise.resolve(true))
  const revokeSpy = jest.spyOn(tokenService, 'revoke')

  const runDisconnect = async () =>
    await execController(disconnect({
      tokenService
    }))

  describe('Success Operation', () => {
    beforeAll(async () => {
      await runDisconnect()
    })

    it('should call CookieGuard with rt', () => {
      expect(cookieGuardSpy).toHaveBeenCalledWith(mockRequest.cookies.rt)
    })
    it('should call token.exists', async () => {
      expect(existSpy).toHaveBeenCalledWith({ token: mockRequest.cookies.rt })
    })
    it('should call token.revoke', async () => {
      expect(revokeSpy).toHaveBeenCalledWith({ name: 'rt', value: mockRequest.cookies.rt })
    })
    it('should return a 200 status code', async () => {
      expect(mockResponse.status).toHaveBeenCalledWith(200)
    })
  })

  describe('Error cases', () => {
    const errorApp = jest.spyOn(AppError, 'AppError')

    it('should throw a error if refresh token is not found in storage', async () => {
      existSpy.mockResolvedValueOnce(Promise.resolve(false))
      await runDisconnect()
      expect(errorApp).toHaveBeenCalledWith('No Content - token not found', 404)
    })
  })
})