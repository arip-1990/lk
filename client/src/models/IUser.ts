import { IStore } from "./IStore";

export interface IUser {
    id: string;
    firstName: string;
    lastName: string;
    middleName: string | null;
    mobilePhone: string | null;
    internalPhones: string[];
    email: string | null;
    position: string;
    role: {name: string, description: string};
    stores: IStore[];
}
