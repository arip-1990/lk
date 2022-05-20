import { IProvider } from "./IProvider";
import { IStore } from "./IStore";

export interface IClaim extends Key {
  id: string;
  provider: IProvider | undefined;
  invoice: string | undefined;
  notDelivery: number | undefined;
  notAttachment: string | undefined;
  regrading: string | undefined;
  shortShelfLife: moment.Moment | undefined;
  deliveryAt: moment.Moment | undefined;
  createdAt: moment.Moment | undefined;
  store: IStore | undefined;
  editable: boolean;
}
