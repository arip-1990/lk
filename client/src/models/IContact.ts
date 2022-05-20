import { IUser } from "./IUser";

export interface IContact {
  id: string;
  description: string;
  contacts: IUser[];
}
