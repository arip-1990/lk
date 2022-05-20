import { IStore } from "./IStore";
import { IUser } from "./IUser";

export interface IStatement extends Key {
  id: string;
  must: string;
  comment: string | undefined;
  createdAt: moment.Moment;
  doneAt: moment.Moment | undefined;
  status: boolean;
  applicant: IUser;
  media: string | undefined;
  store: IStore | undefined;
  editable: boolean;
}
