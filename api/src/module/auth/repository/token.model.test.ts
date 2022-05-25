import type { ITokenData } from "./interfaces";
import { TokenModel } from "./token.model";

const testToken: ITokenData = {
  token: "testToken",
  agent: "Chrome",
  user: "62880e24e99fb107e5b22b8e" as any, // Valid ObjectId of mongoose.
  createdAt: null,
  lastUsedAt: null
}

describe("TokenModel", () => {
  const validToken = new TokenModel(testToken)


  describe('# - Validations', () => {
    const invalidToken = new TokenModel({})

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

  describe('# - Methods', () => {
    it('.toJSON - should transform and remove mongoose _id and __v ', async () => {
      // @ts-ignore
      expect(validToken.toJSON()._id).not.toBeDefined()
      // @ts-ignore
      expect(validToken.toJSON().__v).not.toBeDefined()

    })
    it('.toObject - should transform and remove mongoose _id and __v', async () => {
      // @ts-ignore
      expect(validToken.toObject()._id).not.toBeDefined()
      // @ts-ignore
      expect(validToken.toObject().__v).not.toBeDefined()
    })
  })

});

/**
 * References
 * - https://codeutopia.net/blog/2016/06/10/mongoose-models-and-unit-tests-the-definitive-guide/
 */