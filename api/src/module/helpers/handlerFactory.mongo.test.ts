import { TestData, TestModel } from "utils/tests/test.model";
import { CRUDFactory } from './handlerFactory.mongo'

// const fakeId = '62880e24e99fb107e5b22b8e' as any // Valid ObjectId of mongoose

const testItem: TestData = {
  name: 'Test',
  email: 'test@test.com',
  value: 123
}

const testItemSameValue: TestData = {
  name: 'Test2',
  email: 'test2@test.com',
  value: 123
}

describe("Factory Mongo", () => {
  const factory = CRUDFactory(TestModel)

  beforeEach(async () => {
    await TestModel.deleteMany({});
  })
  afterEach(async () => {
    jest.clearAllMocks();
  })

  describe('.create', () => {
    it('should return a new item', async () => {
      const item = await factory.create(testItem)
      expect(item).not.toBe(null)
      expect(item.name).toBe(testItem.name)
      expect(item.email).toBe(testItem.email)
      expect(item.value).toBe(testItem.value)
    })

    it('should call method create of model', async () => {
      const spyCreate = jest.spyOn(TestModel, 'create')
      await factory.create(testItem)

      expect(spyCreate).toHaveBeenCalledTimes(1)
      expect(spyCreate).toHaveBeenCalledWith(testItem)
    })
  })

  describe('.getOne', () => {
    it('should get a token by id', async () => {
      const { name } = await factory.create(testItem)
      const itemFound = await factory.getOne({ name })

      expect(itemFound).not.toBe(null);
      expect(itemFound.name).toBe(name);
    })
    it('should throw a error if user not found', async () => {
      try {
        await factory.getOne({ name: 'fake-name' })
      } catch (error) {
        expect(error).toBeDefined();
      }
    })
    it('should call method findOne of model', async () => {
      const { name } = await factory.create(testItem)
      const spyFindOne = jest.spyOn(TestModel, 'findOne')
      await factory.getOne({ name })

      expect(spyFindOne).toHaveBeenCalledTimes(1)
      expect(spyFindOne).toHaveBeenCalledWith({ name })
    })
  })

  describe('.findOne', () => {
    it('should find a token using different query options', async () => {
      const { name, email } = await factory.create(testItem)
      const itemFound = await factory.findOne({ name, email })
      if (itemFound === null) throw new Error("Invalid test, user not found")

      expect(itemFound.name).toEqual(name);
      expect(itemFound.email).toEqual(email);
    })
    it('should return null if no user found', async () => {
      const itemFound = await factory.findOne({ token: 'fake-token' })

      expect(itemFound).toBe(null);
    })
    it('should call method findOne of model', async () => {
      const { name, email } = await factory.create(testItem)
      const spyFindOne = jest.spyOn(TestModel, 'findOne')
      await factory.findOne({ name, email })

      expect(spyFindOne).toHaveBeenCalledTimes(1)
      expect(spyFindOne).toHaveBeenCalledWith({ name, email })
    })
  })

  describe('.find', () => {

    it('should return true if token exists', async () => {
      const { name } = await factory.create(testItem)
      const itemFound = await factory.exits({ name })

      expect(itemFound).toBe(true);
    })
    it('should return false if token not exists', async () => {
      const itemFound = await factory.exits({ name: 'fake-name' })
      expect(itemFound).toBe(false);
    })
    it('should call method exists of model', async () => {
      const { name } = await factory.create(testItem)
      const spyExists = jest.spyOn(TestModel, 'exists')
      await factory.exits({ name })

      expect(spyExists).toHaveBeenCalledTimes(1)
      expect(spyExists).toHaveBeenCalledWith({ name })
    })
  })

  describe('updateOne', () => {

    it('should update a the name of the item', async () => {
      const { id } = await factory.create(testItem)
      const newName = 'new-name'
      const itemUpdated = await factory.updateOne({ id }, { name: newName })

      expect(itemUpdated.name).toBe(newName);
    })
    it('should throw an error if id not found', async () => {
      try {
        await factory.updateOne({ id: 'fake-id' }, { name: 'fake-name' })
      }
      catch (error) {
        expect(error).toBeDefined();
      }
    })
    it('should call method findOneAndUpdate of model', async () => {
      const { id } = await factory.create(testItem)
      const spyFindOneAndUpdate = jest.spyOn(TestModel, 'findOneAndUpdate')
      const newName = 'new-name'

      await factory.updateOne({ id }, { name: newName })
      expect(spyFindOneAndUpdate).toHaveBeenCalledTimes(1)
      expect(spyFindOneAndUpdate).toHaveBeenCalledWith({ id }, { name: newName }, { new: true })
    })

  })

  describe('.deleteOne', () => {
    it('should delete a item', async () => {
      const { id } = await factory.create(testItem)
      const { deletedCount } = await factory.deleteOne({ id })

      expect(deletedCount).toBe(1);

      const tokenFound = await factory.exits({ id })
      expect(tokenFound).toBe(false);
    })
    it('should return false and 0 if no item was deleted', async () => {
      const { deletedCount } = await factory.deleteOne({ id: 'fake-id' })

      expect(deletedCount).toBe(0);
    })
    it('should call method .deleteOne of model', async () => {
      const { id } = await factory.create(testItem)
      const spyDeleteOne = jest.spyOn(TestModel, 'deleteOne')

      await factory.deleteOne({ id })
      expect(spyDeleteOne).toHaveBeenCalledTimes(1)
      expect(spyDeleteOne).toHaveBeenCalledWith({ id })
    })

  })

  describe('.deleteMany', () => {

    it('should delete all items', async () => {
      const { id: id_1, value } = await factory.create(testItem)
      const { id: id_2 } = await factory.create(testItemSameValue)
      await factory.deleteMany({ value })

      const itemFound1 = await factory.findOne({ id: id_1 })
      const itemFound2 = await factory.findOne({ id: id_2 })
      expect(itemFound1).toBe(null);
      expect(itemFound2).toBe(null);
    })
    it('should call method .deleteMany of model', async () => {
      const spyDeleteMany = jest.spyOn(TestModel, 'deleteMany')
      const { value } = await factory.create(testItem)
      await factory.create(testItemSameValue)

      await factory.deleteMany({ value })
      expect(spyDeleteMany).toHaveBeenCalledTimes(1)
      expect(spyDeleteMany).toHaveBeenCalledWith({ value })
    })
  })

});