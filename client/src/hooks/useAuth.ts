import { useContext } from "react";
import AuthContext from "../services/auth/AuthContext";

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth should only be used inside <Auth />");

  return context;
};

export { useAuth };
