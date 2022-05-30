import { AppError } from './errorApp'

describe('errorApp', () => {
  it('should return an error with status 400', () => {
    const error = new AppError('error Message', 400)
    expect(error.statusCode).toBe(400)
    expect(error.status).toBe('failure')
    expect(error.message).toBe('error Message')
    expect(error.stack).toBeDefined()
  })
  it('should return an error with status 500', () => {
    const error = new AppError('internal Error Message', 500)
    expect(error.statusCode).toBe(500)
    expect(error.status).toBe('error')
    expect(error.message).toBe('internal Error Message')
    expect(error.stack).toBeDefined()
  })
})