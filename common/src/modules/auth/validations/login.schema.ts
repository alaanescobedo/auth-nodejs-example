import { InferType, object, SchemaOf, string } from 'yup'
import type { LoginUserClientData } from '../interfaces/login.interface'

const loginSchema: SchemaOf<LoginUserClientData> = object({
  password: string().min(8).required(),
  email: string().email().required()
})

export interface LoginValidation extends InferType<typeof loginSchema> { }
export default loginSchema
