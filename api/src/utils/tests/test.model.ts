import { Schema, model } from "mongoose";

export interface TestData {
  name: string
  email: string
  value: number
}

const testSchema = new Schema<TestData>({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  value: {
    type: Number,
    required: true
  }
})

const TestModel = model<TestData>('TestModel', testSchema)

export { TestModel }