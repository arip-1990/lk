import moment from "moment";

import { ICategory } from "../models/ICategory";

declare global {
  type Key = {
    [key: string]: any;
  };

  type LocationState = {
    key?: string;
    page?: string;
    category?: ICategory;
  };

  type Result = {
    key: string;
    category: string;
    corrects: number;
    totalCorrects: number;
  };

  type Pagination<T> = {
    data: T[];
    meta: {
      current_page: number;
      per_page: number;
      total: number;
    };
  };

  type CrumbAction = {
    type: string;
    payload: ICategory;
  };

  type DateAction = {
    type: string;
    payload: moment.Moment;
  };

  interface Window {
    Pusher: any;
  }
}
