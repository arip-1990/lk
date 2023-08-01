import { ICategory } from "./ICategory";
import { IStore } from "./IStore";
import { IUser } from "./IUser";
import {Moment} from "moment";

export interface IStatement extends Key {
  id: string;
  category: ICategory;
  must: string;
  comment?: string;
  createdAt: Moment;
  doneAt?: Moment;
  status: boolean;
  applicant: IUser;
  performer?: IUser;
  media?: string;
  store?: IStore;
  editable: boolean;
}
