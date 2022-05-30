import type { Request, Response } from "express"

export const mockUser = {
  id: '123',
  username: 'test',
  password: 'passwordHashed',
  email: 'test@test.com'
}
export const mockToken = {
  token: 'token123',
  user: '123',
  agent: 'my-user-agent'
}
export const mockRequest = {
  body: {
    username: 'test',
    email: 'test@test.com',
    password: 'test'
  },
  cookies: {
    rt: 'my-refresh-token'
  },
  headers: {
    'user-agent': 'my-user-agent'
  },
  locals: {
    accessToken: {
      data: {
        userID: '123'
      }
    }
  },
  originalUrl: '/api',
} as Request
export const mockResponse = {
  status: jest.fn(),
  cookie: jest.fn(),
  clearCookie: jest.fn(),
  send: jest.fn()
} as unknown as Response
export const mockNext = jest.fn()