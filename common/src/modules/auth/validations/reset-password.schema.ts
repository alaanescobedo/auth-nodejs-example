import { InferType, object, ref, SchemaOf, string } from 'yup'
import type { ResetPasswordUserClientData } from '../interfaces/reset-password.interface'

const resetPasswordSchema: SchemaOf<ResetPasswordUserClientData> = object({
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

export interface ResetPasswordValidation extends InferType<typeof resetPasswordSchema> { }
export { resetPasswordSchema }
