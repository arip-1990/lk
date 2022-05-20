import moment from "moment";
import { IStore } from "./IStore";

export interface IMedia {
    id: string;
    category: number;
    title: string;
    store: IStore;
    sort: number;
    type: string;
    url: string;
    createdAt: moment.Moment;
}
