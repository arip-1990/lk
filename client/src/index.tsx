import React from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { ConfigProvider } from "antd";
import { Auth } from './services/auth';
import locale from "antd/lib/locale/ru_RU";
import moment from "moment";
import App from "./App";

import "moment/locale/ru";

import "antd/dist/antd.css";
import "./sass/index.scss";

import { store } from "./store";

moment.locale("ru");

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  // <React.StrictMode>
    <ConfigProvider locale={locale}>
      <Provider store={store}>
        <BrowserRouter>
          <Auth>
            <App />
          </Auth>
        </BrowserRouter>
      </Provider>
    </ConfigProvider>
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
