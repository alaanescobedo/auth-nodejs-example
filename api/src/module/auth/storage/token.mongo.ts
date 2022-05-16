import TokenModel, { type IToken, type TokenEntity, type TokenWithUsername } from "./token.model"

const store = async ({ token, user }: Omit<IToken, 'lastUsedAt'>): Promise<TokenEntity> => {
  const tokenCreated = await TokenModel.create({ token, user })
  return tokenCreated
}
const findOne = async ({ token }: Pick<IToken, 'token'>): Promise<TokenWithUsername> => {
  const tokenFound: TokenWithUsername = await TokenModel.findOne({ token })
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