import { CryptService } from "./crypt.service";
import bcrypt from "bcryptjs";

const password = 'ultra-secure-password';

describe('Crypt Service', () => {
  describe('.hash', () => {

    afterEach(() => {
      jest.clearAllMocks();
    })

    it('should return a new Password', () => {
      const passwordHashed = CryptService.hash(password)

      expect(passwordHashed).not.toBe(password)
      expect(typeof passwordHashed).toBe('string')
      expect(passwordHashed.length).toBeGreaterThan(password.length)
    })
    it('should call bcrypt.hashSync', () => {
      const spyHash = jest.spyOn(bcrypt, 'hashSync')
      const spyGenerateSalt = jest.spyOn(bcrypt, 'genSaltSync')

      const passwordHashed = CryptService.hash(password)
      expect(passwordHashed).not.toBe(password)

      const genSaltValue = spyGenerateSalt.mock.results[0]?.value

      expect(spyHash).toHaveBeenCalledTimes(1)
      expect(spyHash).toHaveBeenCalledWith(password, genSaltValue)
      expect(spyGenerateSalt).toHaveBeenCalledTimes(1)
      expect(spyGenerateSalt).toHaveBeenCalledWith(12)
    })
  })

  describe('.compare', () => {
    it('should return true if the password is correct', async () => {
      const passwordHashed = CryptService.hash(password)
      const isPasswordCorrect = await CryptService.compare(password, passwordHashed)

      expect(isPasswordCorrect).toBe(true)
    })
    it('should return false if the password is incorrect', async () => {
      const passwordHashed = CryptService.hash(password)
      const isPasswordCorrect = await CryptService.compare('wrong-password', passwordHashed)

      expect(isPasswordCorrect).toBe(false)
    })
    it('should call bcrypt.compare', async () => {
      const spyCompare = jest.spyOn(bcrypt, 'compare')
      const passwordHashed = CryptService.hash(password)
      await CryptService.compare(password, passwordHashed)

      expect(spyCompare).toHaveBeenCalledTimes(1)
      expect(spyCompare).toHaveBeenCalledWith(password, passwordHashed)
    })
  })

  describe('.verify', () => {
    const payload = {
      name: 'John Doe',
      email: 'test@test.com'
    }

    it('should return the a object with id,exp and the data with the payload', () => {
      const token = CryptService.sign({ data: payload })
      const decoded = CryptService.verify({ token })
      expect(decoded.data).toEqual(payload)
      expect(decoded.iat).toBeDefined()
      expect(decoded.exp).toBeDefined()
    })
    it('should throw an error if the token is invalid', () => {
      expect(() => CryptService.verify({ token: 'invalid-token' })).toThrowError('jwt malformed')
    })
    // it('should throw an error if the token is expired', () => {
    //   const token = CryptService.sign({ data: payload, options: { expiresIn: '1s' } })
    //   act(() => jest.advanceTimersByTime(1000))

    //   expect(() => CryptService.verify({ token })).toThrowError('jwt expired')
    // })
  })

})