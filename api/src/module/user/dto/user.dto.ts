interface UserDTO {
  username: string
}

export const UserDTO = (user: any): UserDTO => {
  return {
    username: user.username
  }
}

