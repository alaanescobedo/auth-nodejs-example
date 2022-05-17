declare namespace Express {
  export interface Request {
    locals: {
      user?: import('../../common/src/modules/auth/interfaces/auth.interfaces').IUser
      accessToken?: {
        data: any 
      }
    }
  }
}
