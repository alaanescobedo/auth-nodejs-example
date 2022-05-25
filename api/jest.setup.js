const { UserModel } = require('./src/module/user/repository')
const { TokenModel } = require('./src/module/auth/repository')
const { db } = require('./src/setup/config')

const PERSIST_DB_TEST = false // For Debugging

beforeAll(async () => {
  await db.connect()
});
afterAll(async () => {
  if (PERSIST_DB_TEST === true) return

  await UserModel.deleteMany({})
  await UserModel.deleteMany({})
});