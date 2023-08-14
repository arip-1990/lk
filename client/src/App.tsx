import { FC, Suspense, useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { Spin } from "antd";
import addNotification from "react-push-notification";

import { useAuth } from "./hooks/useAuth";
import Login from "./pages/Login";
import privateRoute from "./privateRoute";
import { centrifuge, getToken } from "./services/api";

import logoImage from "./images/logo-social.svg";

const Loader = () => <Spin delay={500} />;

const App: FC = () => {
  const { isAuth, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (user) {
      const sub = centrifuge.newSubscription(
        `notify:App.Models.User.${user.id}`,
        {
          getToken: (ctx) => getToken("broadcasting/auth", ctx),
        }
      );

      sub.on("publication", ({ data }) => {
        addNotification({
          title: data.title,
          message: `Описание: ${data.message}`,
          native: true,
          duration: 5000,
          icon: logoImage,
        });
      });

      sub.subscribe();

      centrifuge.connect();
    }
  }, [user]);

  useEffect(() => {
    const path = location.pathname === "/login" ? "/" : location.pathname;
    if (isAuth === false) navigate("/login");
    else if (isAuth === true) navigate(path, { state: location.state });
  }, [isAuth]);

  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        {isAuth ? privateRoute() : <Route path="/login" element={<Login />} />}
      </Routes>
    </Suspense>
  );
};

export default App;
