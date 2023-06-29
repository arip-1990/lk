import React, { useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { Spin } from "antd";
import addNotification from "react-push-notification";

import { useAuth } from "./hooks/useAuth";
import Login from "./pages/Login";
import privateRoute from "./privateRoute";
import { Echo } from "./services/api";

const Loader = () => <Spin delay={500} />;

const App: React.FC = () => {
  const { isAuth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    Echo.private("statement").listen("StatementCreated", (e: any) => {
      console.log(e);
    });
  }, []);

  // useEffect(() => {
  //   addNotification({
  //     title: "notification",
  //     message: "message",
  //     native: true,
  //     duration: 10000,
  //   });
  // }, []);

  React.useEffect(() => {
    const path = location.pathname === "/login" ? "/" : location.pathname;
    if (isAuth === false) navigate("/login");
    else if (isAuth === true) navigate(path, { state: location.state });
  }, [isAuth]);

  return (
    <React.Suspense fallback={<Loader />}>
      <Routes>
        {isAuth ? privateRoute() : <Route path="/login" element={<Login />} />}
      </Routes>
    </React.Suspense>
  );
};

export default App;
