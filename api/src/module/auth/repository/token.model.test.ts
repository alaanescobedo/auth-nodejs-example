import { IToken, TokenModel } from "./token.model";

const testToken: Omit<IToken, 'lastUsedAt'> = {
  token: "testToken",
  agent: "Chrome",
  user: "62880e24e99fb107e5b22b8e" as any // Valid ObjectId of mongoose.
}

describe("TokenModel", () => {

  describe('# - Validations', () => {
    const invalidToken = new TokenModel({})
    const validToken = new TokenModel(testToken)

    it("should contain an error if validations don't pass", async () => {
      const error = invalidToken.validateSync()
      expect(error).not.toBeUndefined()
    });
    it("should validate each field", async () => {
      const error = invalidToken.validateSync()
      if (error === null) throw new Error("invalid test, no errors were found to validate")

      for (let field in error.errors) {
        expect(testToken[field as keyof typeof testToken]).toBeDefined()
      }
    })
    it("should pass the validations", async () => {
      const error = validToken.validateSync()
      expect(error).toBeUndefined()
    })
  })

});

/**
 * References
 * - https://codeutopia.net/blog/2016/06/10/mongoose-models-and-unit-tests-the-definitive-guide/
 */