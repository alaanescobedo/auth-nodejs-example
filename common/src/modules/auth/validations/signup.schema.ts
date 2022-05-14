import { InferType, object, ref, SchemaOf, string } from 'yup'
import type { SignupClientData } from '../interfaces/auth.interfaces'

const signupSchema: SchemaOf<SignupClientData> = object({
  username:
    string()
      .min(3)
      .max(15)
      .required()
      .matches(/^[A-Za-z][A-Za-z0-9_]{6,14}$/,
        'Username must be between 6 and 14 characters and can only contain letters, numbers and underscores'
      ),
  email:
    string()
      .email()
      .required(),
  password:
    string()
      .min(8)
      .required()
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/,
        'Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character'
      ),
  confirmPassword:
    string()
      .required()
      .oneOf([ref('password'), null], 'Passwords must match')
})

export interface SignupValidation extends InferType<typeof signupSchema> { }
export default signupSchema
