import ReactDOM from "react-dom/client";
import locale from "antd/lib/locale/ru_RU";
import moment from "moment";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { ConfigProvider } from "antd";
import { Notifications } from "react-push-notification";

import { Auth } from "./services/auth";
import App from "./App";

import "moment/locale/ru";

import 'react-contexify/ReactContexify.css';
import "antd/dist/antd.css";
import "./sass/index.scss";

import { store } from "./store";

moment.locale("ru");

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <ConfigProvider locale={locale}>
    <Provider store={store}>
      <BrowserRouter>
        <Auth>
          <Notifications />
          <App />
        </Auth>
      </BrowserRouter>
    </Provider>
  </ConfigProvider>
);
