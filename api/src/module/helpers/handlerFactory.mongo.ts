import type { Model, HydratedDocument, FilterQuery, UpdateQuery } from 'mongoose'

type MongooseModel<T> = Model<T>
type DeleteOneRes = { acknowledged: boolean, deletedCount: number }
// type DocID<T> = Pick<Document<T, any, any>, "_id">

export interface CRUDFactoryMethods<T> {
  create: (data: Partial<T>) => Promise<HydratedDocument<T>>
  findById: ({ id }: { id: string }) => Promise<HydratedDocument<T> | null>
  findOne: (query: FilterQuery<T>) => Promise<HydratedDocument<T> | null>
  findMany: (query: FilterQuery<T>) => Promise<HydratedDocument<T>[]>
  exists: (query: FilterQuery<T>) => Promise<boolean | null>
  findOneAndUpdate: (query: FilterQuery<T>, update: UpdateQuery<T>) => Promise<HydratedDocument<T> | null>
  deleteOne: (query: FilterQuery<T>) => Promise<DeleteOneRes>
  deleteMany: (query: FilterQuery<T>) => Promise<void>
}

const CRUDFactory = <T>(model: MongooseModel<T>): CRUDFactoryMethods<T> => {
  // Create
  const create = async ({ ...data }: Partial<T>): Promise<HydratedDocument<T>> => {
    return await model.create(data)
  }
  // Read
  const findById = async ({ id }: { id: string }): Promise<HydratedDocument<T> | null> => {
    const res = await model.findById(id)
    return res
  }
  const findOne = async ({ ...query }: FilterQuery<T>): Promise<HydratedDocument<T> | null> => {
    const res = await model.findOne(query)
    return res
  }
  const findMany = async ({ ...query }: FilterQuery<T>): Promise<HydratedDocument<T>[]> => {
    const res = await model.find(query)
    return res
  }
  const exists = async ({ ...query }: FilterQuery<T>): Promise<boolean> => {
    const res = await model.exists(query)
    return res !== null ? true : false
  }
  // Update
  const findOneAndUpdate = async ({ ...query }: FilterQuery<T>, { ...update }: UpdateQuery<T>): Promise<HydratedDocument<T> | null> => {
    const user = await model.findOneAndUpdate(query, update, { new: true, })
    return user
  }
  // Delete
  const deleteOne = async ({ ...query }: FilterQuery<T>): Promise<DeleteOneRes> => {
    return await model.deleteOne(query)
  }
  const deleteMany = async ({ ...query }: FilterQuery<T>): Promise<void> => {
    await model.deleteMany(query)
    return
  }

  return {
    create,
    findById,
    findOne,
    findMany,
    exists,
    findOneAndUpdate,
    deleteOne,
    deleteMany,
  }
}

export { CRUDFactory }
export default CRUDFactory