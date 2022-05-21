import { UserService } from "@user/services";
import { UserEntity, UserRepository } from "@user/repository";

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

  beforeEach(async () => {
    await UserRepository.deleteMany({});
  })

  it(".create - should create a user", async () => {
    const user: UserEntity = await UserService.create(testUser)
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
    const user = await UserService.create(testUser)
    const userFound = await UserService.getById({ id: user._id })

    expect(userFound).not.toBe(null);
  })
  it('.getById - should throw a error if user not found', async () => {
    try {
      await UserService.getById({ id: fakeId })
    } catch (error) {
      expect(error).toBeDefined();
    }
  })
  it('.getOne - should get a user using different query options', async () => {
    const user = await UserService.create(testUser)
    const userFound = await UserService.getOne({ username: user.username })

    expect(userFound).not.toBe(null);
    expect(userFound._id).toEqual(user._id);
    expect(userFound.username).toEqual(user.username);

    const userFound2 = await UserService.getOne({ email: user.email, })
    expect(userFound2).not.toBe(null);
    expect(userFound2._id).toEqual(user._id);
    expect(userFound2.username).toEqual(user.username);

    const userFound3 = await UserService.getOne({ id: user._id })
    expect(userFound3).not.toBe(null);
    expect(userFound3._id).toEqual(user._id);
    expect(userFound3.username).toEqual(user.username);
  })
  it('.getOne - should throw a error if user not found', async () => {
    try {
      await UserService.getOne({ id: fakeId })
    } catch (error) {
      expect(error).toBeDefined();
    }
  })

  it('.findById - should find a user by id', async () => {
    const user = await UserService.create(testUser)
    const userFound = await UserService.findById({ id: user._id })
    if (userFound === null) throw new Error("Invalid test, user not found")

    expect(userFound).not.toBe(null);
    expect(userFound._id).toEqual(user._id);
    expect(userFound.username).toEqual(user.username);
  })
  it('.findById - should return null if no user found', async () => {
    const userFound = await UserService.findById({ id: fakeId })
    expect(userFound).toBe(null);
  })
  it('.findOne - should find a user using different query options', async () => {
    const user = await UserService.create(testUser)
    const userFound = await UserService.findOne({ username: user.username })
    if (userFound === null) throw new Error("Invalid test, user not found")

    expect(userFound).not.toBe(null);
    expect(userFound._id).toEqual(user._id);
    expect(userFound.username).toEqual(user.username);

    const userFound2 = await UserService.findOne({ email: user.email, })
    if (userFound2 === null) throw new Error("Invalid test, user not found")
    expect(userFound2).not.toBe(null);
    expect(userFound2._id).toEqual(user._id);
    expect(userFound2.username).toEqual(user.username);

    const userFound3 = await UserService.findOne({ id: user._id })
    if (userFound3 === null) throw new Error("Invalid test, user not found")
    expect(userFound3).not.toBe(null);
    expect(userFound3._id).toEqual(user._id);
    expect(userFound3.username).toEqual(user.username);
  })
  it('.findOne - should return null if no user found', async () => {
    const userFound = await UserService.findOne({ id: fakeId })
    expect(userFound).toBe(null);
  })

  it('.deleteOne - should delete a user', async () => {
    const user = await UserService.create(testUser)
    await UserService.deleteOne({ id: user._id })
    const userDeleted = await UserService.findById({ id: user._id })

    expect(userDeleted).toBe(null);
  })
  it('.deleteMany - should delete many users', async () => {
    const user = await UserService.create(testUser)
    const user2 = await UserService.create(testUser2)

    await UserService.deleteMany({})
    
    const userDeleted = await UserService.findById({ id: user._id })
    const userDeleted2 = await UserService.findById({ id: user2._id })

    expect(userDeleted).toBe(null);
    expect(userDeleted2).toBe(null);
  })
});