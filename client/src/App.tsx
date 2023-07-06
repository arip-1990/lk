import React, { useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { Spin } from "antd";
import addNotification from "react-push-notification";

import { useAuth } from "./hooks/useAuth";
import Login from "./pages/Login";
import privateRoute from "./privateRoute";
import { Echo } from "./services/api";
import { IUser } from "./models/IUser";
import { IStatement } from "./models/IStatement";

import logoImage from "./images/logo-social.svg";

const Loader = () => <Spin delay={500} />;

const App: React.FC = () => {
  const { isAuth, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    Echo.channel("statement").listen(
      "StatementCreated",
      (e: { user?: IUser; statement: IStatement }) => {
        if (isAuth !== null && e.user?.id !== user?.id) {
          addNotification({
            title: e.statement.category.name,
            message: e.statement.must,
            native: true,
            duration: 5000,
            icon: logoImage,
          });
        }
      }
    );
  }, [isAuth, user]);

  React.useEffect(() => {
    const path = location.pathname === "/login" ? "/" : location.pathname;
    if (isAuth === false) navigate("/login");
    else if (isAuth === true) navigate(path, { state: location.state });
  }, [isAuth, location.pathname, location.state, navigate]);

  return (
    <React.Suspense fallback={<Loader />}>
      <Routes>
        {isAuth ? privateRoute() : <Route path="/login" element={<Login />} />}
      </Routes>
    </React.Suspense>
  );
};

export default App;
