import { cryptService } from "./crypt.service"
import { TokenService } from "./token.service"

const AuthService = {
  cryptService,
  TokenService
}
export { cryptService, TokenService }
export default AuthService