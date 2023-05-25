import React from "react";
import AuthContext from "./AuthContext";
import api from "../api";
import { IUser } from "../../models/IUser";
import { AxiosError } from "axios";

interface Props {
  checkOnInit?: boolean;
  children?: React.ReactNode;
}

const Auth: React.FC<Props> = ({ checkOnInit = true, children }) => {
  const [authState, setAuthState] = React.useState<{
    user: null | IUser;
    isAuth: null | boolean;
  }>({ user: null, isAuth: null });
  const user = authState.user;
  const isAuth = authState.isAuth;

  React.useEffect(() => {
    if (checkOnInit) checkAuth();
  }, [checkOnInit]);

  const login = (
    barcode: string
  ): Promise<{ signedIn: boolean; user?: IUser }> => {
    return new Promise(async (resolve, reject) => {
      try {
        // Sign in.
        const { data } = await api.post<{ token: string }>("/login", {
          barcode,
        });
        localStorage.setItem("token", data.token);

        // Fetch user.
        const user = await revalidate();

        return resolve({ signedIn: true, user });
      } catch (error) {
        const err = error as AxiosError;
        return reject(err);
      }
    });
  };

  const logout = () => {
    return new Promise<void>(async (resolve, reject) => {
      try {
        await api.post<void>("/logout");
        // Only sign out after the server has successfully responded.
        setAuthState({ user: null, isAuth: false });
        localStorage.removeItem("token");
        resolve();
      } catch (error) {
        const err = error as AxiosError;
        return reject(err);
      }
    });
  };

  const setUser = (user: IUser, isAuth: boolean = true) => {
    setAuthState({ user, isAuth });
  };

  const revalidate = (): Promise<undefined | IUser> => {
    return new Promise(async (resolve, reject) => {
      try {
        const { data } = await api.get<IUser>("/auth", { maxRedirects: 0 });

        setUser(data);
        resolve(data);
      } catch (error) {
        const err = error as AxiosError;
        if (err.response && err.response.status === 401) {
          // If there's a 401 error the user is not signed in.
          setAuthState({ user: null, isAuth: false });
          return resolve(undefined);
        } else {
          // If there's any other error, something has gone wrong.
          return reject(err);
        }
      }
    });
  };

  const checkAuth = (): Promise<boolean> => {
    return new Promise(async (resolve, reject) => {
      if (isAuth === null) {
        // The status is null if we haven't checked it, so we have to make a request.
        try {
          await revalidate();
          return resolve(true);
        } catch (error) {
          const err = error as AxiosError;
          if (err.response && err.response.status === 401) {
            // If there's a 401 error the user is not signed in.
            setAuthState({ user: null, isAuth: false });
            return resolve(false);
          } else {
            // If there's any other error, something has gone wrong.
            return reject(err);
          }
        }
      } else {
        // If it has been checked with the server before, we can just return the state.
        return resolve(isAuth);
      }
    });
  };

  return (
    <AuthContext.Provider
      children={children || null}
      value={{
        user,
        isAuth,
        login,
        logout,
        setUser,
        checkAuth,
      }}
    />
  );
};

export default Auth;
