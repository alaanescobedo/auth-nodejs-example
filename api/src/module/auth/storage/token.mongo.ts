import TokenModel, { IToken, TokenEntity } from "./token.model"

const store = async ({ token, user }: Omit<IToken, 'lastUsedAt'>): Promise<TokenEntity> => {
  const tokenCreated = await TokenModel.create({ token, user })
  return tokenCreated
}
const findOne = async ({ token }: { token: string }): Promise<TokenEntity | null> => {
  const tokenFound = await TokenModel.findOne({ token })
  return tokenFound
}
const destroy = async ({ token }: { token: string }): Promise<void> => {
  await TokenModel.deleteOne({ token })
}

export default {
  store,
  findOne,
  destroy
}