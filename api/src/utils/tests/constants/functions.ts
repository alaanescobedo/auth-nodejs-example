import { mockNext, mockRequest, mockResponse } from "./mocks"

export const execController = async (controller: Function) => await new Promise<void>(resolve => {
  // Wrapper for catchError
  controller(mockRequest, mockResponse, () => {
    resolve()
    mockNext()
  })
})