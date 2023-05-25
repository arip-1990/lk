import {createContext} from "react";
import { IUser } from "../../models/IUser";

export interface ContextProps {
  user: null | IUser;
  isAuth: null | boolean;
  login: (barcode: string) => Promise<{ signedIn: boolean }>;
  logout: () => void;
  setUser: (user: IUser, isAuth?: boolean) => void;
  checkAuth: () => Promise<boolean>;
}

const AuthContext = createContext<ContextProps | undefined>(undefined);

export default AuthContext;
