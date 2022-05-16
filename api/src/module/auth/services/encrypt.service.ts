import bcrypt from 'bcryptjs';

export const hash = (password: string): string => {
  const salt = bcrypt.genSaltSync(10)
  return bcrypt.hashSync(password, salt)
}

export const compare = async (plainPassword: string, hashedPassword: string): Promise<boolean> => {
  return await bcrypt.compare(plainPassword, hashedPassword)
}

export default {
  hash,
  compare
}