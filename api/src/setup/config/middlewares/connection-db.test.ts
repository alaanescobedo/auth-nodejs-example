import type { Request, Response } from 'express'
import { mockNext } from 'utils/tests/constants/mocks'
import { db } from '..'
import { connectionDB } from './connection-db'

describe('connection-db', () => {
  const req = {} as Request
  const res = {
    on: jest.fn()
  } as unknown as Response

  const dbConnectSpy = jest.spyOn(db, 'connect')
  const dbDisconnectSpy = jest.spyOn(db, 'disconnect')
  const resOnSpy = jest.spyOn(res, 'on')

  const runConnectionDB = async () => await new Promise<void>(resolve => {
    connectionDB(req, res, mockNext)
    resolve()
  })

  beforeEach(() => {
    dbConnectSpy.mockReset()
    dbDisconnectSpy.mockReset()
    mockNext.mockReset()
  })

  it('should call connect', async () => {
    await runConnectionDB()

    expect(dbConnectSpy).toHaveBeenCalled()
    expect(dbConnectSpy).toHaveBeenCalledTimes(1)
    expect(dbDisconnectSpy).not.toHaveBeenCalled()
    expect(mockNext).toHaveBeenCalledTimes(1)
  })
  it('should disconnect if res.on is called with "finish"', async () => {
    resOnSpy.mockImplementationOnce((event, cb): any => {
      if (event === 'finish') {
        cb()
      }
    })

    await runConnectionDB()

    expect(dbDisconnectSpy).toHaveBeenCalledTimes(1)
    expect(mockNext).toHaveBeenCalledTimes(1)
  })
})