import { mockNext, mockRequest, mockResponse } from 'utils/tests/constants/mocks'
import { AppError } from './errorApp'
import errorHandler from './errorHandler.controller'

describe('errorHandler', () => {
  const err = new AppError('test Error 400', 400)

  const runErrorHandler = async () => new Promise<void>(resolve => {
    errorHandler(err, mockRequest, mockResponse, mockNext)
    resolve()
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return explicit error if NODE_ENV is NOT production', async () => {
    await runErrorHandler()
    expect(mockResponse.status).toHaveBeenCalledWith(err.statusCode)
    expect(mockResponse.send).toHaveBeenCalledWith({
      status: err.status,
      message: err.message,
      error: err,
      stack: err.stack
    })
  })

})