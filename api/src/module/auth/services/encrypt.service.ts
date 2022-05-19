import bcrypt from 'bcryptjs';

export const hash = (item: string): string => {
  const salt = bcrypt.genSaltSync(10)
  return bcrypt.hashSync(item, salt)
}

export const compare = async (plainPassword: string, hashedPassword: string): Promise<boolean> => {
  return await bcrypt.compare(plainPassword, hashedPassword)
}

export const EncryptService = {
  hash,
  compare
}