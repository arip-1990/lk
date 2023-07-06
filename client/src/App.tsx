import React, { useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { Spin } from "antd";
import addNotification from "react-push-notification";

import { useAuth } from "./hooks/useAuth";
import Login from "./pages/Login";
import privateRoute from "./privateRoute";
import { Echo } from "./services/api";

import logoImage from "./images/logo-social.svg";

const Loader = () => <Spin delay={500} />;

const App: React.FC = () => {
  const { isAuth, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (user) {
      Echo.private(`App.Models.User.${user.id}`).notification(
        (e: { id: string; title: string; message: string; type: string }) => {
          addNotification({
            title: e.title,
            message: e.message,
            native: true,
            duration: 5000,
            icon: logoImage,
          });
        }
      );
    }
  }, [user]);

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
