import { UserModel } from "./user.model";

const testUser = {
  username: "testUser",
  email: "test@user.com",
  password: "TestPassword_123!"
}

describe("UserModel", () => {

  describe('# - Validations', () => {
    const invalidUser = new UserModel({})
    const validUser = new UserModel(testUser)

    it("should contain an error if validations don't pass", async () => {
      const error = invalidUser.validateSync()
      expect(error).not.toBeUndefined()
    });
    it("should validate each field", async () => {
      const error = invalidUser.validateSync()
      if (error === null) throw new Error("invalid test, no errors were found to validate")

      for (let field in error.errors) {
        expect(testUser[field as keyof typeof testUser]).toBeDefined()
      }
    })
    it("should pass the validations", async () => {
      const error = validUser.validateSync()
      expect(error).toBeUndefined()
    })
  })

});

/**
 * References
 * - https://codeutopia.net/blog/2016/06/10/mongoose-models-and-unit-tests-the-definitive-guide/
 */