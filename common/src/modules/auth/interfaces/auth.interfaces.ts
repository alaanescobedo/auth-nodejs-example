interface SignupClientData {
  email: string
  password: string
  confirmPassword: string
  username: string
}

interface SignupUserData extends Omit<SignupClientData, 'confirmPassword'> { }

interface SignupServerData extends SignupClientData {
  createdAt: Date
  updatedAt: Date
}

interface IUser extends SignupServerData, SignupUserData {
  active: boolean
  verified: boolean
  refreshTokens: string[]
}

export {
  SignupClientData,
  SignupUserData,
  SignupServerData,
  IUser
}

