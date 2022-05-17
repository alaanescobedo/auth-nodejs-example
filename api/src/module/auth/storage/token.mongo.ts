import TokenModel, { type IToken, type TokenEntity, type TokenWithUsername } from "./token.model"

const store = async ({ token, user, agent }: Omit<IToken, 'lastUsedAt'>): Promise<TokenEntity> => {
  const tokenCreated = await TokenModel.create({ token, user, agent })
  return tokenCreated
}
const findOne = async ({ ...query }: Partial<IToken>): Promise<TokenWithUsername> => {
  const tokenFound: TokenWithUsername = await TokenModel.findOne({ ...query })
  return tokenFound
}
const destroy = async ({ token }: Pick<IToken, 'token'>): Promise<void> => {
  await TokenModel.deleteOne({ token })
}
const destroyAll = async ({ user }: Pick<IToken, 'user'>): Promise<void> => {
  await TokenModel.deleteMany({ user })
}

export default {
  store,
  findOne,
  destroy,
  destroyAll
}