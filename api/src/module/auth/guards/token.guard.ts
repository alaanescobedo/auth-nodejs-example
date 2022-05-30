import { AppError } from "@error"

export const TokenGuard = (token: string) => {
  if (!token) throw new AppError('No Content - token not found', 400)
}