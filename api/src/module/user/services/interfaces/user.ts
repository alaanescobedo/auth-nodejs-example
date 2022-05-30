import type { IUserData } from "@user/repository/interfaces/user";
import type { CRUDFactoryMethods } from "module/helpers/handlerFactory.mongo"

export interface IUserService extends CRUDFactoryMethods<IUserData> {
}