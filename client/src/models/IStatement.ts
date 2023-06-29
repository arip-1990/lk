import { ICategory } from "./ICategory";
import { IStore } from "./IStore";
import { IUser } from "./IUser";

export interface IStatement extends Key {
  id: string;
  category: ICategory;
  must: string;
  comment?: string;
  createdAt: moment.Moment;
  doneAt?: moment.Moment;
  status: boolean;
  applicant: IUser;
  media?: string;
  store?: IStore;
  editable: boolean;
}
