import { UserService } from "@user";
import { UserModel } from "@user/repository";

const testUser = {
  username: "testUser",
  email: "test@user.com",
  password: "TestPassword_123!"
}

const testUser2 = {
  username: "testUser2",
  email: "test2@user2.com",
  password: "TestPassword_123!2"
}

const fakeId = '62880e24e99fb107e5b22b8e' // Valid ObjectId of mongoose

describe("UserService", () => {
  const userService = UserService()

  beforeEach(async () => {
    await UserModel.deleteMany({});
  })

  it(".create - should create a user", async () => {
    const user = await userService.create(testUser)
    expect(user.id).toBeDefined();
    expect(user.username).toBe(testUser.username.toLowerCase());
    expect(user.email).toBe(testUser.email);
    expect(user.password).toBeDefined();
    expect(user.password).not.toEqual(testUser.password);
    expect(user.active).toBe(true);
    expect(user.verified).toBe(false);
    expect(user.createdAt).toBeDefined();
    expect(user.createdAt).toBeInstanceOf(Date);
    expect(user.updatedAt).toBeDefined();
    expect(user.updatedAt).toBeInstanceOf(Date);
  });

  it('.getById - should get a user by id', async () => {
    const user = await userService.create(testUser)
    const userFound = await userService.getById({ id: user.id })

    expect(userFound).not.toBe(null);
  })
  it('.getById - should throw a error if user not found', async () => {
    try {
      await userService.getById({ id: fakeId })
    } catch (error) {
      expect(error).toBeDefined();
    }
  })
  it('.getOne - should get a user using different query options', async () => {
    const user = await userService.create(testUser)
    const userFound = await userService.getOne({ username: user.username })

    expect(userFound).not.toBe(null);
    expect(userFound.id).toEqual(user.id);
    expect(userFound.username).toEqual(user.username);

    const userFound2 = await userService.getOne({ email: user.email, })
    expect(userFound2).not.toBe(null);
    expect(userFound2.id).toEqual(user.id);
    expect(userFound2.username).toEqual(user.username);

    const userFound3 = await userService.getOne({ id: user.id })
    expect(userFound3).not.toBe(null);
    expect(userFound3.id).toEqual(user.id);
    expect(userFound3.username).toEqual(user.username);
  })
  it('.getOne - should throw a error if user not found', async () => {
    try {
      await userService.getOne({ id: fakeId })
    } catch (error) {
      expect(error).toBeDefined();
    }
  })

  it('.findById - should find a user by id', async () => {
    const user = await userService.create(testUser)
    const userFound = await userService.findById({ id: user.id })
    if (userFound === null) throw new Error("Invalid test, user not found")

    expect(userFound).not.toBe(null);
    expect(userFound.id).toEqual(user.id);
    expect(userFound.username).toEqual(user.username);
  })
  it('.findById - should return null if no user found', async () => {
    const userFound = await userService.findById({ id: fakeId })
    expect(userFound).toBe(null);
  })
  it('.findOne - should find a user using different query options', async () => {
    const user = await userService.create(testUser)
    const userFound = await userService.findOne({ username: user.username })
    if (userFound === null) throw new Error("Invalid test, user not found")

    expect(userFound).not.toBe(null);
    expect(userFound.id).toEqual(user.id);
    expect(userFound.username).toEqual(user.username);

    const userFound2 = await userService.findOne({ email: user.email, })
    if (userFound2 === null) throw new Error("Invalid test, user not found")
    expect(userFound2).not.toBe(null);
    expect(userFound2.id).toEqual(user.id);
    expect(userFound2.username).toEqual(user.username);

    const userFound3 = await userService.findOne({ id: user.id })
    if (userFound3 === null) throw new Error("Invalid test, user not found")
    expect(userFound3).not.toBe(null);
    expect(userFound3.id).toEqual(user.id);
    expect(userFound3.username).toEqual(user.username);
  })
  it('.findOne - should return null if no user found', async () => {
    const userFound = await userService.findOne({ id: fakeId })
    expect(userFound).toBe(null);
  })

  it('.deleteOne - should delete a user', async () => {
    const user = await userService.create(testUser)
    await userService.deleteOne({ id: user.id })
    const userDeleted = await userService.findById({ id: user.id })

    expect(userDeleted).toBe(null);
  })
  it('.deleteMany - should delete many users', async () => {
    const user = await userService.create(testUser)
    const user2 = await userService.create(testUser2)

    await userService.deleteMany({})

    const userDeleted = await userService.findById({ id: user.id })
    const userDeleted2 = await userService.findById({ id: user2.id })

    expect(userDeleted).toBe(null);
    expect(userDeleted2).toBe(null);
  })
});