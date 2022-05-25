import { TokenModel } from "@auth/repository";
import type { ITokenData, ITokenDoc } from "@auth/repository/interfaces";
import { TokenService } from "./token.service";

const fakeId = '62880e24e99fb107e5b22b8e' as any // Valid ObjectId of mongoose

const testToken: ITokenData = {
  agent: 'Chrome',
  user: fakeId,
  token: 'fake-token',
  createdAt: null,
  lastUsedAt: null
}

const testToken2 = {
  agent: 'Safari',
  user: fakeId,
  token: 'fake-token2',
  lastUsedAt: new Date()
}


describe("UserService", () => {
  const tokenService = TokenService()

  beforeEach(async () => {
    await TokenModel.deleteMany({});
  })

  it(".create - should create a token", async () => {
    const token: ITokenDoc = await tokenService.create(testToken)

    expect(token.id).toBeDefined()
    expect(token.token).toBe(testToken.token)
    expect(token.user).toBeDefined()
    expect(token.agent).toBe(testToken.agent)
    expect(token.createdAt).toBeDefined()
    expect(token.createdAt).toBeInstanceOf(Date)
    expect(token.lastUsedAt).toBeDefined()
    expect(token.lastUsedAt).toBeInstanceOf(Date)
  });

  it('.getByOne - should get a token by id', async () => {
    const { token } = await tokenService.create(testToken)
    const tokenFound = await tokenService.getOne({ token })

    expect(tokenFound).not.toBe(null);
  })
  it('.getByOne - should throw a error if user not found', async () => {
    try {
      const { token } = await tokenService.create(testToken)
      await tokenService.getOne({ token })
    } catch (error) {
      expect(error).toBeDefined();
    }
  })
  it('.findOne - should find a token using different query options', async () => {
    const { token: value, id } = await tokenService.create(testToken)

    const tokenFound = await tokenService.findOne({ token: value })
    if (tokenFound === null) throw new Error("Invalid test, user not found")
    expect(tokenFound.id).toEqual(id);
    expect(tokenFound.token).toEqual(value);
    expect(tokenFound.agent).toEqual(testToken.agent);
    expect(tokenFound.createdAt).not.toEqual(testToken.createdAt);
    expect(tokenFound.lastUsedAt).not.toEqual(testToken.lastUsedAt);
  })
  it('.findOne - should return null if no user found', async () => {
    const tokenFound = await tokenService.findOne({ token: 'fake-token' })
    expect(tokenFound).toBe(null);
  })
  it('.exists - should return true if token exists', async () => {
    const { token } = await tokenService.create(testToken)
    const tokenExists = await tokenService.exits({ token })
    expect(tokenExists).toBe(true);
  })
  it('.exists - should return false if token not exists', async () => {
    const tokenExists = await tokenService.exits({ token: 'fake-token' })
    expect(tokenExists).toBe(false);
  })
  it('.deleteOne - should delete a token', async () => {
    const { token } = await tokenService.create(testToken)
    await tokenService.revoke({ token })
    const tokenFound = await tokenService.exits({ token })
    expect(tokenFound).toBe(false);
  })
  it('.deleteMany - should delete all tokens', async () => {
    const tokenCreated1 = await tokenService.create(testToken)
    const tokenCreated2 = await tokenService.create(testToken2)
    await tokenService.revokeAll({ user: tokenCreated1.user })

    const tokenFound1 = await tokenService.findOne({ token: tokenCreated1.token })
    const tokenFound2 = await tokenService.findOne({ token: tokenCreated2.token })

    expect(tokenFound1).toBe(null);
    expect(tokenFound2).toBe(null);
  })

});